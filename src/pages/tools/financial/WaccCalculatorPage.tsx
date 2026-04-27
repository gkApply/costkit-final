import { type ChangeEvent, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { site } from '@/config/site'

const THEME = {
  primarySoft: 'var(--color-brand-400)',
  text: 'var(--color-neutral-800)',
  textMuted: 'var(--color-neutral-700)',
  textSubtle: 'var(--color-neutral-500)',
  surface: 'var(--color-neutral-100)',
  surfaceAlt: 'var(--color-neutral-200)',
  card: '#ffffff',
  border: 'rgba(122, 105, 74, 0.12)',
  shadow: '0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.08)',
  primary: 'var(--color-brand-500)',
  secondary: 'var(--color-secondary-500)',
} as const

const INDUSTRY_REFERENCE_ROWS = [
  { industry: 'Advertising', bu: '1.02', bl: '1.28', de: '32.4%', wacc: '8.45%' },
  { industry: 'Aerospace/Defense', bu: '0.91', bl: '1.04', de: '18.9%', wacc: '7.12%' },
  { industry: 'Apparel', bu: '0.88', bl: '1.15', de: '41.2%', wacc: '7.88%' },
  { industry: 'Bank (Money Center)', bu: '0.34', bl: '1.22', de: '312.4%', wacc: '4.15%' },
  { industry: 'Beverage (Soft)', bu: '0.68', bl: '0.82', de: '25.1%', wacc: '6.33%' },
]

const SIZE_PREMIUM_ROWS = [
  { bucket: 'Micro Cap', range: '< $50m', premium: '6.50%' },
  { bucket: 'Decile 10a', range: '$50m – $100m', premium: '4.50%' },
  { bucket: 'Decile 9', range: '$100m – $200m', premium: '2.90%' },
  { bucket: 'Decile 8', range: '$200m – $500m', premium: '2.30%' },
  { bucket: 'Decile 7', range: '$500m – $1B', premium: '1.80%' },
]

const RF_REFERENCE_ROWS = [
  { benchmark: 'US 10Y Treasury', date: '2026-04-13', value: '4.25%' },
  { benchmark: 'Canada 10Y GoC', date: '2026-04-13', value: '3.18%' },
  { benchmark: 'US 20Y Treasury', date: '2026-04-13', value: '4.57%' },
]

const ERP_REFERENCE_ROWS = [
  { market: 'S&P 500', implied: '5.10%', historical: '5.70%' },
  { market: 'TSX Composite', implied: '5.85%', historical: '6.20%' },
  { market: 'STOXX Europe', implied: '5.35%', historical: '5.90%' },
]

const DEBT_REFERENCE_ROWS = [
  { rating: 'AA', spread: '0.90%', preTax: '5.10%' },
  { rating: 'A', spread: '1.15%', preTax: '5.35%' },
  { rating: 'BBB', spread: '1.55%', preTax: '5.75%' },
  { rating: 'BB', spread: '2.45%', preTax: '6.65%' },
]

const CSR_FACTORS = [
  {
    id: 'key-person',
    title: 'Key person dependence',
    helper: 'Owner >50% revenue? No succession plan?',
    max: 1.5,
  },
  {
    id: 'customer',
    title: 'Customer concentration',
    helper: 'Top customer >25% revenue? Top 5 >60%?',
    max: 1.5,
  },
  {
    id: 'supplier',
    title: 'Supplier concentration',
    helper: 'Single-source supplier dependencies?',
    max: 0.5,
  },
  {
    id: 'product',
    title: 'Product concentration',
    helper: 'Revenue from single product line?',
    max: 1.0,
  },
  {
    id: 'management',
    title: 'Management depth',
    helper: 'Can operations run without the owner?',
    max: 0.75,
  },
  {
    id: 'capital',
    title: 'Access to capital',
    helper: 'Leverage vs covenants, banking quality?',
    max: 1.0,
  },
  {
    id: 'working-capital',
    title: 'Working capital adequacy',
    helper: 'Seasonal strain, negative WC trends?',
    max: 0.5,
  },
  {
    id: 'regulatory',
    title: 'Regulatory / legal risk',
    helper: 'Pending litigation, licence dependencies?',
    max: 1.0,
  },
] as const

const REFERENCE_OPTIONS = {
  rf: ['US 10Y Treasury', 'Canada 10Y GoC', 'US 20Y Treasury'],
  erp: [
    'United States (S&P 500 Benchmark)',
    'Canada (TSX Composite Benchmark)',
    'European Union (STOXX Benchmark)',
  ],
  beta: ['Advertising', 'Aerospace/Defense', 'Apparel', 'Beverage (Soft)'],
  size: ['Micro Cap', 'Decile 10a', 'Decile 9', 'Decile 8'],
  debt: ['BBB Corporate Bonds', 'A Rated Corporate Bonds', 'BB High Yield'],
  csr: ['Private Company - General', 'Customer Concentration Heavy', 'Owner Dependent'],
  structure: [
    'Software (Systems & Application)',
    'Advertising',
    'Beverage (Soft)',
    'Bank (Money Center)',
  ],
} as const

const WACC_SECTIONS = [
  { id: 'intro', label: 'Input Assumptions' },
  { id: 'rf', label: 'Risk-Free Rate' },
  { id: 'erp', label: 'Equity Risk Premium' },
  { id: 'beta', label: 'Beta Analysis' },
  { id: 'size', label: 'Size Premium' },
  { id: 'csr', label: 'Company Risk Premium' },
  { id: 'debt', label: 'Cost of Debt' },
  { id: 'structure', label: 'Capital Structure' },
  { id: 'results', label: 'WACC Summary' },
] as const

function formatPercent(value: number, digits = 2): string {
  return `${Number(value).toFixed(digits)}%`
}

function numberFromInput(value: string): number {
  const next = parseFloat(value)
  return Number.isNaN(next) ? 0 : next
}

function LabeledField({
  label,
  value,
  onChange,
  suffix,
  hint,
  type = 'number',
  step = '0.01',
}: {
  label: string
  value: string | number
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  suffix?: string
  hint?: string
  type?: string
  step?: string
}) {
  return (
    <label className="block">
      <div
        className="text-[12px] font-bold tracking-[0.26em] uppercase"
        style={{ color: THEME.secondary }}
      >
        {label}
      </div>
      <div
        className="mt-4 flex min-h-[76px] items-center gap-3 rounded-[26px] border px-6 py-5"
        style={{ background: THEME.surfaceAlt, borderColor: 'transparent' }}
      >
        <input
          type={type}
          value={value}
          step={step}
          onChange={onChange}
          className="w-full bg-transparent text-[18px] font-medium outline-none md:text-[19px]"
          style={{ color: THEME.text }}
        />
        {suffix ? (
          <span className="text-sm font-medium" style={{ color: THEME.textMuted }}>
            {suffix}
          </span>
        ) : null}
      </div>
      {hint ? (
        <div className="mt-3 text-sm leading-6" style={{ color: THEME.textSubtle }}>
          {hint}
        </div>
      ) : null}
    </label>
  )
}

function ReferenceSelect({
  label,
  value,
  options,
  onChange,
  note,
  className = '',
}: {
  label: string
  value: string
  options: readonly string[]
  onChange: (value: string) => void
  note?: string
  className?: string
}) {
  return (
    <div className={className}>
      <div
        className="text-[12px] font-bold tracking-[0.24em] uppercase"
        style={{ color: THEME.secondary }}
      >
        {label}
      </div>
      <div
        className="mt-4 flex min-h-[76px] items-center rounded-[26px] border px-6 py-5"
        style={{ background: THEME.surfaceAlt, borderColor: 'transparent' }}
      >
        <select
          value={value}
          onChange={(event) => {
            onChange(event.target.value)
          }}
          className="w-full cursor-pointer bg-transparent pr-8 text-[18px] font-medium leading-tight outline-none md:text-[19px]"
          style={{ color: THEME.text }}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      {note ? (
        <div className="mt-3 text-sm leading-6" style={{ color: THEME.textSubtle }}>
          {note}
        </div>
      ) : null}
    </div>
  )
}

function DatePickerField({
  label,
  date,
  onChange,
}: {
  label: string
  date: Date | undefined
  onChange: (date: Date | undefined) => void
}) {
  const [open, setOpen] = useState(false)
  const dateLabel = date
    ? date.toLocaleDateString('en-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    : 'Select date'

  return (
    <div className="relative">
      <div
        className="text-[12px] font-bold tracking-[0.26em] uppercase"
        style={{ color: THEME.secondary }}
      >
        {label}
      </div>
      <button
        type="button"
        onClick={() => {
          setOpen((current) => !current)
        }}
        className="mt-4 w-full min-h-[64px] rounded-[20px] border px-4 py-4 text-left text-[16px] font-medium sm:min-h-[76px] sm:rounded-[26px] sm:px-6 sm:py-5 sm:text-[18px] md:text-[19px]"
        style={{ background: THEME.surfaceAlt, borderColor: 'transparent', color: THEME.text }}
      >
        <span>{dateLabel}</span>
      </button>
      {open ? (
        <div
          className="absolute top-[calc(100%+8px)] left-0 z-30 w-[min(92vw,360px)] rounded-[16px] border p-2 shadow-xl sm:rounded-[20px] sm:p-3"
          style={{ background: '#FFFFFF', borderColor: THEME.border }}
        >
          <Calendar
            mode="single"
            selected={date}
            onSelect={(nextDate) => {
              onChange(nextDate)
              setOpen(false)
            }}
            className="rounded-lg"
            captionLayout="dropdown"
          />
        </div>
      ) : null}
    </div>
  )
}

function SimpleTable({
  columns,
  rows,
  compact = false,
  emphasizeLastColumn = false,
}: {
  columns: string[]
  rows: string[][]
  compact?: boolean
  emphasizeLastColumn?: boolean
}) {
  return (
    <div
      className="mt-8 overflow-x-auto rounded-[20px] sm:rounded-[28px]"
      style={{
        background: THEME.card,
        border: `1px solid ${THEME.border}`,
        boxShadow: THEME.shadow,
      }}
    >
      <div className="min-w-[560px]">
        <div
          className="grid"
          style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}
        >
          {columns.map((column, index) => (
            <div
              key={column}
              className={`px-6 ${compact ? 'py-4' : 'py-5'} text-[12px] font-bold tracking-[0.18em] uppercase`}
              style={{
                color:
                  index === columns.length - 1 && emphasizeLastColumn
                    ? THEME.primary
                    : THEME.secondary,
                background: '#F6F4EF',
              }}
            >
              {column}
            </div>
          ))}
        </div>
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="grid border-t"
            style={{
              gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
              borderColor: 'rgba(122, 105, 74, 0.08)',
            }}
          >
            {row.map((cell, cellIndex) => (
              <div
                key={`${rowIndex}-${cellIndex}`}
                className={`px-6 ${compact ? 'py-4' : 'py-5'} text-[15px] leading-7`}
                style={{
                  color:
                    cellIndex === columns.length - 1 && emphasizeLastColumn
                      ? THEME.primary
                      : THEME.text,
                  fontWeight: cellIndex === columns.length - 1 && emphasizeLastColumn ? 700 : 500,
                }}
              >
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function CompanyRiskChecklist({
  factorValues,
  onFactorChange,
  singleValue,
  onSingleValueChange,
}: {
  factorValues: Record<string, number>
  onFactorChange: (factorId: string, value: number) => void
  singleValue: number
  onSingleValueChange: (value: number) => void
}) {
  const [mode, setMode] = useState<'checklist' | 'single'>('checklist')
  const total = CSR_FACTORS.reduce((sum, factor) => sum + (factorValues[factor.id] ?? 0), 0)

  return (
    <div className="mt-8">
      <div
        className="inline-flex overflow-hidden rounded-2xl border"
        style={{ borderColor: 'rgba(29,64,114,0.18)' }}
      >
        <button
          onClick={() => {
            setMode('checklist')
          }}
          className="cursor-pointer px-4 py-2.5 text-sm font-semibold sm:px-6 sm:py-3"
          style={{
            background: mode === 'checklist' ? '#24497A' : '#FFFFFF',
            color: mode === 'checklist' ? '#FFFFFF' : '#59657A',
          }}
        >
          Factor checklist
        </button>
        <button
          onClick={() => {
            setMode('single')
          }}
          className="cursor-pointer px-4 py-2.5 text-sm font-semibold sm:px-6 sm:py-3"
          style={{
            background: mode === 'single' ? '#24497A' : '#FFFFFF',
            color: mode === 'single' ? '#FFFFFF' : '#59657A',
          }}
        >
          Single value
        </button>
      </div>
      {mode === 'single' ? (
        <div
          className="mt-6 rounded-[28px] p-6"
          style={{ background: THEME.card, boxShadow: THEME.shadow }}
        >
          <LabeledField
            label="Company risk premium input"
            value={singleValue}
            onChange={(event) => {
              onSingleValueChange(numberFromInput(event.target.value))
            }}
            suffix="%"
            hint="Manual input remains the main number used in the model."
          />
        </div>
      ) : (
        <div
          className="mt-6 overflow-hidden rounded-[28px]"
          style={{ border: '1px solid rgba(29,64,114,0.10)', background: '#FFFFFF' }}
        >
          {CSR_FACTORS.map((factor, index) => (
            <div
              key={factor.id}
              className="grid items-center gap-3 px-4 py-4 sm:gap-4 sm:px-5"
              style={{
                gridTemplateColumns: '1fr',
                borderTop: index === 0 ? 'none' : '1px solid rgba(29,64,114,0.08)',
                background: index % 2 === 0 ? '#FFFFFF' : '#F9FBFF',
              }}
            >
              <div>
                <div className="text-[17px] font-semibold" style={{ color: '#24324A' }}>
                  {factor.title}
                </div>
                <div className="mt-2 text-[14px]" style={{ color: '#78859E' }}>
                  {factor.helper} Max: {factor.max.toFixed(2)}%
                </div>
              </div>
              <div className="grid grid-cols-[1fr_auto] items-center gap-3 sm:grid-cols-[1fr_90px] sm:gap-4">
                <input
                  type="range"
                  min={0}
                  max={factor.max}
                  step={0.25}
                  value={factorValues[factor.id] ?? 0}
                  onChange={(event) => {
                    onFactorChange(factor.id, numberFromInput(event.target.value))
                  }}
                  className="w-full cursor-pointer accent-teal-600"
                />
                <div className="text-right text-[18px] font-semibold" style={{ color: '#2E4A76' }}>
                  {formatPercent(factorValues[factor.id] ?? 0)}
                </div>
              </div>
            </div>
          ))}
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ background: '#D8EAEA', borderTop: '3px solid #278A84' }}
          >
            <div className="text-[16px] font-semibold" style={{ color: '#278A84' }}>
              Total company-specific risk premium (alpha)
            </div>
            <div className="text-[19px] font-bold" style={{ color: '#278A84' }}>
              {formatPercent(total)}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function WaccCalculatorPage() {
  const [section, setSection] = useState<(typeof WACC_SECTIONS)[number]['id']>('intro')
  const [analysisDate, setAnalysisDate] = useState<Date | undefined>(new Date('2026-04-13'))
  const [region, setRegion] = useState('United States (S&P 500 Benchmark)')
  const [industryName, setIndustryName] = useState('Software (Systems & Application)')
  const [riskFreeRate, setRiskFreeRate] = useState(4.25)
  const [erp, setErp] = useState(5.1)
  const [beta, setBeta] = useState(1.04)
  const [sizePremium, setSizePremium] = useState(0.7)
  const [singleCompanyRisk, setSingleCompanyRisk] = useState(0.5)
  const [costOfDebt, setCostOfDebt] = useState(5.6)
  const [taxRate, setTaxRate] = useState(25)
  const [deRatio, setDeRatio] = useState(0.43)

  const [rfReference, setRfReference] = useState('US 10Y Treasury')
  const [erpReference, setErpReference] = useState('United States (S&P 500 Benchmark)')
  const [betaReference, setBetaReference] = useState('Advertising')
  const [sizeReference, setSizeReference] = useState('Decile 10a')
  const [debtReference, setDebtReference] = useState('BBB Corporate Bonds')
  const [csrReference, setCsrReference] = useState('Private Company - General')
  const [structureReference, setStructureReference] = useState('Software (Systems & Application)')

  const [csrFactors, setCsrFactors] = useState<Record<string, number>>({
    'key-person': 0,
    customer: 0,
    supplier: 0,
    product: 0,
    management: 0,
    capital: 0,
    'working-capital': 0,
    regulatory: 0,
  })

  const checklistCompanyRisk = useMemo(
    () => CSR_FACTORS.reduce((sum, factor) => sum + (csrFactors[factor.id] ?? 0), 0),
    [csrFactors],
  )
  const derived = useMemo(() => {
    const companyRiskUsed = Math.max(singleCompanyRisk, checklistCompanyRisk)
    const costOfEquity = riskFreeRate + beta * erp + sizePremium + companyRiskUsed
    const weightDebt = deRatio / (1 + deRatio)
    const weightEquity = 1 - weightDebt
    const afterTaxCostOfDebt = costOfDebt * (1 - taxRate / 100)
    const wacc = costOfEquity * weightEquity + afterTaxCostOfDebt * weightDebt
    return { costOfEquity, weightDebt, weightEquity, afterTaxCostOfDebt, wacc }
  }, [
    beta,
    checklistCompanyRisk,
    costOfDebt,
    deRatio,
    erp,
    riskFreeRate,
    singleCompanyRisk,
    sizePremium,
    taxRate,
  ])

  const setFactor = (factorId: string, value: number) => {
    setCsrFactors((current) => ({ ...current, [factorId]: value }))
  }

  const waccPageTitle = site.meta['/financial-tools/wacc-calculator'].title

  return (
    <div className="font-sans">
      <div className="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-10">
        <div className="space-y-6 sm:space-y-8">
          <section>
            <Link
              to="/financial-tools"
              className="mb-4 inline-flex items-center gap-2 text-sm font-medium"
              style={{ color: THEME.primary }}
            >
              <ArrowLeft size={16} />
              Back to Financial Tools
            </Link>
            <div
              className="mb-3 text-[11px] tracking-[0.26em] uppercase"
              style={{ color: THEME.primarySoft }}
            >
              Financial Tools / Cost of Capital / WACC Calculator
            </div>
            <h1
              className="font-display text-3xl leading-tight sm:text-4xl md:text-5xl"
              style={{ color: THEME.text }}
            >
              {waccPageTitle}
            </h1>
          </section>

          <div className="flex gap-6 items-start">
            <div className="w-56 shrink-0">
              <div
                className="rounded-[30px] p-4 lg:sticky lg:top-28"
                style={{ background: THEME.surface }}
              >
                <div className="px-3 pt-2 pb-4">
                  <div
                    className="mb-2 text-[10px] tracking-[0.22em] uppercase"
                    style={{ color: THEME.primarySoft }}
                  >
                    Valuation Engine v2.4
                  </div>
                  <h2 className="font-display text-2xl" style={{ color: THEME.primary }}>
                    WACC Calculator
                  </h2>
                </div>
                <div className="space-y-1">
                  {WACC_SECTIONS.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSection(item.id)
                      }}
                      className="w-full cursor-pointer rounded-2xl px-4 py-3 text-left text-sm transition-all"
                      style={{
                        background: section === item.id ? THEME.card : 'transparent',
                        color: section === item.id ? THEME.primary : 'var(--color-neutral-800)',
                        boxShadow: section === item.id ? THEME.shadow : 'none',
                        fontWeight: section === item.id ? 700 : 500,
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <section
                className="rounded-[24px] p-5 sm:rounded-[32px] sm:p-8"
                style={{ background: THEME.card, boxShadow: THEME.shadow }}
              >
                {section === 'intro' && (
                  <div className="space-y-8">
                    <div>
                      <div
                        className="mb-3 text-[11px] tracking-[0.24em] uppercase"
                        style={{ color: THEME.primarySoft }}
                      >
                        Input Assumptions
                      </div>
                      <h2
                        className="font-display text-3xl leading-tight"
                        style={{ color: THEME.text }}
                      >
                        Setup the analysis context
                      </h2>
                    </div>
                    <div className="grid gap-5 sm:gap-8 md:grid-cols-2">
                      <DatePickerField
                        label="Analysis Date"
                        date={analysisDate}
                        onChange={setAnalysisDate}
                      />
                      <ReferenceSelect
                        label="Target Region"
                        value={region}
                        options={REFERENCE_OPTIONS.erp}
                        onChange={setRegion}
                        note="This dropdown selects a reference set only. Manual inputs below remain fully editable."
                      />
                      <div className="md:col-span-2">
                        <ReferenceSelect
                          label="Industry Name"
                          value={industryName}
                          options={[
                            'Software (Systems & Application)',
                            'Advertising',
                            'Aerospace/Defense',
                            'Apparel',
                            'Beverage (Soft)',
                          ]}
                          onChange={setIndustryName}
                          note="Choose the industry reference set you want to view alongside your manual assumptions."
                        />
                      </div>
                    </div>
                    <SimpleTable
                      columns={['Industry Name', 'BU', 'BL', 'D/E Ratio', 'WACC (%)']}
                      rows={INDUSTRY_REFERENCE_ROWS.map((row) => [
                        row.industry,
                        row.bu,
                        row.bl,
                        row.de,
                        row.wacc,
                      ])}
                      emphasizeLastColumn
                    />
                  </div>
                )}
                {section === 'rf' && (
                  <div>
                    <h2
                      className="font-display text-3xl leading-tight"
                      style={{ color: THEME.text }}
                    >
                      Risk-free rate
                    </h2>
                    <p className="mt-4 text-lg leading-8" style={{ color: THEME.textMuted }}>
                      Manual input remains primary. Use the dropdown below to open a reference
                      benchmark table.
                    </p>
                    <div className="mt-8 grid gap-5 sm:gap-8 md:grid-cols-2">
                      <LabeledField
                        label="Risk-free rate input"
                        value={riskFreeRate}
                        onChange={(event) => {
                          setRiskFreeRate(numberFromInput(event.target.value))
                        }}
                        suffix="%"
                      />
                      <ReferenceSelect
                        label="Reference benchmark"
                        value={rfReference}
                        options={REFERENCE_OPTIONS.rf}
                        onChange={setRfReference}
                        note="This does not auto-fill the input. It is for reference only."
                      />
                    </div>
                    <SimpleTable
                      compact
                      columns={['Benchmark', 'Date', 'Value']}
                      rows={RF_REFERENCE_ROWS.map((row) => [row.benchmark, row.date, row.value])}
                    />
                  </div>
                )}
                {section === 'erp' && (
                  <div>
                    <h2
                      className="font-display text-3xl leading-tight"
                      style={{ color: THEME.text }}
                    >
                      Equity risk premium
                    </h2>
                    <div className="mt-8 grid gap-5 sm:gap-8 md:grid-cols-2">
                      <LabeledField
                        label="Equity risk premium input"
                        value={erp}
                        onChange={(event) => {
                          setErp(numberFromInput(event.target.value))
                        }}
                        suffix="%"
                      />
                      <ReferenceSelect
                        label="Reference market"
                        value={erpReference}
                        options={REFERENCE_OPTIONS.erp}
                        onChange={setErpReference}
                        note="View reference ERP sets without overriding your manual input."
                      />
                    </div>
                    <SimpleTable
                      compact
                      columns={['Market', 'Implied ERP', 'Historical ERP']}
                      rows={ERP_REFERENCE_ROWS.map((row) => [
                        row.market,
                        row.implied,
                        row.historical,
                      ])}
                    />
                  </div>
                )}
                {section === 'beta' && (
                  <div>
                    <h2
                      className="font-display text-3xl leading-tight"
                      style={{ color: THEME.text }}
                    >
                      Beta analysis
                    </h2>
                    <div className="mt-8 grid gap-5 sm:gap-8 md:grid-cols-2">
                      <LabeledField
                        label="Levered beta input"
                        value={beta}
                        onChange={(event) => {
                          setBeta(numberFromInput(event.target.value))
                        }}
                        suffix="x"
                      />
                      <ReferenceSelect
                        label="Industry benchmark"
                        value={betaReference}
                        options={REFERENCE_OPTIONS.beta}
                        onChange={setBetaReference}
                        note="Dummy industry data shown below for layout and reference."
                      />
                    </div>
                    <SimpleTable
                      columns={['Industry Name', 'BU', 'BL', 'D/E Ratio', 'WACC (%)']}
                      rows={INDUSTRY_REFERENCE_ROWS.map((row) => [
                        row.industry,
                        row.bu,
                        row.bl,
                        row.de,
                        row.wacc,
                      ])}
                      emphasizeLastColumn
                    />
                  </div>
                )}
                {section === 'size' && (
                  <div>
                    <h2
                      className="font-display text-3xl leading-tight"
                      style={{ color: THEME.text }}
                    >
                      Size premium
                    </h2>
                    <div className="mt-8 grid gap-5 sm:gap-8 md:grid-cols-2">
                      <LabeledField
                        label="Size premium input"
                        value={sizePremium}
                        onChange={(event) => {
                          setSizePremium(numberFromInput(event.target.value))
                        }}
                        suffix="%"
                      />
                      <ReferenceSelect
                        label="Reference size bucket"
                        value={sizeReference}
                        options={REFERENCE_OPTIONS.size}
                        onChange={setSizeReference}
                        note="Select the reference decile you want to compare against."
                      />
                    </div>
                    <SimpleTable
                      compact
                      columns={['Bucket', 'Market Cap Range', 'Premium']}
                      rows={SIZE_PREMIUM_ROWS.map((row) => [row.bucket, row.range, row.premium])}
                    />
                  </div>
                )}
                {section === 'csr' && (
                  <div>
                    <h2
                      className="font-display text-3xl leading-tight"
                      style={{ color: THEME.text }}
                    >
                      Company risk premium
                    </h2>
                    <ReferenceSelect
                      className="mt-8"
                      label="Checklist template"
                      value={csrReference}
                      options={REFERENCE_OPTIONS.csr}
                      onChange={setCsrReference}
                      note="Template choice is illustrative only."
                    />
                    <CompanyRiskChecklist
                      factorValues={csrFactors}
                      onFactorChange={setFactor}
                      singleValue={singleCompanyRisk}
                      onSingleValueChange={setSingleCompanyRisk}
                    />
                  </div>
                )}
                {section === 'debt' && (
                  <div>
                    <h2
                      className="font-display text-3xl leading-tight"
                      style={{ color: THEME.text }}
                    >
                      Cost of debt
                    </h2>
                    <div className="mt-8 grid gap-5 sm:gap-8 md:grid-cols-2">
                      <LabeledField
                        label="Pre-tax cost of debt input"
                        value={costOfDebt}
                        onChange={(event) => {
                          setCostOfDebt(numberFromInput(event.target.value))
                        }}
                        suffix="%"
                      />
                      <ReferenceSelect
                        label="Reference debt benchmark"
                        value={debtReference}
                        options={REFERENCE_OPTIONS.debt}
                        onChange={setDebtReference}
                        note="Choose a rating band or benchmark family to review."
                      />
                      <LabeledField
                        label="Marginal tax rate"
                        value={taxRate}
                        onChange={(event) => {
                          setTaxRate(numberFromInput(event.target.value))
                        }}
                        suffix="%"
                      />
                    </div>
                    <SimpleTable
                      compact
                      columns={['Rating', 'Spread', 'Pre-tax Cost']}
                      rows={DEBT_REFERENCE_ROWS.map((row) => [row.rating, row.spread, row.preTax])}
                    />
                  </div>
                )}
                {section === 'structure' && (
                  <div>
                    <h2
                      className="font-display text-3xl leading-tight"
                      style={{ color: THEME.text }}
                    >
                      Capital structure
                    </h2>
                    <div className="mt-8 grid gap-5 sm:gap-8 md:grid-cols-2">
                      <LabeledField
                        label="Debt / equity ratio input"
                        value={deRatio}
                        onChange={(event) => {
                          setDeRatio(numberFromInput(event.target.value))
                        }}
                        suffix="x"
                      />
                      <ReferenceSelect
                        label="Reference industry set"
                        value={structureReference}
                        options={REFERENCE_OPTIONS.structure}
                        onChange={setStructureReference}
                        note="This reference table is illustrative and does not auto-fill the ratio."
                      />
                    </div>
                    <SimpleTable
                      columns={['Industry Name', 'BU', 'BL', 'D/E Ratio', 'WACC (%)']}
                      rows={INDUSTRY_REFERENCE_ROWS.map((row) => [
                        row.industry,
                        row.bu,
                        row.bl,
                        row.de,
                        row.wacc,
                      ])}
                      emphasizeLastColumn
                    />
                  </div>
                )}
                {section === 'results' && (
                  <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
                    <div className="rounded-[28px] p-6" style={{ background: THEME.surfaceAlt }}>
                      <div
                        className="mb-3 text-[11px] tracking-[0.22em] uppercase"
                        style={{ color: THEME.secondary }}
                      >
                        Cost of Equity
                      </div>
                      <div className="text-[36px] font-semibold" style={{ color: THEME.secondary }}>
                        {formatPercent(derived.costOfEquity)}
                      </div>
                    </div>
                    <div
                      className="rounded-[28px] p-6"
                      style={{
                        background: 'linear-gradient(135deg, #0D520D 0%, #2A6B24 100%)',
                        color: '#FFFFFF',
                      }}
                    >
                      <div className="mb-3 text-[11px] tracking-[0.22em] uppercase">
                        Derived WACC
                      </div>
                      <div className="text-[36px] font-semibold">{formatPercent(derived.wacc)}</div>
                    </div>
                  </div>
                )}
              </section>
            </div>

            <div className="w-72 shrink-0">
              <div
                className="rounded-[24px] p-5 sm:rounded-[30px] sm:p-7 lg:sticky lg:top-28"
                style={{ background: THEME.surfaceAlt }}
              >
                <div
                  className="mb-6 text-[11px] tracking-[0.24em] uppercase"
                  style={{ color: THEME.primary }}
                >
                  Live Ledger Summary
                </div>
                <div className="space-y-5">
                  <div
                    className="flex items-end justify-between border-b pb-4"
                    style={{ borderColor: 'rgba(113,122,108,0.18)' }}
                  >
                    <span className="text-sm" style={{ color: THEME.textMuted }}>
                      Risk-free rate
                    </span>
                    <span className="font-mono text-xl">{formatPercent(riskFreeRate)}</span>
                  </div>
                  <div
                    className="flex items-end justify-between border-b pb-4"
                    style={{ borderColor: 'rgba(113,122,108,0.18)' }}
                  >
                    <span className="text-sm" style={{ color: THEME.textMuted }}>
                      Cost of Equity (Ke)
                    </span>
                    <span className="font-mono text-xl">{formatPercent(derived.costOfEquity)}</span>
                  </div>
                  <div
                    className="flex items-end justify-between border-b pb-4"
                    style={{ borderColor: 'rgba(113,122,108,0.18)' }}
                  >
                    <span className="text-sm" style={{ color: THEME.textMuted }}>
                      After-tax Cost of Debt
                    </span>
                    <span className="font-mono text-xl">
                      {formatPercent(derived.afterTaxCostOfDebt)}
                    </span>
                  </div>
                  <div
                    className="flex items-end justify-between border-b pb-4"
                    style={{ borderColor: 'rgba(113,122,108,0.18)' }}
                  >
                    <span className="text-sm" style={{ color: THEME.textMuted }}>
                      Equity Weight
                    </span>
                    <span className="font-mono text-xl">
                      {formatPercent(derived.weightEquity * 100, 1)}
                    </span>
                  </div>
                  <div className="rounded-[26px] p-6" style={{ background: THEME.card }}>
                    <div
                      className="font-mono text-5xl font-semibold tracking-tight"
                      style={{ color: THEME.primary }}
                    >
                      {formatPercent(derived.wacc)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
