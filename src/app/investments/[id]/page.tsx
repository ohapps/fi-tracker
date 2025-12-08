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
import InvestmentTransactionsCard from '@/components/investments/InvestmentTransactionsCard';

interface Props {
  params: { id: string };
  searchParams: { page?: string; pageSize?: string; sortBy?: string; sortDirection?: 'asc' | 'desc' };
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

  const [accounts, transactions] = await Promise.all([
    getAccounts(),
    newInvestment
      ? Promise.resolve({ transactions: [], total: 0 })
      : getInvestmentTransactions(
        id,
        (page - 1) * pageSize,
        pageSize,
        sortBy,
        sortDirection
      ),
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
            <BreadcrumbPage>
              {newInvestment ? 'New Investment' : 'Edit Investment'}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <InvestmentForm accounts={accounts} investment={investment} />
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
  );
}
