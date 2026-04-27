import LegalPageLayout from '@/components/layout/LegalPageLayout'
import termsContent from '../../docs/Legal/terms.md?raw'

export default function TermsPage() {
  return (
    <LegalPageLayout title="Terms of Service" lastUpdated="2024-01-01" markdown={termsContent} />
  )
}
