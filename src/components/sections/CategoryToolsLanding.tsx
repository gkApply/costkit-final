import { Calculator } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { content } from '@/config/content'
import { getSubcategories, getToolsByCategory, type Tool } from '@/config/tools'

type CategoryPageHeader = {
  badge: string
  heading: string
  subheading: string
}

const THEME = {
  /** Soft brand — kicker / accents */
  primarySoft: 'var(--color-brand-400)',
  text: 'var(--color-neutral-950)',
  textMuted: 'var(--color-neutral-600)',
  surface: 'var(--color-neutral-100)',
  surfaceAlt: 'var(--color-neutral-200)',
  border: 'rgba(122, 105, 74, 0.15)',
  primary: 'var(--color-brand-500)',
  secondary: 'var(--color-secondary-500)',
} as const

const ACTIVE_PILL = 'linear-gradient(135deg, #0D520D 0%, #2A6B24 100%)' as const

type ToolWithCategoryName = Tool & { categoryName: string }

export function CategoryToolsLanding({
  category,
  header,
}: {
  category: string
  header: CategoryPageHeader
}) {
  const navigate = useNavigate()
  const [categoryId, setCategoryId] = useState<'all' | string>('all')
  const subcategoryOptions = getSubcategories(category).filter((s) => s !== 'All tools')

  const visibleTools: ToolWithCategoryName[] = useMemo(() => {
    const list = getToolsByCategory(category)
    if (categoryId === 'all') {
      return list.map((tool) => ({ ...tool, categoryName: tool.subcategory }))
    }
    return list
      .filter((tool) => tool.subcategory === categoryId)
      .map((tool) => ({ ...tool, categoryName: tool.subcategory }))
  }, [category, categoryId])

  return (
    <div className="space-y-8 md:space-y-10">
      <section className="max-w-4xl">
        <div
          className="mb-3 text-[11px] tracking-[0.26em] uppercase"
          style={{ color: THEME.primarySoft }}
        >
          {header.badge}
        </div>
        <h1
          className="font-display text-3xl leading-tight sm:text-4xl md:text-5xl"
          style={{ color: THEME.text }}
        >
          {header.heading}
        </h1>
        <p
          className="mt-4 max-w-3xl text-base leading-7 sm:text-lg sm:leading-8"
          style={{ color: THEME.textMuted }}
        >
          {header.subheading}
        </p>
        <div
          className="mt-7 inline-flex flex-wrap gap-2.5 rounded-[22px] px-3 py-3 sm:gap-3 sm:rounded-[28px] sm:px-5 sm:py-4"
          style={{ background: THEME.surface }}
        >
          <button
            type="button"
            onClick={() => {
              setCategoryId('all')
            }}
            className="cursor-pointer rounded-full px-4 py-2.5 text-sm font-medium sm:px-5 sm:py-3"
            style={{
              background: categoryId === 'all' ? ACTIVE_PILL : THEME.surfaceAlt,
              color: categoryId === 'all' ? '#FFFFFF' : THEME.text,
            }}
          >
            All tools
          </button>
          {subcategoryOptions.map((name) => (
            <button
              type="button"
              key={name}
              onClick={() => {
                setCategoryId(name)
              }}
              className="cursor-pointer rounded-full px-4 py-2.5 text-sm font-medium sm:px-5 sm:py-3"
              style={{
                background: categoryId === name ? ACTIVE_PILL : THEME.surfaceAlt,
                color: categoryId === name ? '#FFFFFF' : THEME.text,
              }}
            >
              {name}
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-5 sm:gap-6 md:grid-cols-2 xl:grid-cols-3 xl:gap-8">
        {visibleTools.map((tool) => (
          <button
            type="button"
            key={tool.id}
            onClick={() => {
              navigate(tool.href)
            }}
            className="bg-white rounded-[20px] px-5 py-4 text-left shadow-md transition-all duration-200 hover:-translate-y-1 sm:rounded-[24px] sm:px-6 sm:py-5"
            style={{
              border:
                tool.tier !== 'free'
                  ? '1px solid rgba(197, 160, 89, 0.31)'
                  : `1px solid ${THEME.border}`,
            }}
          >
            <div className="mb-6 flex items-start justify-between gap-3">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-full"
                style={{ background: '#DDEBD9' }}
              >
                <Calculator size={17} style={{ color: THEME.primary }} />
              </div>
              <span
                className="rounded-full px-1 py-0.5 font-bold uppercase"
                style={{
                  background:
                    tool.tier !== 'free' ? 'rgba(197, 160, 89, 0.22)' : 'rgba(92, 236, 96, 0.18)',
                  color: tool.tier !== 'free' ? THEME.secondary : THEME.primary,
                  fontSize: '0.65rem',
                  letterSpacing: '0.06em',
                  lineHeight: 1.05,
                }}
              >
                {tool.tier === 'free' ? 'FREE' : tool.tier.toUpperCase()}
              </span>
            </div>

            <div
              className="text-[11px] tracking-[0.2em] uppercase"
              style={{ color: 'var(--color-neutral-900)' }}
            >
              {tool.categoryName}
            </div>
            <h3
              className="mt-3 text-[22px] leading-tight font-semibold sm:text-[24px]"
              style={{ color: '#7A694A' }}
            >
              {tool.title}
            </h3>
            <p
              className="mt-3 min-h-[52px] text-[14px] leading-6"
              style={{ color: 'var(--color-neutral-900)' }}
            >
              {tool.description}
            </p>
            <div className="mt-5 h-px w-full" style={{ background: 'rgba(122, 105, 74, 0.12)' }} />
            <div className="mt-5 text-[13px] italic" style={{ color: THEME.primary }}>
              {content.tool.openToolLabel}
            </div>
          </button>
        ))}
      </section>
    </div>
  )
}
