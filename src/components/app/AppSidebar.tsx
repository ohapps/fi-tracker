'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { User, Wallet, DollarSign, ChartCandlestick, Sparkles } from 'lucide-react';
import { usePathname } from 'next/navigation';
import UserInfo from '../user/UserInfo';
import { Logo } from '../ui/Logo';

import { useIsOffline } from '@/hooks/use-is-offline';

export function AppSidebar() {
  const isOffline = useIsOffline();
  const pathname = usePathname();
  const firstSegment = pathname.replace(/^\/|\/$/g, '').split('/')[0] || '';
  return (
    <Sidebar>
      <SidebarContent>
        <div className="px-4 h-14 border-b border-sidebar-border flex items-center gap-2">
          <Logo />
        </div>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={firstSegment === 'portfolio'}>
                <Link href="/portfolio">
                  <ChartCandlestick /> Portfolio
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={firstSegment === 'accounts'}>
                <Link href="/accounts">
                  <Wallet /> Accounts
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={firstSegment === 'investments'}>
                <Link href="/investments">
                  <DollarSign /> Investments
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={firstSegment === 'profile'}>
                <Link href="/profile">
                  <User /> Profile
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={firstSegment === 'analyze'}
                disabled={isOffline}
                className={isOffline ? 'opacity-50 grayscale' : ''}
              >
                <Link href="/analyze" onClick={(e) => isOffline && e.preventDefault()}>
                  <Sparkles /> Analyze {isOffline && '(Offline)'}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <UserInfo />
      </SidebarFooter>
    </Sidebar>
  );
}
