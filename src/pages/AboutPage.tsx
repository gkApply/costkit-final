import { content } from '@/config/content'
import PageContainer from '@/components/layout/PageContainer'

export default function AboutPage() {
  const { badge, heading, body } = content.about
  const paragraphs = body.slice(0, 3)

  return (
    <PageContainer className="py-8 md:py-10 lg:py-12">
      <section className="max-w-4xl space-y-6 sm:space-y-8">
        <div className="text-[11px] uppercase tracking-[0.26em] text-brand-400">{badge}</div>
        <h1 className="font-display text-3xl leading-tight text-neutral-900 sm:text-4xl md:text-5xl">
          {heading}
        </h1>
        <div className="space-y-5 text-base leading-8 text-neutral-800 sm:text-lg">
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>
    </PageContainer>
  )
}
