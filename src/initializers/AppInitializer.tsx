import AuthInitializer from './AuthInitializer';
import JotaiInitializer from './JotaiInitializer';
import ClientAuthGuard from './ClientAuthGuard';

export default function AppInitializer({ children }: { children: React.ReactNode }) {
  return (
    <AuthInitializer>
      <JotaiInitializer>
        <ClientAuthGuard>{children}</ClientAuthGuard>
      </JotaiInitializer>
    </AuthInitializer>
  );
}
