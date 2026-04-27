import LegalPageLayout from '@/components/layout/LegalPageLayout'
import refundContent from '../../docs/Legal/refund.md?raw'

export default function RefundPolicyPage() {
  return <LegalPageLayout title="Refund Policy" lastUpdated="2024-01-01" markdown={refundContent} />
}
