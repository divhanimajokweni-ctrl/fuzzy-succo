'use client';

import React, { useEffect, useState } from 'react';
import { useDashboardRealtime } from '@/lib/supabase/realtime-hooks';
import { useAnalytics } from '@/lib/analytics';
import { TrendingUp, TrendingDown, Users, DollarSign, Activity } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  color: string;
}

const KPICard = React.memo<KPICardProps>(({ title, value, change, icon, trend, color }) => {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 hover:border-violet-200 transition-all">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
        </div>
        <div className={`p-2 rounded-lg ${color}`}>{icon}</div>
      </div>
      {change !== undefined && (
        <div className="mt-3 flex items-center gap-1">
          {trend === 'up' ? (
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          ) : trend === 'down' ? (
            <TrendingDown className="w-4 h-4 text-red-500" />
          ) : null}
          <span
            className={`text-sm font-medium ${change > 0 ? 'text-emerald-600' : change < 0 ? 'text-red-600' : 'text-slate-500'}`}
          >
            {change > 0 ? '+' : ''}
            {change}%
          </span>
          <span className="text-sm text-slate-400">vs last period</span>
        </div>
      )}
    </div>
  );
});

KPICard.displayName = 'KPICard';

const KPIGrid = React.memo<{ villageId?: string }>(({ villageId }) => {
  const { kpis, loading } = useDashboardRealtime(villageId);
  const { trackPageView } = useAnalytics();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    trackPageView('dashboard_kpi_view');
  }, [trackPageView]);

  const defaultKPIs = [
    {
      name: 'total_villages',
      value: '156',
      change: 12,
      category: 'villages',
      icon: Users,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      name: 'total_members',
      value: '24,589',
      change: 8,
      category: 'members',
      icon: Users,
      color: 'bg-green-100 text-green-600',
    },
    {
      name: 'active_pools',
      value: '1,247',
      change: 15,
      category: 'pools',
      icon: Activity,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      name: 'revenue',
      value: '$89,450',
      change: 23,
      category: 'revenue',
      icon: DollarSign,
      color: 'bg-orange-100 text-orange-600',
    },
  ];

  if (loading && !mounted)
    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">Loading...</div>;

  const displayKPIs =
    kpis.length > 0
      ? kpis.map((kpi) => ({
          ...kpi,
          icon:
            kpi.category === 'villages'
              ? Users
              : kpi.category === 'members'
                ? Users
                : kpi.category === 'pools'
                  ? Activity
                  : DollarSign,
          color:
            kpi.category === 'villages'
              ? 'bg-blue-100 text-blue-600'
              : kpi.category === 'members'
                ? 'bg-green-100 text-green-600'
                : kpi.category === 'pools'
                  ? 'bg-purple-100 text-purple-600'
                  : 'bg-orange-100 text-orange-600',
        }))
      : defaultKPIs;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {displayKPIs.map((kpi) => (
        <KPICard
          key={kpi.name}
          title={kpi.name.replace('_', ' ').toUpperCase()}
          value={kpi.value}
          change={kpi.change}
          icon={<kpi.icon size={20} />}
          trend={kpi.change > 0 ? 'up' : kpi.change < 0 ? 'down' : 'neutral'}
          color={kpi.color}
        />
      ))}
    </div>
  );
});

KPIGrid.displayName = 'KPIGrid';

export default KPIGrid;
