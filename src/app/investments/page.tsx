import { getInvestments } from '@/server/utils/investment/get-investments';
import { getAccounts } from '@/server/utils/account/get-accounts';
import type { Investment } from '@/types/investments';
import type { Account } from '@/types/accounts';
import AddInvestmentButton from '@/components/investments/AddInvestmentButton';
import InvestmentCard from '@/components/investments/InvestmentCard';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { X } from 'lucide-react';

interface InvestmentsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Investments({ searchParams }: InvestmentsPageProps) {
  const investments: Investment[] = await getInvestments();
  const accounts: Account[] = await getAccounts();

  // Get accountId from search params
  const resolvedSearchParams = await searchParams;
  const accountId =
    typeof resolvedSearchParams?.accountId === 'string'
      ? resolvedSearchParams.accountId
      : undefined;

  // Filter accounts and investments if accountId is present
  const filteredAccounts = accountId ? accounts.filter((acc) => acc.id === accountId) : accounts;
  const filteredInvestments = accountId
    ? investments.filter((inv) => inv.accountId === accountId)
    : investments;

  // Group investments by accountId
  const grouped: Record<string, Investment[]> = {};
  const noAccount: Investment[] = [];
  for (const inv of filteredInvestments) {
    if (inv.accountId) {
      if (!grouped[inv.accountId]) grouped[inv.accountId] = [];
      grouped[inv.accountId].push(inv);
    } else {
      noAccount.push(inv);
    }
  }

  return (
    <div className="p-6">
      {accountId && (
        <div>
          <Button asChild variant="link" className="px-0" title="Clear account filter">
            <Link href="/investments" className="inline-flex items-center gap-0">
              <X className="w-4 h-4" />
              Clear Account Filter
            </Link>
          </Button>
        </div>
      )}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Investments</h1>
        </div>
        <AddInvestmentButton />
      </div>
      {filteredAccounts.map((account) => {
        const accId = account.id ?? '';
        const investmentsForAccount = grouped[accId] ?? [];
        if (investmentsForAccount.length === 0) return null;
        return (
          <div key={accId} className="mb-8">
            <h2 className="text-lg font-semibold mb-2">{account.description}</h2>
            <Separator className="mb-4" />
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {investmentsForAccount.map((inv: Investment) => (
                <InvestmentCard key={inv.id} investment={inv} />
              ))}
            </div>
          </div>
        );
      })}
      {noAccount.length > 0 && !accountId && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">No Account</h2>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {noAccount.map((inv) => (
              <InvestmentCard key={inv.id} investment={inv} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
