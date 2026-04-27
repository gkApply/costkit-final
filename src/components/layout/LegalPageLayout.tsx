import ReactMarkdown from 'react-markdown'

type LegalPageLayoutProps = {
  title: string
  lastUpdated: string
  markdown: string
}

export default function LegalPageLayout({ title, lastUpdated, markdown }: LegalPageLayoutProps) {
  return (
    <div className="mx-auto max-w-[1380px] px-4 py-8 sm:px-6 md:py-10 lg:px-10 lg:py-12">
      <div className="space-y-8 sm:space-y-10">
        <header className="max-w-3xl space-y-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-500">
            LEGAL
          </div>
          <h1 className="font-display text-3xl leading-tight text-neutral-900 sm:text-4xl md:text-5xl">
            {title}
          </h1>
          <p className="text-sm text-neutral-500">Last updated: {lastUpdated}</p>
        </header>

        <article className="max-w-3xl text-base leading-relaxed text-neutral-700">
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h2 className="mb-4 mt-8 text-3xl font-semibold leading-tight text-neutral-900">
                  {children}
                </h2>
              ),
              h2: ({ children }) => (
                <h2 className="mb-4 mt-8 text-2xl font-semibold leading-tight text-neutral-900">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="mb-3 mt-6 text-xl font-semibold leading-tight text-neutral-900">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="mb-4 text-base leading-relaxed text-neutral-700">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="mb-4 list-disc space-y-2 pl-6 text-base leading-relaxed">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="mb-4 list-decimal space-y-2 pl-6 text-base leading-relaxed">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="text-base leading-relaxed text-neutral-700">{children}</li>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  className="text-brand-600 underline transition-colors hover:text-brand-700"
                >
                  {children}
                </a>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-neutral-900">{children}</strong>
              ),
            }}
          >
            {markdown}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  )
}
