import { Calculator } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { badgeVariants, cardVariants, pillVariants } from '@/components/ui/variants'
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
        <div className="mb-3 text-xs tracking-wider uppercase" style={{ color: THEME.primarySoft }}>
          {header.badge}
        </div>
        <h1
          className="font-display text-xl leading-tight md:text-2xl lg:text-3xl"
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
          className="mt-4 inline-flex flex-wrap gap-2.5 rounded-2xl px-3 py-3 sm:gap-3 sm:px-5 sm:py-4"
          style={{ background: THEME.surface }}
        >
          <button
            type="button"
            onClick={() => {
              setCategoryId('all')
            }}
            className={`${pillVariants({ active: categoryId === 'all' })} px-3 py-1.5`}
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
              className={`${pillVariants({ active: categoryId === name })} px-3 py-1.5`}
            >
              {name}
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-4 sm:gap-3 md:grid-cols-2 xl:grid-cols-3 xl:gap-5">
        {visibleTools.map((tool) => (
          <button
            type="button"
            key={tool.id}
            onClick={() => {
              navigate(tool.href)
            }}
            className={`${cardVariants()} rounded-xl`}
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
                className={badgeVariants({ tier: tool.tier })}
                style={{
                  background:
                    tool.tier !== 'free' ? 'rgba(197, 160, 89, 0.22)' : 'rgba(92, 236, 96, 0.18)',
                  color: tool.tier !== 'free' ? THEME.secondary : THEME.primary,
                  letterSpacing: '0.06em',
                  lineHeight: 1.05,
                }}
              >
                {tool.tier === 'free' ? 'FREE' : tool.tier.toUpperCase()}
              </span>
            </div>

            <div
              className="text-xs tracking-wider uppercase"
              style={{ color: 'var(--color-neutral-900)' }}
            >
              {tool.categoryName}
            </div>
            <h3
              className="mt-3 text-lg leading-tight font-semibold sm:text-xl"
              style={{ color: '#7A694A' }}
            >
              {tool.title}
            </h3>
            <p className="mt-3 text-sm leading-6" style={{ color: 'var(--color-neutral-900)' }}>
              {tool.description}
            </p>
            <div className="mt-5 h-px w-full" style={{ background: 'rgba(122, 105, 74, 0.12)' }} />
            <div className="mt-5 text-sm italic" style={{ color: THEME.primary }}>
              {content.tool.openToolLabel}
            </div>
          </button>
        ))}
      </section>
    </div>
  )
}
