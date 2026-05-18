-- ─────────────────────────────────────────────────────────────────────────────
-- TABLE 1: fx_currencies
-- Reference table. One row per currency. Seeded once, rarely changes.
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists fx_currencies (
  id                      bigserial primary key,
  currency_code           text not null unique,        -- e.g. 'USD'
  currency_name           text not null,               -- e.g. 'US dollar'
  current_daily_series_id text not null,               -- e.g. 'FXUSDCAD'
  legacy_noon_series_id   text,                        -- e.g. 'IEXE0101' (null if none)
  legacy_close_series_id  text,                        -- null for most currencies
  monthly_series_id       text,
  annual_series_id        text,
  reciprocal_series_id    text,
  is_active               boolean not null default true,
  created_at              timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLE 2: fx_rates_daily
-- Long-form storage. One row per currency per date.
-- Do NOT store rows for missing dates — generate NA at query time.
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists fx_rates_daily (
  id               bigserial primary key,
  currency_code    text not null references fx_currencies(currency_code),
  rate_date        date not null,
  cad_per_unit     numeric(18,8),                       -- nullable: only store real observations
  source_series_id text,                                -- which BoC series this came from
  source_type      text not null,                       -- 'current_daily' or 'legacy_noon'
  fetched_at       timestamptz not null default now(),
  unique(currency_code, rate_date)
);

create index if not exists idx_fx_rates_currency_date
  on fx_rates_daily(currency_code, rate_date desc);

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLE 3: fx_fetch_log
-- Audit trail for ingestion jobs. Service role only.
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists fx_fetch_log (
  id               bigserial primary key,
  fetch_type       text not null,                      -- 'full_historical' or 'weekly_update'
  started_at       timestamptz not null default now(),
  completed_at     timestamptz,
  status           text not null,                      -- 'success' or 'error'
  records_upserted integer default 0,
  error_message    text
);

-- ─────────────────────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- fx_currencies and fx_rates_daily: public read, no public write
-- fx_fetch_log: service role only (no public policy)
-- ─────────────────────────────────────────────────────────────────────────────

alter table fx_currencies  enable row level security;
alter table fx_rates_daily enable row level security;
alter table fx_fetch_log   enable row level security;

create policy "fx_currencies_public_read"
  on fx_currencies for select using (true);

create policy "fx_rates_daily_public_read"
  on fx_rates_daily for select using (true);

-- fx_fetch_log has no public policy — service role key bypasses RLS

-- ─────────────────────────────────────────────────────────────────────────────
-- SEED: 27 currencies
-- Sources:
--   current_daily_series_id  → FX_RATES_DAILY group (2017-present)
--   legacy_noon_series_id    → LEGACY_NOON_RATES group (2010-2017)
--   legacy_close_series_id   → LEGACY_CLOSING_RATES group (limited currencies only)
-- ─────────────────────────────────────────────────────────────────────────────

insert into fx_currencies (
  currency_code, currency_name,
  current_daily_series_id, legacy_noon_series_id, legacy_close_series_id,
  monthly_series_id, annual_series_id, reciprocal_series_id
) values
  ('AUD','Australian dollar',    'FXAUDCAD','IEXE1601', 'IEXE1601.CL',  'FXMAUDCAD','FXAAUDCAD','FXCADAUD'),
  ('BRL','Brazilian real',       'FXBRLCAD','IEXE2801', null,           'FXMBRLCAD','FXABRLCAD','FXCADBRL'),
  ('CNY','Chinese renminbi',     'FXCNYCAD','IEXE2201', null,           'FXMCNYCAD','FXACNYCAD','FXCADCNY'),
  ('EUR','Euro',                 'FXEURCAD','EUROCAE01','EUROCAE01.CL', 'FXMEURCAD','FXAEURCAD','FXCADEUR'),
  ('HKD','Hong Kong dollar',     'FXHKDCAD','IEXE1401', 'IEXE1401.CL', 'FXMHKDCAD','FXAHKDCAD','FXCADHKD'),
  ('INR','Indian rupee',         'FXINRCAD','IEXE3001', null,           'FXMINRCAD','FXAINRCAD','FXCADINR'),
  ('IDR','Indonesian rupiah',    'FXIDRCAD','IEXE2601', null,           'FXMIDRCAD','FXAIDRCAD','FXCADIDR'),
  ('JPY','Japanese yen',         'FXJPYCAD','IEXE0701', 'IEXE0701.CL', 'FXMJPYCAD','FXAJPYCAD','FXCADJPY'),
  ('MYR','Malaysian ringgit',    'FXMYRCAD','IEXE3201', null,           'FXMMYRCAD','FXAMYRCAD','FXCADMYR'),
  ('MXN','Mexican peso',         'FXMXNCAD','IEXE2001', 'IEXE2001.CL', 'FXMMXNCAD','FXAMXNCAD','FXCADMXN'),
  ('NZD','New Zealand dollar',   'FXNZDCAD','IEXE1901', 'IEXE1901.CL', 'FXMNZDCAD','FXANZDCAD','FXCADNZD'),
  ('NOK','Norwegian krone',      'FXNOKCAD','IEXE0901', 'IEXE0901.CL', 'FXMNOKCAD','FXANOKCAD','FXCADNOK'),
  ('PEN','Peruvian sol',         'FXPENCAD','IEXE5201', null,           'FXMPENCAD','FXAPENCAD','FXCADPEN'),
  ('PLN','Polish zloty',         'FXPLNCAD','IEXE2401', null,           'FXMPLNCAD','FXAPLNCAD','FXCADPLN'),
  ('RUB','Russian ruble',        'FXRUBCAD','IEXE2101', null,           'FXMRUBCAD','FXARUBCAD','FXCADRUB'),
  ('SAR','Saudi riyal',          'FXSARCAD', null,      null,           'FXMSARCAD','FXASARCAD','FXCADSAR'),
  ('SGD','Singapore dollar',     'FXSGDCAD','IEXE3701', null,           'FXMSGDCAD','FXASGDCAD','FXCADSGD'),
  ('ZAR','South African rand',   'FXZARCAD','IEXE3401', null,           'FXMZARCAD','FXAZARCAD','FXCADZAR'),
  ('KRW','South Korean won',     'FXKRWCAD','IEXE3101', null,           'FXMKRWCAD','FXAKRWCAD','FXCADKRW'),
  ('SEK','Swedish krona',        'FXSEKCAD','IEXE1001', 'IEXE1001.CL', 'FXMSEKCAD','FXASEKCAD','FXCADSEK'),
  ('CHF','Swiss franc',          'FXCHFCAD','IEXE1101', 'IEXE1101.CL', 'FXMCHFCAD','FXACHFCAD','FXCADCHF'),
  ('TWD','Taiwanese dollar',     'FXTWDCAD','IEXE3501', null,           'FXMTWDCAD','FXATWDCAD','FXCADTWD'),
  ('THB','Thai baht',            'FXTHBCAD','IEXE3601', null,           'FXMTHBCAD','FXATHBCAD','FXCADTHB'),
  ('TRY','Turkish lira',         'FXTRYCAD','IEXE5802', null,           'FXMTRYCAD','FXATRYCAD','FXCADTRY'),
  ('GBP','UK pound sterling',    'FXGBPCAD','IEXE1201', 'IEXE1201.CL', 'FXMGBPCAD','FXAGBPCAD','FXCADGBP'),
  ('USD','US dollar',            'FXUSDCAD','IEXE0101', 'IEXE0102',    'FXMUSDCAD','FXAUSDCAD','FXCADUSD'),
  ('VND','Vietnamese dong',      'FXVNDCAD','IEXE6503', null,           'FXMVNDCAD','FXAVNDCAD','FXCADVND')
on conflict (currency_code) do update
  set currency_name           = excluded.currency_name,
      current_daily_series_id = excluded.current_daily_series_id,
      legacy_noon_series_id   = excluded.legacy_noon_series_id,
      legacy_close_series_id  = excluded.legacy_close_series_id,
      monthly_series_id       = excluded.monthly_series_id,
      annual_series_id        = excluded.annual_series_id,
      reciprocal_series_id    = excluded.reciprocal_series_id;

-- ─────────────────────────────────────────────────────────────────────────────
-- QUERY FUNCTION: get_fx_rate_table
-- Called from the frontend via supabase.rpc()
-- Returns the last 7 available observations for a currency/date/basis combo
-- ─────────────────────────────────────────────────────────────────────────────

create or replace function get_fx_rate_table(
  p_currency_code text,
  p_selected_date date,
  p_basis         text    -- 'daily' | 'avg_30' | 'avg_90'
)
returns table (
  rate_date         date,
  cad_per_unit      numeric,
  observations_used bigint,
  source_type       text
)
language sql
stable
as $$
  with last_7 as (
    select r.rate_date
    from   fx_rates_daily r
    where  r.currency_code = p_currency_code
      and  r.rate_date    <= p_selected_date
    order  by r.rate_date desc
    limit  7
  )
  select
    d.rate_date,

    case p_basis
      when 'daily' then (
        select r.cad_per_unit
        from   fx_rates_daily r
        where  r.currency_code = p_currency_code
          and  r.rate_date     = d.rate_date
        limit  1
      )
      when 'avg_30' then (
        select avg(x.cad_per_unit)
        from (
          select r.cad_per_unit
          from   fx_rates_daily r
          where  r.currency_code = p_currency_code
            and  r.rate_date    <= d.rate_date
            and  r.cad_per_unit is not null
          order  by r.rate_date desc
          limit  30
        ) x
      )
      when 'avg_90' then (
        select avg(x.cad_per_unit)
        from (
          select r.cad_per_unit
          from   fx_rates_daily r
          where  r.currency_code = p_currency_code
            and  r.rate_date    <= d.rate_date
            and  r.cad_per_unit is not null
          order  by r.rate_date desc
          limit  90
        ) x
      )
    end as cad_per_unit,

    case p_basis
      when 'daily'  then 1::bigint
      when 'avg_30' then (
        select count(*)
        from (
          select 1
          from   fx_rates_daily r
          where  r.currency_code = p_currency_code
            and  r.rate_date    <= d.rate_date
            and  r.cad_per_unit is not null
          order  by r.rate_date desc
          limit  30
        ) x
      )
      when 'avg_90' then (
        select count(*)
        from (
          select 1
          from   fx_rates_daily r
          where  r.currency_code = p_currency_code
            and  r.rate_date    <= d.rate_date
            and  r.cad_per_unit is not null
          order  by r.rate_date desc
          limit  90
        ) x
      )
    end as observations_used,

    case p_basis
      when 'daily' then (
        select r.source_type
        from   fx_rates_daily r
        where  r.currency_code = p_currency_code
          and  r.rate_date     = d.rate_date
        limit  1
      )
      else null
    end as source_type

  from  last_7 d
  order by d.rate_date desc;
$$;