import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

const BOC_BASE = 'https://www.bankofcanada.ca/valet'

// ── Supabase admin client (service role — bypasses RLS) ───────────────────────

function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  return createClient(url, key)
}

// ── Handler ───────────────────────────────────────────────────────────────────

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Verify the cron caller is legitimate
  const authHeader = req.headers.authorization
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const supabase = getSupabaseAdmin()
  const today = new Date()
  const endDate = today.toISOString().split('T')[0]
  const startDate = new Date(today.getTime() - 14 * 86_400_000).toISOString().split('T')[0]

  let totalUpserted = 0

  try {
    // ── 1. Load currency series map from DB ─────────────────────────────────
    const { data: currencies, error: currErr } = await supabase
      .from('fx_currencies')
      .select('currency_code, current_daily_series_id')
      .eq('is_active', true)

    if (currErr || !currencies?.length) {
      throw new Error(`Could not load currencies: ${currErr?.message}`)
    }

    // Map: series_id -> currency_code
    const seriesMap: Record<string, string> = {}
    for (const c of currencies) {
      if (c.current_daily_series_id) {
        seriesMap[c.current_daily_series_id] = c.currency_code
      }
    }

    // ── 2. Fetch from Bank of Canada ─────────────────────────────────────────
    const url = `${BOC_BASE}/observations/group/FX_RATES_DAILY/json`
    const params = new URLSearchParams({ start_date: startDate, end_date: endDate })
    const bocRes = await fetch(`${url}?${params}`, {
      signal: AbortSignal.timeout(30_000),
    })

    if (!bocRes.ok) {
      throw new Error(`BoC API returned ${bocRes.status}`)
    }

    const payload = (await bocRes.json()) as {
      observations?: Array<Record<string, unknown>>
    }

    // ── 3. Parse into rows ───────────────────────────────────────────────────
    const rows: {
      currency_code: string
      rate_date: string
      cad_per_unit: number
      source_series_id: string
      source_type: string
    }[] = []

    for (const obs of payload.observations ?? []) {
      const rateDate = obs['d'] as string | undefined
      if (!rateDate) continue

      for (const [seriesId, currencyCode] of Object.entries(seriesMap)) {
        const entry = obs[seriesId] as { v?: string } | undefined
        const v = entry?.v
        if (!v || v === '' || v === 'nan') continue

        const num = parseFloat(v)
        if (isNaN(num)) continue

        rows.push({
          currency_code: currencyCode,
          rate_date: rateDate,
          cad_per_unit: num,
          source_series_id: seriesId,
          source_type: 'current_daily',
        })
      }
    }

    // ── 4. Upsert in chunks of 500 ───────────────────────────────────────────
    const CHUNK = 500
    for (let i = 0; i < rows.length; i += CHUNK) {
      const { error: upsertErr } = await supabase
        .from('fx_rates_daily')
        .upsert(rows.slice(i, i + CHUNK), { onConflict: 'currency_code,rate_date' })

      if (upsertErr) throw new Error(`Upsert failed: ${upsertErr.message}`)
      totalUpserted += Math.min(CHUNK, rows.length - i)
    }

    // ── 5. Log success ────────────────────────────────────────────────────────
    await supabase.from('fx_fetch_log').insert({
      fetch_type: 'weekly_update',
      status: 'success',
      records_upserted: totalUpserted,
      completed_at: new Date().toISOString(),
    })

    return res.status(200).json({
      ok: true,
      upserted: totalUpserted,
      dateRange: `${startDate} to ${endDate}`,
    })
  } catch (err) {
    // Log failure
    await supabase
      .from('fx_fetch_log')
      .insert({
        fetch_type: 'weekly_update',
        status: 'error',
        error_message: String(err),
        completed_at: new Date().toISOString(),
      })
      .catch(() => {}) // don't throw if log also fails

    return res.status(500).json({ error: String(err) })
  }
}
