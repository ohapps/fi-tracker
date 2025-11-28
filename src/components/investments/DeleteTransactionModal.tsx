'use client';

import React, { useTransition } from 'react';
import { useAtom } from 'jotai';
import { transactionActionAtom } from '@/atoms/transaction';
import { deleteTransactionAction } from '@/server/actions/transactions/delete-transaction';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { toast } from 'sonner';

export function DeleteTransactionModal() {
  const [isPending, startTransition] = useTransition();
  const [transactionAction, setTransactionAction] = useAtom(
    transactionActionAtom
  );
  const open = transactionAction?.action === 'delete';

  const handleCancel = () => {
    setTransactionAction(undefined);
  };

  const handleDelete = () => {
    if (!transactionAction?.transaction) {
      setTransactionAction(undefined);
      return;
    }
    startTransition(async () => {
      if (transactionAction.transaction?.id) {
        const result = await deleteTransactionAction(
          transactionAction.transaction.id
        );
        if (result?.success) {
          toast.success('Transaction deleted');
        } else {
          toast.error(result?.error || 'Failed to delete transaction');
        }
      }
      setTransactionAction(undefined);
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Transaction</DialogTitle>
        </DialogHeader>
        <div className="mt-4 mb-6 text-base">
          Are you sure you want to delete this transaction? This action cannot
          be undone.
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
