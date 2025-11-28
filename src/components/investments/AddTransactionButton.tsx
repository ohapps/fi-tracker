'use client';

import {
  transactionActionAtom,
  TransactionActionType,
} from '@/atoms/transaction';
import { useAtom } from 'jotai';
import { Button } from '../ui/button';

export default function AddTransactionButton() {
  const [, setTransactionAction] = useAtom(transactionActionAtom);

  const handleClick = () => {
    setTransactionAction({ action: TransactionActionType.Add });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="ml-auto"
      onClick={handleClick}
    >
      New Transaction
    </Button>
  );
}
