import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { AuthLayout } from '@/components/layout/AuthLayout'
import PublicLayout from '@/components/layout/PublicLayout'
import { ScrollToTop } from '@/components/layout/ScrollToTop'
import AboutPage from '@/pages/AboutPage'
import AcceptableUsePage from '@/pages/AcceptableUsePage'
import AccountPage from '@/pages/AccountPage'
import BillingPage from '@/pages/BillingPage'
import ClassificationPage from '@/pages/ClassificationPage'
import FinancialToolsPage from '@/pages/FinancialToolsPage'
import ForgotPasswordPage from '@/pages/ForgotPasswordPage'
import IndustryPage from '@/pages/IndustryPage'
import LoginPage from '@/pages/LoginPage'
import MacroPage from '@/pages/MacroPage'
import NotFoundPage from '@/pages/NotFoundPage'
import OtherToolsPage from '@/pages/OtherToolsPage'
import PricingPage from '@/pages/PricingPage'
import PrivacyPage from '@/pages/PrivacyPage'
import RefundPolicyPage from '@/pages/RefundPolicyPage'
import ResetPasswordPage from '@/pages/ResetPasswordPage'
import SalaryPage from '@/pages/SalaryPage'
import SignupPage from '@/pages/SignupPage'
import TermsPage from '@/pages/TermsPage'
import CompanyDescriptionPage from '@/pages/tools/classification/CompanyDescriptionPage'
import GicsSectorsPage from '@/pages/tools/classification/GicsSectorsPage'
import NaicsCodesPage from '@/pages/tools/classification/NaicsCodesPage'
import SicCodesPage from '@/pages/tools/classification/SicCodesPage'
import SicNaicsConverterPage from '@/pages/tools/classification/SicNaicsConverterPage'
import BetaUnleverReleverPage from '@/pages/tools/financial/BetaUnleverReleverPage'
import CostOfEquityPage from '@/pages/tools/financial/CostOfEquityPage'
import CurrencyConverterPage from '@/pages/tools/financial/CurrencyConverterPage'
import DcfCalculatorPage from '@/pages/tools/financial/DcfCalculatorPage'
import LifeTablesPage from '@/pages/tools/financial/LifeTablesPage'
import TaxTablesPage from '@/pages/tools/financial/TaxTablesPage'
import TerminalValuePage from '@/pages/tools/financial/TerminalValuePage'
import WaccCalculatorPage from '@/pages/tools/financial/WaccCalculatorPage'
import CreditSpreadsPage from '@/pages/tools/industry/CreditSpreadsPage'
import HistoricalTrendsPage from '@/pages/tools/industry/HistoricalTrendsPage'
import IndustryMetricsPage from '@/pages/tools/industry/IndustryMetricsPage'
import IndustryRiskPremiumPage from '@/pages/tools/industry/IndustryRiskPremiumPage'
import RatioBenchmarksPage from '@/pages/tools/industry/RatioBenchmarksPage'
import CanadaRiskFreeRatePage from '@/pages/tools/macro/CanadaRiskFreeRatePage'
import CountryRatingsPage from '@/pages/tools/macro/CountryRatingsPage'
import CpiPage from '@/pages/tools/macro/CpiPage'
import FxVolatilityPage from '@/pages/tools/macro/FxVolatilityPage'
import GdpGrowthPage from '@/pages/tools/macro/GdpGrowthPage'
import UsRiskFreeRatePage from '@/pages/tools/macro/UsRiskFreeRatePage'
import MonteCarloSimulatorPage from '@/pages/tools/other/MonteCarloSimulatorPage'
import ReportBuilderPage from '@/pages/tools/other/ReportBuilderPage'
import SensitivityAnalysisPage from '@/pages/tools/other/SensitivityAnalysisPage'
import ExecutiveCompensationPage from '@/pages/tools/salary/ExecutiveCompensationPage'
import ReasonableCompensationPage from '@/pages/tools/salary/ReasonableCompensationPage'
import SalaryByIndustryPage from '@/pages/tools/salary/SalaryByIndustryPage'
import SalaryByRolePage from '@/pages/tools/salary/SalaryByRolePage'

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<FinancialToolsPage />} />
          <Route path="/financial-tools" element={<FinancialToolsPage />} />
          <Route path="/financial-tools/wacc-calculator" element={<WaccCalculatorPage />} />
          <Route path="/financial-tools/cost-of-equity" element={<CostOfEquityPage />} />
          <Route
            path="/financial-tools/beta-unlever-relever"
            element={<BetaUnleverReleverPage />}
          />
          <Route path="/financial-tools/currency-converter" element={<CurrencyConverterPage />} />
          <Route path="/financial-tools/life-tables" element={<LifeTablesPage />} />
          <Route path="/financial-tools/tax-tables" element={<TaxTablesPage />} />
          <Route path="/financial-tools/dcf-calculator" element={<DcfCalculatorPage />} />
          <Route path="/financial-tools/terminal-value" element={<TerminalValuePage />} />
          <Route path="/industry" element={<IndustryPage />} />
          <Route path="/industry/industry-metrics" element={<IndustryMetricsPage />} />
          <Route path="/industry/ratio-benchmarks" element={<RatioBenchmarksPage />} />
          <Route path="/industry/historical-trends" element={<HistoricalTrendsPage />} />
          <Route path="/industry/credit-spreads" element={<CreditSpreadsPage />} />
          <Route path="/industry/industry-risk-premium" element={<IndustryRiskPremiumPage />} />
          <Route path="/macro" element={<MacroPage />} />
          <Route path="/macro/us-risk-free-rate" element={<UsRiskFreeRatePage />} />
          <Route path="/macro/canada-risk-free-rate" element={<CanadaRiskFreeRatePage />} />
          <Route path="/macro/country-ratings" element={<CountryRatingsPage />} />
          <Route path="/macro/cpi" element={<CpiPage />} />
          <Route path="/macro/gdp-growth" element={<GdpGrowthPage />} />
          <Route path="/macro/fx-volatility" element={<FxVolatilityPage />} />
          <Route path="/classification" element={<ClassificationPage />} />
          <Route path="/classification/company-description" element={<CompanyDescriptionPage />} />
          <Route path="/classification/naics-codes" element={<NaicsCodesPage />} />
          <Route path="/classification/sic-codes" element={<SicCodesPage />} />
          <Route path="/classification/sic-naics-converter" element={<SicNaicsConverterPage />} />
          <Route path="/classification/gics-sectors" element={<GicsSectorsPage />} />
          <Route path="/salary" element={<SalaryPage />} />
          <Route path="/salary/salary-by-role" element={<SalaryByRolePage />} />
          <Route path="/salary/salary-by-industry" element={<SalaryByIndustryPage />} />
          <Route path="/salary/executive-compensation" element={<ExecutiveCompensationPage />} />
          <Route path="/salary/reasonable-compensation" element={<ReasonableCompensationPage />} />
          <Route path="/other-tools" element={<OtherToolsPage />} />
          <Route path="/other-tools/monte-carlo-simulator" element={<MonteCarloSimulatorPage />} />
          <Route path="/other-tools/sensitivity-analysis" element={<SensitivityAnalysisPage />} />
          <Route path="/other-tools/report-builder" element={<ReportBuilderPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/refund-policy" element={<RefundPolicyPage />} />
          <Route path="/acceptable-use" element={<AcceptableUsePage />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>

        <Route element={<AppLayout />}>
          <Route path="/account" element={<AccountPage />} />
          <Route path="/billing" element={<BillingPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
