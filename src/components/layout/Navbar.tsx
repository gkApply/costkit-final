import { site } from '@/config/site'

export function Navbar() {
  return (
    <header className="border-b">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4">
        <a href="/" className="font-semibold">
          {site.name}
        </a>
        <div className="flex flex-wrap gap-4">
          {site.nav.links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
          <a href={site.nav.cta.href}>{site.nav.cta.label}</a>
        </div>
      </nav>
    </header>
  )
}
