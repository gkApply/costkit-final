import { Link } from 'react-router-dom'
import { content } from '@/config/content'

function Footer() {
  const isInternalHref = (href: string) => href.startsWith('/')

  return (
    <footer className="bg-neutral-950 text-white">
      <div className="mx-auto max-w-[1380px] px-4 py-12 sm:px-6 lg:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 pb-8">
          <p
            className="font-display text-2xl font-semibold"
            style={{ color: 'var(--color-brand-400)' }}
          >
            CostKit
          </p>
          <p className="text-sm text-neutral-400">{content.footer.tagline}</p>
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {content.footer.columns.map((column) => (
            <div key={column.heading}>
              <h3 className="mb-4 text-xs tracking-widest text-neutral-400 uppercase">
                {column.heading}
              </h3>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    {isInternalHref(link.href) ? (
                      <Link
                        to={link.href}
                        className="text-sm text-neutral-400 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-sm text-neutral-400 transition-colors hover:text-white"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-neutral-800 pt-8">
          <p className="max-w-2xl text-xs leading-relaxed text-neutral-600">
            {content.footer.disclaimer}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-neutral-500">{content.footer.copyright}</p>
          <div className="flex items-center gap-4">
            {content.footer.social
              .filter((item) => item.href.trim() !== '')
              .map((item) => (
                <a
                  key={item.platform}
                  href={item.href}
                  className="text-xs text-neutral-500 transition-colors hover:text-white"
                >
                  {item.platform}
                </a>
              ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export { Footer }
export default Footer
