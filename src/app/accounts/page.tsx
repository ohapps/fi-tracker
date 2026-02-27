'use client';

import { AccountCard } from '@/components/accounts/AccountCard';
import AddAccountButton from '@/components/accounts/AddAccountButton';
import { DeleteAccountModal } from '@/components/accounts/DeleteAccountModal';
import EditAccountModal from '@/components/accounts/EditAccountModal';
import useSWR from 'swr';
import { fetcher } from '@/utils/fetcher';
import { Account, AccountMetrics } from '@/types/accounts';
import { Investment } from '@/types/investments';
import { Skeleton } from '@/components/ui/skeleton';

interface AccountsData {
  accounts: Account[];
  investments: Investment[];
  accountMetrics: AccountMetrics[];
}

export default function Accounts() {
  const { data, error, isLoading } = useSWR<AccountsData>('/api/accounts', fetcher);

  if (error && !data) {
    return (
      <div className="p-6">
        <div className="text-red-500">Failed to load accounts. Please try again later.</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-row items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Accounts</h1>
        <AddAccountButton />
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          // Skeleton loaders
          [1, 2, 3].map((i) => <Skeleton key={i} className="h-32 w-full rounded-xl" />)
        ) : !data?.accounts.length ? (
          <div className="text-muted-foreground text-center py-10">
            No accounts found. Add one to get started!
          </div>
        ) : (
          data.accounts.map((account, index) => {
            const accountInvestments = data.investments.filter(
              (inv) => inv.accountId === account.id
            );
            const investmentCount = accountInvestments.length;
            const accountValue = accountInvestments.reduce(
              (sum, inv) => sum + (inv.currentValue || 0),
              0
            );
            return (
              <AccountCard
                key={account.id}
                account={account}
                investmentCount={investmentCount}
                accountValue={accountValue}
                metrics={data.accountMetrics[index]}
              />
            );
          })
        )}
      </div>
      <EditAccountModal />
      <DeleteAccountModal />
    </div>
  );
}
