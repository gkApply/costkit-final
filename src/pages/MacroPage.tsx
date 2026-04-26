import { CategoryToolsLanding } from '@/components/sections/CategoryToolsLanding'
import { content } from '@/config/content'

export default function MacroPage() {
  return (
    <div className="mx-auto max-w-[1380px] px-4 py-8 sm:px-6 md:py-10 lg:px-10 lg:py-12">
      <CategoryToolsLanding category="macro" header={content.categoryPages.macro} />
    </div>
  )
}
