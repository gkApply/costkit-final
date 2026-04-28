import { CategoryToolsLanding } from '@/components/sections/CategoryToolsLanding'
import PageContainer from '@/components/layout/PageContainer'
import { content } from '@/config/content'

export default function IndustryPage() {
  return (
    <PageContainer className="py-8 md:py-10 lg:py-12">
      <CategoryToolsLanding category="industry" header={content.categoryPages.industry} />
    </PageContainer>
  )
}
