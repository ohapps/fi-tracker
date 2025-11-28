import { auth0 } from '@/server/security/auth0';
import { redirect } from 'next/navigation';

export default async function AuthInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth0.getSession();
  const user = session?.user;

  if (!user) {
    redirect('/auth/login');
  }

  return <>{children}</>;
}
