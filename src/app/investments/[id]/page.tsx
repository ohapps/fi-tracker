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
  searchParams: { page?: string; pageSize?: string };
}

export default async function InvestmentPage({ params, searchParams }: Props) {
  const { id } = params;
  const newInvestment = id === 'new';
  const investment = newInvestment ? undefined : await getInvestment(id);
  const page = Math.max(1, parseInt(searchParams.page || '1') || 1);
  const pageSize = Math.min(
    100,
    Math.max(1, parseInt(searchParams.pageSize || '25') || 25)
  );
  const [accounts, transactions] = await Promise.all([
    getAccounts(),
    newInvestment
      ? Promise.resolve({ transactions: [], total: 0 })
      : getInvestmentTransactions(id, (page - 1) * pageSize, pageSize),
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
        />
      )}
    </div>
  );
}
