import { Link } from 'react-router-dom'
import PageContainer from '@/components/layout/PageContainer'
import { content } from '@/config/content'

const legalLinks = content.footer.columns.find((column) => column.heading === 'Legal')?.links ?? []

function Footer() {
  return (
    <footer
      className="border-t border-neutral-300"
      style={{ backgroundColor: 'color-mix(in oklab, var(--color-neutral-50) 88%, white)' }}
    >
      <PageContainer className="py-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div className="flex flex-col items-center gap-1 sm:flex-row sm:items-baseline sm:gap-3">
            <p className="font-display text-xl text-brand-600">CostKit</p>
            <p className="text-center text-sm font-medium text-neutral-600 sm:text-left">
              {content.footer.copyright}
            </p>
          </div>

          <nav
            className="flex w-full max-w-md flex-wrap items-center justify-center gap-y-1 sm:max-w-none sm:flex-nowrap sm:justify-end"
            aria-label="Legal"
          >
            {legalLinks.map((item, index) => (
              <span key={item.href} className="inline-flex items-center">
                {index > 0 ? (
                  <span className="select-none text-neutral-400 mx-2" aria-hidden="true">
                    ·
                  </span>
                ) : null}
                <Link
                  to={item.href}
                  className="text-sm font-semibold text-neutral-700 transition-colors hover:text-neutral-900"
                >
                  {item.label}
                </Link>
              </span>
            ))}
          </nav>
        </div>
      </PageContainer>
    </footer>
  )
}

export { Footer }
export default Footer
