'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from './client';

type RealtimeTable = 'kpi_metrics' | 'villages' | 'governance_metrics' | 'live_activity';

interface UseRealtimeOptions {
  table: RealtimeTable;
  filter?: string;
  enabled?: boolean;
}

export function useRealtimeData<T>({ table, filter, enabled = true }: UseRealtimeOptions) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;
    try {
      setLoading(true);
      setError(null);
      let query = supabase.from(table).select('*').order('created_at', { ascending: false });
      if (filter) query = query.filter('village_id', 'eq', filter);
      const { data: result, error: err } = await query.limit(100);
      if (err) throw err;
      setData(result || []);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, [table, filter, enabled]);

  const channelName = useMemo(() => `${table}-changes`, [table]);

  useEffect(() => {
    if (!enabled) return;

    fetchData();

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table,
          filter: filter ? `village_id=eq.${filter}` : undefined,
        },
        (payload) => {
          setData((prev) => {
            switch (payload.eventType) {
              case 'INSERT':
                return [payload.new as T, ...prev];
              case 'UPDATE':
                return prev.map(
                  (item: any) => (item.id === payload.new.id ? payload.new : item) as T
                );
              case 'DELETE':
                return prev.filter((item: any) => item.id !== payload.old.id);
              default:
                return prev;
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, filter, enabled, fetchData, channelName]);

  return { data, loading, error, refetch: fetchData };
}

export function useKPIRealtime(villageId?: string) {
  return useRealtimeData<any>({ table: 'kpi_metrics', filter: villageId });
}

export function useVillagesRealtime() {
  return useRealtimeData<any>({ table: 'villages' });
}

export function useGovernanceRealtime(villageId?: string) {
  return useRealtimeData<any>({ table: 'governance_metrics', filter: villageId });
}

export function useDashboardRealtime(villageId?: string) {
  const kpis = useKPIRealtime(villageId);
  const villages = useVillagesRealtime();
  const governance = useGovernanceRealtime(villageId);

  return {
    kpis: kpis.data,
    villages: villages.data,
    governance: governance.data,
    loading: kpis.loading || villages.loading || governance.loading,
    error: kpis.error || villages.error || governance.error,
  };
}
