'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { useAtom } from 'jotai';
import { transactionActionAtom, TransactionActionType } from '@/atoms/transaction';
import { Transaction } from '@/types/investments';
import { useIsOffline } from '@/hooks/use-is-offline';

interface TransactionActionMenuProps {
  transaction: Transaction;
}

export function TransactionActionMenu({ transaction }: TransactionActionMenuProps) {
  const isOffline = useIsOffline();
  const [, setTransactionAction] = useAtom(transactionActionAtom);

  const onEdit = () => {
    if (isOffline) return;
    setTransactionAction({
      action: TransactionActionType.Edit,
      transaction,
    });
  };

  const onDelete = () => {
    if (isOffline) return;
    setTransactionAction({
      action: TransactionActionType.Delete,
      transaction,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0" disabled={isOffline}>
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onEdit} disabled={isOffline}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDelete} disabled={isOffline}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
