import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { EditAccountMenu } from './EditAccountMenu';
import { Coins, LineChart, ArrowUpRight } from 'lucide-react';
import { Account } from '@/types/accounts';
import Link from 'next/link';

interface AccountCardProps {
  account: Account;
  investmentCount?: number;
  accountValue?: number;
}

export function AccountCard({
  account,
  investmentCount = 0,
  accountValue = 0,
}: AccountCardProps) {
  const firstLetter = account.description?.charAt(0)?.toUpperCase() || '?';

  return (
    <Card className="bg-gray-50">
      <CardHeader className="flex flex-row items-center gap-3">
        <Avatar>
          <AvatarFallback>{firstLetter}</AvatarFallback>
        </Avatar>
        <CardTitle>{account.description}</CardTitle>
        <EditAccountMenu account={account} />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-muted-foreground" />
            Investments:{' '}
            <span className="font-semibold text-muted-foreground">
              {investmentCount}
            </span>
            {investmentCount > 0 && (
              <Link
                href={`/investments?accountId=${account.id}`}
                className="ml-1 text-blue-600 hover:text-blue-800"
                title="View investments for this account"
                aria-label="View investments for this account"
              >
                <ArrowUpRight className="w-4 h-4 inline" />
              </Link>
            )}
          </div>
          <div className="flex items-center gap-2">
            <LineChart className="w-4 h-4 text-muted-foreground" />
            Account Value:{' '}
            <span className="font-semibold text-muted-foreground">
              $
              {accountValue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
