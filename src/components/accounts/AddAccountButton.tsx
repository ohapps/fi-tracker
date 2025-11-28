'use client';

import { useAtom } from 'jotai';
import { Button } from '../ui/button';
import { accountActionAtom, AccountActionType } from '@/atoms/app';

export default function AddAccountButton() {
  const [, setAccountAction] = useAtom(accountActionAtom);

  const handleClick = () => {
    setAccountAction({ action: AccountActionType.Add });
  };

  return (
    <Button type="button" className="mb-4" onClick={handleClick}>
      Add Account
    </Button>
  );
}
