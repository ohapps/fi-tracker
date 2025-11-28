'use client';

import React, { useTransition } from 'react';
import { useAtom } from 'jotai';
import { accountActionAtom } from '@/atoms/app';
import { deleteAccountAction } from '@/server/actions/accounts/delete-account';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { toast } from 'sonner';

export function DeleteAccountModal() {
  const [accountAction, setAccountAction] = useAtom(accountActionAtom);
  const open = accountAction?.action === 'delete';

  const handleCancel = () => {
    setAccountAction(undefined);
  };

  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!accountAction?.account) {
      setAccountAction(undefined);
      return;
    }
    startTransition(async () => {
      if (accountAction.account) {
        const result = await deleteAccountAction(accountAction.account);
        if (result?.success) {
          toast.success('Account deleted');
        } else {
          toast.error(result?.error || 'Failed to delete account');
        }
      }
      setAccountAction(undefined);
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Account</DialogTitle>
        </DialogHeader>
        <div className="mt-4 mb-6 text-base">
          Are you sure you want to delete this account? This action cannot be
          undone.
        </div>
        <div className="flex gap-2 justify-end">
          <DialogClose asChild>
            <Button
              className="bg-muted text-muted-foreground px-3 py-1 rounded border border-muted"
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            className="bg-destructive text-white px-3 py-1 rounded"
            onClick={handleDelete}
            disabled={isPending}
            type="button"
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
