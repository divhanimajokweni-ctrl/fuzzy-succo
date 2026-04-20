'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  Layers,
  Target,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  BarChart2,
  UserCheck,
  HelpCircle,
} from 'lucide-react';
import AppLogo from '@/components/ui/AppLogo';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const navGroups = [
  {
    label: 'Overview',
    items: [
      { href: '/analytics-dashboard', icon: LayoutDashboard, label: 'Analytics', badge: null },
      { href: '/engagement', icon: TrendingUp, label: 'Engagement', badge: null },
      { href: '/cohorts', icon: Users, label: 'Cohorts', badge: '3' },
    ],
  },
  {
    label: 'Product',
    items: [
      { href: '/modules', icon: Layers, label: 'Modules', badge: null },
      { href: '/funnels', icon: Target, label: 'Funnels', badge: null },
      { href: '/features', icon: Zap, label: 'Feature Adoption', badge: 'New' },
    ],
  },
  {
    label: 'Customers',
    items: [
      { href: '/customers', icon: UserCheck, label: 'Customers', badge: null },
      { href: '/reports', icon: BarChart2, label: 'Reports', badge: null },
    ],
  },
];

const bottomItems = [
  { href: '/notifications', icon: Bell, label: 'Notifications', badge: '5' },
  { href: '/settings', icon: Settings, label: 'Settings', badge: null },
  { href: '/help', icon: HelpCircle, label: 'Help', badge: null },
];

export default function Sidebar({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const sidebarClasses = [
    'fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-slate-200 transition-all duration-300',
    collapsed ? 'w-16' : 'w-60',
    'lg:relative lg:translate-x-0',
    mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
  ].join(' ');

  return (
    <aside className={sidebarClasses}>
      <div
        className={`flex items-center h-14 shrink-0 border-b border-slate-200 ${collapsed ? 'justify-center px-0' : 'px-4 gap-2'}`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <AppLogo size={28} />
          {!collapsed && (
            <span className="font-semibold text-slate-800 text-[15px] tracking-tight truncate">
              Ubuntu Pools
            </span>
          )}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-5">
        {navGroups.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <p className="px-2 mb-1 text-[10px] font-600 uppercase tracking-widest text-slate-400 font-medium">
                {group.label}
              </p>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onMobileClose}
                      className={[
                        'group flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium transition-all duration-150',
                        active
                          ? 'bg-violet-50 text-violet-700'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800',
                      ].join(' ')}
                      title={collapsed ? item.label : undefined}
                    >
                      <item.icon
                        className={[
                          'shrink-0 transition-colors',
                          active ? 'text-violet-600' : 'text-slate-400 group-hover:text-slate-600',
                        ].join(' ')}
                        size={18}
                        strokeWidth={active ? 2.2 : 1.8}
                      />
                      {!collapsed && (
                        <>
                          <span className="flex-1 truncate">{item.label}</span>
                          {item.badge && (
                            <span
                              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${item.badge === 'New' ? 'bg-emerald-100 text-emerald-700' : 'bg-violet-100 text-violet-700'}`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-slate-200 py-2 px-2 space-y-0.5">
        {bottomItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onMobileClose}
              className={[
                'group flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium transition-all duration-150',
                active
                  ? 'bg-violet-50 text-violet-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800',
              ].join(' ')}
              title={collapsed ? item.label : undefined}
            >
              <item.icon
                className={active ? 'text-violet-600' : 'text-slate-400 group-hover:text-slate-600'}
                size={18}
                strokeWidth={1.8}
              />
              {!collapsed && (
                <>
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-700">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
        <div
          className={`flex items-center mt-2 pt-2 border-t border-slate-100 ${collapsed ? 'justify-center' : 'gap-3 px-2'}`}
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shrink-0">
            <span className="text-[10px] font-bold text-white">MK</span>
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-700 truncate">Maya Krishnan</p>
              <p className="text-[10px] text-slate-400 truncate">Community Manager</p>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={onToggleCollapse}
        className="hidden lg:flex absolute -right-3 top-[68px] w-6 h-6 rounded-full bg-white border border-slate-200 shadow-sm items-center justify-center text-slate-400 hover:text-slate-700 hover:border-slate-300 transition-all duration-150 z-10"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}
