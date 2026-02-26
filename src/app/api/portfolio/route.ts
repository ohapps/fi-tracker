import { NextResponse } from 'next/server';
import { calculatePortfolioSummary } from '@/server/utils/portfolio/calculate-portfolio-summary';
import { auth0 } from '@/server/security/auth0';

export async function GET() {
  try {
    const session = await auth0.getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const summary = await calculatePortfolioSummary();

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Error fetching portfolio summary:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
