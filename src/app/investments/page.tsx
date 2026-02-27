'use client';

import type { Investment } from '@/types/investments';
import type { Account } from '@/types/accounts';
import AddInvestmentButton from '@/components/investments/AddInvestmentButton';
import InvestmentCard from '@/components/investments/InvestmentCard';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { X } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import { fetcher } from '@/utils/fetcher';

interface InvestmentsData {
  accounts: Account[];
  investments: Investment[];
}

export default function Investments() {
  const searchParams = useSearchParams();
  const accountId = searchParams.get('accountId') ?? undefined;

  const { data, error, isLoading } = useSWR<InvestmentsData>('/api/investments', fetcher);

  if (error && !data) {
    return (
      <div className="p-6">
        <div className="text-red-500">Failed to load investments. Please try again later.</div>
      </div>
    );
  }

  // Filter accounts and investments if accountId is present
  const accounts = data?.accounts ?? [];
  const investments = data?.investments ?? [];

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

      {isLoading ? (
        <div className="space-y-8">
          {[1, 2].map((i) => (
            <div key={i}>
              <Skeleton className="h-6 w-48 mb-4" />
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((j) => (
                  <Skeleton key={j} className="h-48 w-full rounded-xl" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}
