'use client';

import { FormProvider, useForm } from 'react-hook-form';
import { useTransition, useEffect } from 'react';
import { Button } from '../ui/button';
import { TextInput } from '../inputs/TextInput';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '../ui/dialog';
import { useAtom } from 'jotai';
import { transactionActionAtom } from '@/atoms/transaction';
import { DatePicker } from '../inputs/DatePicker';
import { SelectInput } from '../inputs/SelectInput';
import { Transaction, TransactionSchema, TransactionType } from '@/types/investments';
import { zodResolver } from '@hookform/resolvers/zod';
import { saveTransaction } from '@/server/actions/transactions/save-transaction';
import { useSWRConfig } from 'swr';
import { useRouter } from 'next/navigation';
import { useIsOffline } from '@/hooks/use-is-offline';

export default function EditTransactionModal({ investmentId }: { investmentId: string }) {
  const isOffline = useIsOffline();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [transactionAction, setTransactionAction] = useAtom(transactionActionAtom);
  const open = transactionAction?.action === 'edit' || transactionAction?.action === 'add';
  const title = transactionAction?.action === 'edit' ? 'Edit Transaction' : 'Add New Transaction';

  const methods = useForm<Transaction>({
    resolver: zodResolver(TransactionSchema),
    mode: 'onChange',
  });

  const { reset } = methods;

  const submitDisabled = isPending || !methods.formState.isValid || isOffline;

  const { mutate } = useSWRConfig();
  const onSubmit = (data: Transaction) => {
    if (isOffline) return;
    startTransition(async () => {
      const result = await saveTransaction(data);
      if (result.success) {
        toast.success('Transaction Saved');

        // Invalidate relevant caches
        mutate('/api/investments');
        mutate('/api/accounts');
        mutate('/api/portfolio');
        router.refresh();

        setTransactionAction(undefined);
      } else {
        toast.error('Failed to save transaction');
      }
    });
  };

  const onOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setTransactionAction(undefined);
    }
  };

  useEffect(() => {
    if (!open) return;

    if (transactionAction?.action === 'edit' && transactionAction.transaction) {
      reset(transactionAction.transaction);
    } else if (transactionAction?.action === 'add') {
      reset({
        id: '',
        investmentId,
        transactionDate: new Date(),
        type: TransactionType.VALUE_CHANGE,
        amount: 0,
        description: '',
      });
    }
  }, [open, transactionAction, investmentId, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-4">
            <DatePicker name="transactionDate" label="Transaction Date" />
            <SelectInput
              name="type"
              label="Transaction Type"
              options={Object.values(TransactionType)}
            />
            <TextInput name="amount" label="Amount" type="currency" />
            <TextInput name="description" label="Description" />
            <div className="flex gap-2 justify-end">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="bg-muted text-muted-foreground border border-muted"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={submitDisabled}>
                {isPending ? 'Saving...' : isOffline ? 'Offline' : 'Save'}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
