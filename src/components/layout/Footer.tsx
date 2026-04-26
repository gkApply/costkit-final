import { site } from '@/config/site'
import { content } from '@/config/content'

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-7xl p-6">
        <p className="font-semibold">{site.name}</p>
        <p>{content.footer.copyright}</p>
      </div>
    </footer>
  )
}
