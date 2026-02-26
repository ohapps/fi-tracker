import { NextResponse } from 'next/server';
import { getAccounts } from '@/server/utils/account/get-accounts';
import { getInvestments } from '@/server/utils/investment/get-investments';
import { auth0 } from '@/server/security/auth0';

export async function GET() {
  try {
    const session = await auth0.getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [accounts, investments] = await Promise.all([getAccounts(), getInvestments()]);

    return NextResponse.json({
      accounts,
      investments,
    });
  } catch (error) {
    console.error('Error fetching investments data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
