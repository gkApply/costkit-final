import { CategoryToolsLanding } from '@/components/sections/CategoryToolsLanding'
import PageContainer from '@/components/layout/PageContainer'
import { content } from '@/config/content'

export default function MacroPage() {
  return (
    <PageContainer className="py-8 md:py-10 lg:py-12">
      <CategoryToolsLanding category="macro" header={content.categoryPages.macro} />
    </PageContainer>
  )
}
