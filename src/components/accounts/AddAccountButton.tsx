'use client';

import { useAtom } from 'jotai';
import { Button } from '../ui/button';
import { accountActionAtom, AccountActionType } from '@/atoms/app';
import { useIsOffline } from '@/hooks/use-is-offline';

export default function AddAccountButton() {
  const isOffline = useIsOffline();
  const [, setAccountAction] = useAtom(accountActionAtom);

  const handleClick = () => {
    if (isOffline) return;
    setAccountAction({ action: AccountActionType.Add });
  };

  return (
    <Button type="button" className="mb-4" onClick={handleClick} disabled={isOffline}>
      {isOffline ? 'Offline' : 'Add Account'}
    </Button>
  );
}
