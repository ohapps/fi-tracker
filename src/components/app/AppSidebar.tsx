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
import { User, Wallet, TrendingUp, Briefcase } from 'lucide-react';
import { usePathname } from 'next/navigation';
import UserInfo from '../user/UserInfo';

export function AppSidebar() {
  const pathname = usePathname();
  const firstSegment = pathname.replace(/^\/|\/$/g, '').split('/')[0] || '';
  return (
    <Sidebar>
      <SidebarContent>
        <div className="px-4 h-14 border-b border-sidebar-border flex items-center gap-2">
          <h2 className="font-medium">fi-tracker</h2>
        </div>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={firstSegment === 'portfolio'}
              >
                <Link href="/portfolio">
                  <Briefcase /> Portfolio
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
              <SidebarMenuButton
                asChild
                isActive={firstSegment === 'investments'}
              >
                <Link href="/investments">
                  <TrendingUp /> Investments
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
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <UserInfo />
      </SidebarFooter>
    </Sidebar>
  );
}
