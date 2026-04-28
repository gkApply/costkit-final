import { CategoryToolsLanding } from '@/components/sections/CategoryToolsLanding'
import PageContainer from '@/components/layout/PageContainer'
import { content } from '@/config/content'

export default function SalaryPage() {
  return (
    <PageContainer className="py-8 md:py-10 lg:py-12">
      <CategoryToolsLanding category="salary" header={content.categoryPages.salary} />
    </PageContainer>
  )
}
