import LegalPageLayout from '@/components/layout/LegalPageLayout'
import acceptableUseContent from '../../docs/Legal/acceptable_use_policy.md?raw'

export default function AcceptableUsePage() {
  return (
    <LegalPageLayout
      title="Acceptable Use Policy"
      lastUpdated="2024-01-01"
      markdown={acceptableUseContent}
    />
  )
}
