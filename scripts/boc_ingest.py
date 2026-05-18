"""
Bank of Canada FX Historical Ingestion
Loads all 27 currencies from 2010-01-01 to today.

Two data layers:
  Layer A: legacy noon rates (2010-01-01 to 2017-04-28)
  Layer B: current daily average rates (2017-01-01 to today)

If both exist for the same date, current_daily wins (upsert handles this).
Missing dates are NOT stored — NA is generated at query time.

Run once from the scripts folder:
  cd scripts
  python boc_ingest.py
"""

import os
import time
from datetime import date
from pathlib import Path
from dotenv import load_dotenv
import requests
from supabase import create_client, Client

# ── Load .env from project root (one folder up from scripts/) ─────────────────

load_dotenv(Path(__file__).parent.parent / ".env")

# VITE_SUPABASE_URL is the name used in your project .env
# Try that first, fall back to plain SUPABASE_URL if someone renamed it
SUPABASE_URL = (
    os.environ.get("VITE_SUPABASE_URL")
    or os.environ.get("SUPABASE_URL")
    or ""
)
SUPABASE_SERVICE_ROLE_KEY = (
    os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    or os.environ.get("SUPABASE_SECRET_KEY")
    or ""
)

if not SUPABASE_URL:
    raise SystemExit("ERROR: VITE_SUPABASE_URL not found in .env")
if not SUPABASE_SERVICE_ROLE_KEY:
    raise SystemExit("ERROR: SUPABASE_SERVICE_ROLE_KEY not found in .env")

# ── Config ────────────────────────────────────────────────────────────────────

BOC_BASE        = "https://www.bankofcanada.ca/valet"
CHUNK_SIZE      = 500   # rows per Supabase upsert call
REQUEST_TIMEOUT = 90    # seconds before giving up on a BoC API request

# ── Supabase client (service role — bypasses RLS) ─────────────────────────────

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

# ── Helpers ───────────────────────────────────────────────────────────────────

def fetch_boc_group(group_id: str, start_date: str, end_date: str) -> dict:
    """
    Fetch all observations for a BoC Valet group between two dates.
    Raises requests.exceptions.Timeout if BoC takes longer than REQUEST_TIMEOUT.
    Raises requests.exceptions.RequestException on any other network error.
    Raises requests.exceptions.HTTPError if BoC returns a non-200 status.
    """
    url    = f"{BOC_BASE}/observations/group/{group_id}/json"
    params = {"start_date": start_date, "end_date": end_date}
    print(f"  GET {url}?start_date={start_date}&end_date={end_date}")
    resp   = requests.get(url, params=params, timeout=REQUEST_TIMEOUT)
    resp.raise_for_status()
    return resp.json()


def build_rows(
    payload:     dict,
    series_map:  dict[str, str],
    source_type: str,
) -> list[dict]:
    """
    Parse BoC observations payload into Supabase row dicts.

    series_map: { series_id -> currency_code }
      e.g. { 'FXUSDCAD': 'USD', 'FXEURCAD': 'EUR', ... }

    Only appends rows where a real numeric value exists.
    Skips blank, None, or 'nan' values — NA is generated at query time.
    """
    rows = []
    for obs in payload.get("observations", []):
        rate_date = obs.get("d")
        if not rate_date:
            continue
        for series_id, currency_code in series_map.items():
            raw = obs.get(series_id, {})
            if not isinstance(raw, dict):
                continue
            v = raw.get("v")
            if v is None or v == "" or v == "nan":
                continue
            try:
                value = float(v)
            except (ValueError, TypeError):
                continue
            rows.append({
                "currency_code":    currency_code,
                "rate_date":        rate_date,
                "cad_per_unit":     value,
                "source_series_id": series_id,
                "source_type":      source_type,
            })
    return rows


def upsert_rows(rows: list[dict]) -> int:
    """
    Upsert rows into fx_rates_daily in chunks of CHUNK_SIZE.
    On conflict (same currency_code + rate_date), the existing row is updated.
    Returns total number of rows sent.
    """
    if not rows:
        return 0
    total = 0
    for i in range(0, len(rows), CHUNK_SIZE):
        chunk = rows[i : i + CHUNK_SIZE]
        supabase.table("fx_rates_daily").upsert(
            chunk, on_conflict="currency_code,rate_date"
        ).execute()
        total += len(chunk)
        print(f"    upserted rows {i + 1}–{i + len(chunk)}")
    return total


def get_series_maps() -> tuple[dict[str, str], dict[str, str]]:
    """
    Load currency metadata from Supabase fx_currencies table.
    Returns two dicts:
      legacy_map:  { legacy_noon_series_id  -> currency_code }
      current_map: { current_daily_series_id -> currency_code }
    Currencies with no legacy series (e.g. SAR) are simply absent from legacy_map.
    """
    result = (
        supabase.table("fx_currencies")
        .select("currency_code, current_daily_series_id, legacy_noon_series_id")
        .eq("is_active", True)
        .execute()
    )
    currencies = result.data or []

    if not currencies:
        raise SystemExit(
            "ERROR: fx_currencies table is empty. "
            "Run the migration and seed first (npx supabase db push)."
        )

    legacy_map:  dict[str, str] = {}
    current_map: dict[str, str] = {}

    for c in currencies:
        code = c["currency_code"]
        if c.get("current_daily_series_id"):
            current_map[c["current_daily_series_id"]] = code
        if c.get("legacy_noon_series_id"):
            legacy_map[c["legacy_noon_series_id"]] = code

    return legacy_map, current_map


# ── Main ──────────────────────────────────────────────────────────────────────

def full_historical_load() -> None:
    today = date.today().isoformat()

    print("\n=== Bank of Canada FX — Full Historical Load ===")
    print(f"    Supabase project : {SUPABASE_URL}")
    print(f"    Run date         : {today}\n")

    legacy_map, current_map = get_series_maps()
    print(f"  Currencies loaded  : {len(current_map)} current, {len(legacy_map)} with legacy noon\n")

    total_upserted   = 0
    layer_a_ok       = False
    layer_b_ok       = False

    # ── Layer A: Legacy noon rates 2010-01-01 to 2017-04-28 ──────────────────
    # These are the Bank of Canada's historical noon-rate series.
    # After April 28 2017 the BoC switched to daily average rates.
    print("Layer A: Legacy noon rates (2010-01-01 to 2017-04-28)")
    try:
        legacy_payload = fetch_boc_group(
            group_id   = "LEGACY_NOON_RATES",
            start_date = "2010-01-01",
            end_date   = "2017-04-28",
        )
        legacy_rows = build_rows(legacy_payload, legacy_map, "legacy_noon")
        print(f"  Rows parsed: {len(legacy_rows)}")
        n = upsert_rows(legacy_rows)
        total_upserted += n
        layer_a_ok = True
        print(f"  ✓ Layer A complete — {n} rows upserted.\n")

    except requests.exceptions.Timeout:
        print(
            "  ✗ Timed out after 90 seconds.\n"
            "    The BoC API was too slow. Re-run the script to retry Layer A.\n"
            "    Any rows already written are safe — upsert will not duplicate them.\n"
        )
    except requests.exceptions.HTTPError as e:
        print(f"  ✗ BoC API returned an error: {e}\n"
              "    Re-run to retry.\n")
    except requests.exceptions.RequestException as e:
        print(f"  ✗ Network error: {e}\n"
              "    Check your internet connection and re-run.\n")
    except Exception as e:
        print(f"  ✗ Unexpected error in Layer A: {e}\n")

    # Small pause — be polite to the BoC API
    time.sleep(1)

    # ── Layer B: Current daily average rates 2017-01-01 to today ─────────────
    # These are the Bank of Canada's current daily average FX series.
    # Where Layer A and B overlap (Jan–Apr 2017), current_daily wins via upsert.
    print(f"Layer B: Current daily rates (2017-01-01 to {today})")
    try:
        current_payload = fetch_boc_group(
            group_id   = "FX_RATES_DAILY",
            start_date = "2017-01-01",
            end_date   = today,
        )
        current_rows = build_rows(current_payload, current_map, "current_daily")
        print(f"  Rows parsed: {len(current_rows)}")
        n = upsert_rows(current_rows)
        total_upserted += n
        layer_b_ok = True
        print(f"  ✓ Layer B complete — {n} rows upserted.\n")

    except requests.exceptions.Timeout:
        print(
            "  ✗ Timed out after 90 seconds.\n"
            "    Re-run the script to retry Layer B.\n"
            "    Any rows already written are safe.\n"
        )
    except requests.exceptions.HTTPError as e:
        print(f"  ✗ BoC API returned an error: {e}\n"
              "    Re-run to retry.\n")
    except requests.exceptions.RequestException as e:
        print(f"  ✗ Network error: {e}\n"
              "    Check your internet connection and re-run.\n")
    except Exception as e:
        print(f"  ✗ Unexpected error in Layer B: {e}\n")

    # ── Log result to Supabase ────────────────────────────────────────────────
    status = "success" if (layer_a_ok and layer_b_ok) else "partial"
    supabase.table("fx_fetch_log").insert({
        "fetch_type":       "full_historical",
        "status":           status,
        "records_upserted": total_upserted,
        "completed_at":     date.today().isoformat(),
    }).execute()

    # ── Summary ───────────────────────────────────────────────────────────────
    print("=== Summary ===")
    print(f"  Layer A (legacy noon)    : {'✓ OK' if layer_a_ok else '✗ FAILED — re-run'}")
    print(f"  Layer B (current daily)  : {'✓ OK' if layer_b_ok else '✗ FAILED — re-run'}")
    print(f"  Total rows upserted      : {total_upserted}")
    print(f"  Log status               : {status}\n")

    if layer_a_ok and layer_b_ok:
        print("Run this in Supabase SQL Editor to verify coverage:")
        print("""
  select
    currency_code,
    count(*)        as observations,
    min(rate_date)  as first_date,
    max(rate_date)  as last_date
  from fx_rates_daily
  group by currency_code
  order by currency_code;
        """)
    else:
        print("One or more layers failed. Fix the error above and re-run.")
        print("It is safe to re-run — existing rows will not be duplicated.\n")


if __name__ == "__main__":
    full_historical_load()