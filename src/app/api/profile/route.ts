import { NextResponse } from 'next/server';
import { getUserProfile } from '@/server/utils/user/get-user-profile';
import { auth0 } from '@/server/security/auth0';

export async function GET() {
  try {
    const session = await auth0.getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userProfile = await getUserProfile();

    return NextResponse.json({ userProfile });
  } catch (error) {
    console.error('Error fetching profile data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
