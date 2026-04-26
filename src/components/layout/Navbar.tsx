import { Link, useLocation } from 'react-router-dom'
import { site } from '@/config/site'

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
      <div className="mx-auto flex max-w-[1380px] items-center justify-between gap-4 px-4 py-6 sm:px-6 lg:px-10">
        <div className="flex min-w-0 w-full items-center gap-6 lg:w-auto lg:gap-16">
          <Link
            to="/financial-tools"
            className="font-display text-4xl font-semibold whitespace-nowrap lg:text-[42px]"
            style={{ color: 'var(--color-brand-500)' }}
          >
            CostKit
          </Link>

          <nav className="flex min-w-0 flex-1 items-center gap-5 overflow-x-auto pb-1 sm:gap-6 lg:gap-9">
            {site.nav.links.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/' && pathname.startsWith(`${item.href}/`))

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`border-b-2 pb-2 text-[16px] font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? 'border-brand-500 text-brand-500'
                      : 'border-transparent text-neutral-700 opacity-60 hover:opacity-100'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to={site.nav.login.href}
            className="px-3 py-2 text-sm font-semibold text-neutral-700 transition-colors hover:text-neutral-900"
          >
            {site.nav.login.label}
          </Link>
          <Link
            to={site.nav.cta.href}
            className="rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
          >
            {site.nav.cta.label}
          </Link>
        </div>
      </div>
    </header>
  )
}

export { Navbar }
export default Navbar
