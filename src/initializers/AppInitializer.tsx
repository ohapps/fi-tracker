import AuthInitializer from './AuthInitializer';
import JotaiInitializer from './JotaiInitializer';

export default function AppInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthInitializer>
      <JotaiInitializer>{children}</JotaiInitializer>
    </AuthInitializer>
  );
}
