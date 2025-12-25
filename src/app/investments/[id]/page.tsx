import InvestmentForm from '@/components/investments/InvestmentForm';
import { getAccounts } from '@/server/utils/account/get-accounts';
import { getInvestment } from '@/server/utils/investment/get-investment';
import { getInvestmentTransactions } from '@/server/utils/transaction/get-investment-transactions';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { getMonthlyPerformanceData } from '@/server/utils/transaction/get-monthly-performance-data';
import { getInvestmentMetrics } from '@/server/utils/investment/get-investment-metrics';
import InvestmentMetricsCard from '@/components/investments/InvestmentMetricsCard';
import InvestmentPerformanceCard from '@/components/investments/InvestmentPerformanceCard';
import InvestmentTransactionsCard from '@/components/investments/InvestmentTransactionsCard';

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
  }>;
}

export default async function InvestmentPage({ params, searchParams }: Props) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const newInvestment = id === 'new';
  const investment = newInvestment ? undefined : await getInvestment(id);
  const page = Math.max(1, parseInt(resolvedSearchParams.page || '1') || 1);
  const pageSize = Math.min(
    100,
    Math.max(1, parseInt(resolvedSearchParams.pageSize || '25') || 25)
  );
  const sortBy = resolvedSearchParams.sortBy || 'transactionDate';
  const sortDirection = resolvedSearchParams.sortDirection || 'desc';

  const [accounts, transactions, performanceData, metrics] = await Promise.all([
    getAccounts(),
    newInvestment
      ? Promise.resolve({ transactions: [], total: 0 })
      : getInvestmentTransactions(id, (page - 1) * pageSize, pageSize, sortBy, sortDirection),
    newInvestment ? Promise.resolve([]) : getMonthlyPerformanceData(id),
    newInvestment ? Promise.resolve(null) : getInvestmentMetrics(id),
  ]);

  return (
    <div>
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/investments">Investments</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{newInvestment ? 'New Investment' : 'Edit Investment'}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="space-y-8">
        <InvestmentForm accounts={accounts} investment={investment} />
        {!newInvestment && metrics && <InvestmentMetricsCard metrics={metrics} />}
        {!newInvestment && performanceData.length > 0 && (
          <InvestmentPerformanceCard data={performanceData} />
        )}
        {!newInvestment && (
          <InvestmentTransactionsCard
            id={id}
            transactions={transactions}
            page={page}
            pageSize={pageSize}
            sortBy={sortBy}
            sortDirection={sortDirection}
          />
        )}
      </div>
    </div>
  );
}
