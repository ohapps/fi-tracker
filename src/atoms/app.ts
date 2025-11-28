import { Account } from "@/types/accounts";
import { atom } from "jotai";

export enum AccountActionType {
    Add = 'add',
    Edit = 'edit',
    Delete = 'delete',
}

export interface AccountAction {
    action: AccountActionType;
    account?: Account;
}

export const accountActionAtom = atom<AccountAction | undefined>(undefined);