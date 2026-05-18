import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Download, TrendingUp, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { content } from '@/config/content'
import PageContainer from '@/components/layout/PageContainer'
import { usePageMeta } from '@/hooks/usePageMeta'
import { Skeleton } from '@/components/ui/skeleton'

// ── Design tokens ─────────────────────────────────────────────────────────────

const THEME = {
  primarySoft: 'var(--color-brand-400)',
  primary: 'var(--color-brand-500)',
  text: 'var(--color-neutral-950)',
  textMuted: 'var(--color-neutral-600)',
  textLight: 'var(--color-neutral-400)',
  surface: 'var(--color-neutral-100)',
  surfaceAlt: 'var(--color-neutral-200)',
  border: 'rgba(122, 105, 74, 0.18)',
  divider: 'rgba(122, 105, 74, 0.10)',
  titleGold: '#7A694A',
  white: '#FFFFFF',
} as const

const CHEVRON_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%237A694A' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`

const selectStyle: React.CSSProperties = {
  appearance: 'none',
  background: THEME.white,
  border: `1px solid ${THEME.border}`,
  borderRadius: '0.5rem',
  color: THEME.text,
  cursor: 'pointer',
  fontSize: '0.875rem',
  height: '2.5rem',
  paddingLeft: '0.75rem',
  paddingRight: '2.25rem',
  backgroundImage: CHEVRON_SVG,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 0.65rem center',
  outline: 'none',
  width: '100%',
}

const inputStyle: React.CSSProperties = {
  background: THEME.white,
  border: `1px solid ${THEME.border}`,
  borderRadius: '0.5rem',
  color: THEME.text,
  fontSize: '0.875rem',
  height: '2.5rem',
  paddingLeft: '0.75rem',
  paddingRight: '0.75rem',
  outline: 'none',
  width: '100%',
}

const labelStyle: React.CSSProperties = {
  color: THEME.textMuted,
  fontSize: '0.7rem',
  fontWeight: 500,
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
  display: 'block',
  marginBottom: '0.375rem',
}

// ── Types ─────────────────────────────────────────────────────────────────────

type Currency = { currency_code: string; currency_name: string }
type RateRow = {
  rate_date: string
  cad_per_unit: number | null
  observations_used: number
  source_type: string | null
}
type Basis = 'daily' | 'avg_30' | 'avg_90'
type FetchState = 'idle' | 'loading' | 'success' | 'error'

// ── Helpers ───────────────────────────────────────────────────────────────────

function todayIso(): string {
  return new Date().toISOString().split('T')[0]
}

function formatDirect(v: number | null): string {
  if (v == null) return 'NA'
  return v.toFixed(6)
}

function formatReciprocal(v: number | null): string {
  if (v == null || v === 0) return 'NA'
  const r = 1 / v
  if (r >= 100) return r.toFixed(2)
  if (r >= 1) return r.toFixed(4)
  return r.toFixed(6)
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ExchangeRatePage() {
  usePageMeta({
    title: 'Exchange Rate Lookup — CostKit',
    description: 'Bank of Canada daily FX rates for 27 currencies, 2010 to present.',
  })

  const navigate = useNavigate()
  const { exchangeRateTool } = content

  const [currencies, setCurrencies] = useState<Currency[]>([])
  const [selectedCurrency, setSelectedCurrency] = useState('USD')
  const [selectedDate, setSelectedDate] = useState(todayIso)
  const [basis, setBasis] = useState<Basis>('daily')
  const [rows, setRows] = useState<RateRow[] | null>(null)
  const [fetchState, setFetchState] = useState<FetchState>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    supabase
      .from('fx_currencies')
      .select('currency_code, currency_name')
      .eq('is_active', true)
      .order('currency_code')
      .then(({ data }) => {
        if (data?.length) setCurrencies(data)
      })
  }, [])

  const handleLookup = useCallback(async () => {
    setFetchState('loading')
    setErrorMessage('')
    setRows(null)
    const { data, error } = await supabase.rpc('get_fx_rate_table', {
      p_currency_code: selectedCurrency,
      p_selected_date: selectedDate,
      p_basis: basis,
    })
    if (error) {
      setErrorMessage('Failed to load rates. Check your connection and try again.')
      setFetchState('error')
      return
    }
    setRows(data ?? [])
    setFetchState('success')
  }, [selectedCurrency, selectedDate, basis])

  const handleDownload = useCallback(() => {
    if (!rows?.length) return
    const basisLabel = exchangeRateTool.basisOptions.find((o) => o.value === basis)?.label ?? basis
    const headers = [
      'date',
      `1 ${selectedCurrency} = CAD`,
      `1 CAD = ${selectedCurrency}`,
      'observations',
    ]
    const lines = rows.map((r) => [
      r.rate_date,
      formatDirect(r.cad_per_unit),
      formatReciprocal(r.cad_per_unit),
      r.observations_used,
    ])
    const csv = [headers, ...lines].map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `boc_fx_${selectedCurrency}_${basisLabel}_${selectedDate}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }, [rows, selectedCurrency, basis, selectedDate, exchangeRateTool.basisOptions])

  const lookupDisabled = fetchState === 'loading' || !selectedCurrency || !selectedDate

  return (
    <PageContainer className="py-8 md:py-10 lg:py-12">
      {/* Back link */}
      <button
        type="button"
        onClick={() => navigate('/macro')}
        className="mb-8 inline-flex items-center gap-1.5 text-sm transition-opacity hover:opacity-70"
        style={{ color: THEME.primarySoft }}
      >
        <ArrowLeft size={14} aria-hidden="true" />
        Back to Macro
      </button>

      {/* Page header */}
      <div className="mb-8 max-w-3xl">
        <div className="mb-3 text-xs tracking-wider uppercase" style={{ color: THEME.primarySoft }}>
          Rates
        </div>
        <h1
          className="font-display text-xl leading-tight md:text-2xl lg:text-3xl"
          style={{ color: THEME.text }}
        >
          {exchangeRateTool.heading}
        </h1>
        <p className="mt-4 text-base leading-7" style={{ color: THEME.textMuted }}>
          {exchangeRateTool.description}
        </p>
      </div>

      {/* Controls panel */}
      <div
        className="mb-6 rounded-xl p-5 md:p-6"
        style={{
          background: THEME.surface,
          border: `1px solid ${THEME.border}`,
        }}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
          {/* Currency */}
          <div className="flex flex-col" style={{ minWidth: '13rem' }}>
            <label htmlFor="fx-currency" style={labelStyle}>
              Currency
            </label>
            <select
              id="fx-currency"
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              style={selectStyle}
            >
              {currencies.map((c) => (
                <option key={c.currency_code} value={c.currency_code}>
                  {c.currency_code} — {c.currency_name}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div className="flex flex-col" style={{ minWidth: '10rem' }}>
            <label htmlFor="fx-date" style={labelStyle}>
              Date
            </label>
            <input
              id="fx-date"
              type="date"
              value={selectedDate}
              min="2010-01-04"
              max={todayIso()}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Rate basis */}
          <div className="flex flex-col" style={{ minWidth: '11rem' }}>
            <label htmlFor="fx-basis" style={labelStyle}>
              Rate basis
            </label>
            <select
              id="fx-basis"
              value={basis}
              onChange={(e) => setBasis(e.target.value as Basis)}
              style={selectStyle}
            >
              {exchangeRateTool.basisOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {/* Look up */}
          <button
            type="button"
            onClick={handleLookup}
            disabled={lookupDisabled}
            style={{
              background: lookupDisabled ? 'rgba(13, 82, 13, 0.4)' : THEME.primary,
              color: THEME.white,
              border: 'none',
              borderRadius: '0.5rem',
              cursor: lookupDisabled ? 'not-allowed' : 'pointer',
              fontSize: '0.875rem',
              fontWeight: 600,
              height: '2.5rem',
              padding: '0 1.5rem',
              transition: 'opacity 150ms ease',
              whiteSpace: 'nowrap',
            }}
          >
            {fetchState === 'loading' ? 'Loading…' : 'Look up'}
          </button>
        </div>
      </div>

      {/* Output area */}
      <div className="min-h-48">
        {/* Loading */}
        {fetchState === 'loading' && (
          <div className="space-y-2" aria-busy="true">
            <Skeleton className="h-10 w-full rounded-xl" />
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-11 w-full rounded-xl" />
            ))}
          </div>
        )}

        {/* Error */}
        {fetchState === 'error' && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl px-5 py-4"
            style={{
              background: 'rgba(239, 68, 68, 0.05)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
            }}
          >
            <AlertCircle
              size={15}
              className="mt-0.5 shrink-0"
              style={{ color: 'var(--color-danger-600)' }}
              aria-hidden="true"
            />
            <p className="text-sm" style={{ color: 'var(--color-danger-700)' }}>
              {errorMessage}
            </p>
          </div>
        )}

        {/* Idle */}
        {fetchState === 'idle' && (
          <div
            className="flex flex-col items-center justify-center rounded-xl py-16 text-center"
            style={{
              background: THEME.surface,
              border: `1px solid ${THEME.border}`,
            }}
          >
            <TrendingUp
              size={28}
              style={{ color: THEME.primarySoft }}
              aria-hidden="true"
              className="mb-3"
            />
            <p className="text-sm font-medium" style={{ color: THEME.text }}>
              No results yet
            </p>
            <p className="mt-1 text-sm" style={{ color: THEME.textMuted }}>
              Select a currency and date, then click Look up.
            </p>
          </div>
        )}

        {/* Empty */}
        {fetchState === 'success' && rows !== null && rows.length === 0 && (
          <p className="py-8 text-sm" style={{ color: THEME.textMuted }}>
            No data available for {selectedCurrency} on or before {selectedDate}.
          </p>
        )}

        {/* Results */}
        {fetchState === 'success' && rows !== null && rows.length > 0 && (
          <div className="space-y-4">
            <div
              className="overflow-x-auto rounded-xl"
              style={{ border: `1px solid ${THEME.border}` }}
            >
              <table className="w-full text-sm">
                <thead>
                  <tr
                    style={{
                      background: THEME.surface,
                      borderBottom: `1px solid ${THEME.divider}`,
                    }}
                  >
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase"
                      style={{ color: THEME.textMuted }}
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-right text-xs font-medium tracking-wider uppercase"
                      style={{ color: THEME.textMuted }}
                    >
                      1 {selectedCurrency} = CAD
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-right text-xs font-medium tracking-wider uppercase"
                      style={{ color: THEME.textMuted }}
                    >
                      1 CAD = {selectedCurrency}
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-right text-xs font-medium tracking-wider uppercase"
                      style={{ color: THEME.textMuted }}
                    >
                      Observations
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, idx) => (
                    <tr
                      key={row.rate_date}
                      style={{
                        borderTop: idx > 0 ? `1px solid ${THEME.divider}` : undefined,
                        background: idx % 2 !== 0 ? 'rgba(244, 243, 240, 0.7)' : THEME.white,
                      }}
                    >
                      <td className="px-4 py-3 tabular-nums text-sm" style={{ color: THEME.text }}>
                        {row.rate_date}
                      </td>
                      <td
                        className="px-4 py-3 text-right font-mono tabular-nums text-sm"
                        style={{ color: THEME.text }}
                      >
                        {row.cad_per_unit != null ? (
                          formatDirect(row.cad_per_unit)
                        ) : (
                          <span style={{ color: THEME.textLight }}>NA</span>
                        )}
                      </td>
                      <td
                        className="px-4 py-3 text-right font-mono tabular-nums text-sm"
                        style={{ color: THEME.titleGold }}
                      >
                        {row.cad_per_unit != null ? (
                          formatReciprocal(row.cad_per_unit)
                        ) : (
                          <span style={{ color: THEME.textLight }}>NA</span>
                        )}
                      </td>
                      <td
                        className="px-4 py-3 text-right tabular-nums text-sm"
                        style={{ color: THEME.textMuted }}
                      >
                        {row.observations_used}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: THEME.divider }} />

            {/* Source note + download */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <p className="text-xs max-w-prose leading-relaxed" style={{ color: THEME.textMuted }}>
                {exchangeRateTool.sourceNote}
              </p>
              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex shrink-0 items-center gap-2 transition-opacity hover:opacity-70 active:scale-[0.98]"
                style={{
                  background: THEME.surface,
                  border: `1px solid ${THEME.border}`,
                  borderRadius: '0.5rem',
                  color: THEME.titleGold,
                  cursor: 'pointer',
                  fontSize: '0.8125rem',
                  fontStyle: 'italic',
                  padding: '0.4rem 1rem',
                  whiteSpace: 'nowrap',
                }}
                aria-label={`Download results as CSV for ${selectedCurrency}`}
              >
                <Download size={13} aria-hidden="true" />
                Download CSV
              </button>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  )
}
