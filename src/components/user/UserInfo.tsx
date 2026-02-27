import { useUser } from '@auth0/nextjs-auth0';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { useAtomValue } from 'jotai';
import { authAtom } from '@/atoms/auth';

export default function UserInfo() {
  const { user: auth0User, isLoading } = useUser();
  const cachedAuth = useAtomValue(authAtom);

  // Use the cached user if we're offline or the server-side user is still loading
  const user = auth0User || (cachedAuth.isAuthenticated ? cachedAuth.user : null);

  if (isLoading && !user) {
    return (
      <div className="p-2">
        <div className="w-10 h-10 rounded-full animate-pulse bg-muted"></div>
      </div>
    );
  }

  if (user) {
    const initials = user.name
      ?.split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase();

    return (
      <DropdownMenu>
        <DropdownMenuTrigger className="p-2 cursor-pointer">
          <Avatar className="bg-gray-500">
            <AvatarImage src={user.picture ?? undefined} alt={user.name ?? ''} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/auth/logout">Logout</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
}
