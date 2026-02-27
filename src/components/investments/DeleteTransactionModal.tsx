'use client';

import React, { useTransition } from 'react';
import { useAtom } from 'jotai';
import { transactionActionAtom } from '@/atoms/transaction';
import { deleteTransactionAction } from '@/server/actions/transactions/delete-transaction';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '../ui/dialog';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { useSWRConfig } from 'swr';
import { useRouter } from 'next/navigation';
import { useIsOffline } from '@/hooks/use-is-offline';

export function DeleteTransactionModal() {
  const isOffline = useIsOffline();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [transactionAction, setTransactionAction] = useAtom(transactionActionAtom);
  const open = transactionAction?.action === 'delete';

  const handleCancel = () => {
    setTransactionAction(undefined);
  };

  const { mutate } = useSWRConfig();
  const handleDelete = () => {
    if (!transactionAction?.transaction || isOffline) {
      setTransactionAction(undefined);
      return;
    }
    startTransition(async () => {
      if (transactionAction.transaction?.id) {
        const result = await deleteTransactionAction(transactionAction.transaction.id);
        if (result?.success) {
          toast.success('Transaction deleted');

          // Invalidate relevant caches
          mutate('/api/investments');
          mutate('/api/accounts');
          mutate('/api/portfolio');
          router.refresh();
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
        <div className="mt-4 mb-6 text-base text-gray-700">
          Are you sure you want to delete this transaction? This action cannot be undone.
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
            className="bg-destructive text-white px-3 py-1 rounded disabled:opacity-50"
            onClick={handleDelete}
            disabled={isPending || isOffline}
            type="button"
          >
            {isPending ? 'Deleting...' : isOffline ? 'Offline' : 'Delete'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
