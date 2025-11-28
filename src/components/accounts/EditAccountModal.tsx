'use client';

import { FormProvider, useForm } from 'react-hook-form';
import { useTransition, useEffect } from 'react';
import { accountSchema, Account } from '@/types/accounts';
import { zodResolver } from '@hookform/resolvers/zod';
import { saveAccountAction } from '@/server/actions/accounts/save-account';
import { Button } from '../ui/button';
import { TextInput } from '../inputs/TextInput';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '../ui/dialog';
import { useAtom } from 'jotai';
import { accountActionAtom } from '@/atoms/app';

export default function EditAccountModal() {
  const [isPending, startTransition] = useTransition();
  const [accountAction, setAccountAction] = useAtom(accountActionAtom);
  const open =
    accountAction?.action === 'edit' || accountAction?.action === 'add';
  const title =
    accountAction?.action === 'edit' ? 'Edit Account' : 'Add New Account';

  const methods = useForm<Account>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      id: '',
      description: '',
    },
  });

  const onSubmit = (data: Account) => {
    startTransition(async () => {
      const result = await saveAccountAction(data);
      if (result.success) {
        toast.success('Account Saved');
        setAccountAction(undefined);
      } else {
        toast.error('Failed to add account');
      }
    });
  };

  const onOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setAccountAction(undefined);
    }
  };

  useEffect(() => {
    if (accountAction?.action === 'edit' && accountAction.account) {
      methods.reset(accountAction.account);
    } else {
      methods.reset({ id: '', description: '' });
    }
  }, [accountAction, methods]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 mt-4"
          >
            <TextInput name="description" placeholder="Account description" />
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
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Saving...' : 'Save Account'}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
