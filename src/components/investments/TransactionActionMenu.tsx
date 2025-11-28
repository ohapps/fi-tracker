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
import {
  transactionActionAtom,
  TransactionActionType,
} from '@/atoms/transaction';
import { Transaction } from '@/types/investments';

interface TransactionActionMenuProps {
  transaction: Transaction;
}

export function TransactionActionMenu({
  transaction,
}: TransactionActionMenuProps) {
  const [, setTransactionAction] = useAtom(transactionActionAtom);

  const onEdit = () => {
    setTransactionAction({
      action: TransactionActionType.Edit,
      transaction,
    });
  };

  const onDelete = () => {
    setTransactionAction({
      action: TransactionActionType.Delete,
      transaction,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
        <DropdownMenuItem onClick={onDelete}>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
