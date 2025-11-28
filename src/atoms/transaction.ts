import { Transaction } from '@/types/investments';
import { atom } from 'jotai';

export enum TransactionActionType {
    Add = 'add',
    Edit = 'edit',
    Delete = 'delete',
}

export interface TransactionAction {
    action: TransactionActionType;
    transaction?: Transaction;
}

export const transactionActionAtom = atom<TransactionAction | undefined>(undefined);
