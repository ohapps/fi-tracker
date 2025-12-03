'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TextInput } from '@/components/inputs/TextInput';
import { SelectInput } from '@/components/inputs/SelectInput';
import { useEffect } from 'react';

const QuickUpdateSchema = z.object({
    type: z.string(),
    amount: z.number({ message: 'Please enter a valid amount' }).min(0.01, 'Amount must be greater than 0'),
});

type QuickUpdateForm = z.infer<typeof QuickUpdateSchema>;

interface QuickUpdateModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (type: string, amount: number) => void;
}

export function QuickUpdateModal({
    open,
    onOpenChange,
    onSave,
}: QuickUpdateModalProps) {
    const methods = useForm<QuickUpdateForm>({
        resolver: zodResolver(QuickUpdateSchema),
        defaultValues: {
            type: 'purchase',
            amount: undefined,
        },
    });

    const { handleSubmit, reset, formState: { isValid } } = methods;

    useEffect(() => {
        if (open) {
            reset({
                type: 'purchase',
                amount: undefined,
            });
        }
    }, [open, reset]);

    const onSubmit = (data: QuickUpdateForm) => {
        onSave(data.type, data.amount);
        onOpenChange(false);
        reset();
    };

    const handleCancel = () => {
        onOpenChange(false);
        reset();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Quick Update</DialogTitle>
                </DialogHeader>
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid gap-4 py-4">
                            <SelectInput
                                name="type"
                                label="Type"
                                options={[
                                    { value: 'purchase', label: 'Purchase or Deposit' },
                                    { value: 'sale', label: 'Sale or Withdraw' },
                                ]}
                            />
                            <TextInput
                                name="amount"
                                label="Amount"
                                type="currency"
                                placeholder="0.00"
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={!isValid}>
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    );
}
