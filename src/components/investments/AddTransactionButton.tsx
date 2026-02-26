'use client';

import { transactionActionAtom, TransactionActionType } from '@/atoms/transaction';
import { useAtom } from 'jotai';
import { Button } from '../ui/button';
import { useIsOffline } from '@/hooks/use-is-offline';

export default function AddTransactionButton() {
  const isOffline = useIsOffline();
  const [, setTransactionAction] = useAtom(transactionActionAtom);

  const handleClick = () => {
    if (isOffline) return;
    setTransactionAction({ action: TransactionActionType.Add });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="ml-auto"
      onClick={handleClick}
      disabled={isOffline}
    >
      {isOffline ? 'Offline' : 'New Transaction'}
    </Button>
  );
}
