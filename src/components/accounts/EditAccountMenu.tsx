'use client';

import * as React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';
import { useAtom } from 'jotai';
import { accountActionAtom, AccountActionType } from '@/atoms/app';
import { Account } from '@/types/accounts';

interface Props {
  account: Account;
}

export function EditAccountMenu({ account }: Props) {
  const [, setAccountAction] = useAtom(accountActionAtom);

  const onEdit = () => {
    setAccountAction({ account, action: AccountActionType.Edit });
  };

  const onDelete = () => {
    setAccountAction({ account, action: AccountActionType.Delete });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className="ml-auto p-2 rounded hover:bg-muted">
          <MoreVertical className="w-5 h-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
        <DropdownMenuItem onClick={onDelete} className="text-red-600">
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
