import LegalPageLayout from '@/components/layout/LegalPageLayout'
import privacyContent from '../../docs/Legal/privacy.md?raw'

export default function PrivacyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated="2024-01-01" markdown={privacyContent} />
  )
}
