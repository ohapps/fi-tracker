import Link from 'next/link';
import { Button } from '../ui/button';

export default function AddInvestmentButton() {
  return (
    <Button type="button" asChild>
      <Link href="/investments/new">New</Link>
    </Button>
  );
}
