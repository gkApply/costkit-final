import { Link, useLocation } from 'react-router-dom'
import PageContainer from '@/components/layout/PageContainer'
import { navLinkVariants } from '@/components/ui/variants'
import { site } from '@/config/site'
import { cn } from '@/lib/utils'

function Navbar() {
  const { pathname } = useLocation()

  return (
    <header
      className="sticky top-0 z-20 border-b"
      style={{
        backgroundColor: 'color-mix(in oklab, var(--color-neutral-50) 88%, transparent)',
        backdropFilter: 'blur(18px)',
        borderColor: 'color-mix(in oklab, var(--color-brand-200) 28%, transparent)',
      }}
    >
      <PageContainer>
        <div className="relative flex h-16 items-center gap-4">
          <div className="shrink-0">
            <Link
              to="/financial-tools"
              className="whitespace-nowrap font-display text-3xl font-semibold lg:text-4xl"
              style={{ color: 'var(--color-brand-500)' }}
            >
              CostKit
            </Link>
          </div>

          <nav
            aria-label="Primary"
            className="flex-1 flex justify-center items-center gap-5 lg:gap-7 hidden md:flex"
          >
            {site.nav.links.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/' && pathname.startsWith(`${item.href}/`))

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(navLinkVariants({ active: isActive }), 'whitespace-nowrap')}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-3">
            <div className="hidden items-center gap-3 md:flex">
              <Link
                to={site.nav.login.href}
                className="inline-flex h-10 items-center whitespace-nowrap px-4 text-sm font-semibold text-neutral-800 transition-colors hover:text-neutral-900"
              >
                {site.nav.login.label}
              </Link>
              <Link
                to={site.nav.cta.href}
                className="inline-flex h-10 items-center whitespace-nowrap rounded-xl bg-brand-500 px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
              >
                {site.nav.cta.label}
              </Link>
            </div>

            <button
              type="button"
              aria-label="Open menu"
              className="inline-flex size-11 items-center justify-center rounded-xl border border-neutral-300 text-neutral-800 md:hidden"
            >
              Menu
            </button>
          </div>
        </div>
      </PageContainer>
    </header>
  )
}

export { Navbar }
export default Navbar
