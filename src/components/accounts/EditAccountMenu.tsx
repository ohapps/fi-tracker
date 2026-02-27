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
import { useIsOffline } from '@/hooks/use-is-offline';

interface Props {
  account: Account;
}

export function EditAccountMenu({ account }: Props) {
  const isOffline = useIsOffline();
  const [, setAccountAction] = useAtom(accountActionAtom);

  const onEdit = () => {
    if (isOffline) return;
    setAccountAction({ account, action: AccountActionType.Edit });
  };

  const onDelete = () => {
    if (isOffline) return;
    setAccountAction({ account, action: AccountActionType.Delete });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="ml-auto p-2 rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isOffline}
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onEdit} disabled={isOffline}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDelete} className="text-red-600" disabled={isOffline}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
