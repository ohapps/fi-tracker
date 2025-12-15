import { AccountCard } from '@/components/accounts/AccountCard';
import AddAccountButton from '@/components/accounts/AddAccountButton';
import { DeleteAccountModal } from '@/components/accounts/DeleteAccountModal';
import EditAccountModal from '@/components/accounts/EditAccountModal';
import { getAccounts } from '@/server/utils/account/get-accounts';
import { getInvestments } from '@/server/utils/investment/get-investments';

import { getAccountMetrics } from '@/server/utils/account/get-account-metrics';

export default async function Accounts() {
  const accounts = await getAccounts();
  const investments = await getInvestments();
  const accountMetrics = await Promise.all(
    accounts.map((account) => getAccountMetrics(account.id!))
  );

  return (
    <div className="p-6">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-2xl font-bold mb-4">Accounts</h1>
        <AddAccountButton />
      </div>
      <div className="grid gap-4">
        {accounts.map((account, index) => {
          const accountInvestments = investments.filter(
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
              metrics={accountMetrics[index]}
            />
          );
        })}
      </div>
      <EditAccountModal />
      <DeleteAccountModal />
    </div>
  );
}
