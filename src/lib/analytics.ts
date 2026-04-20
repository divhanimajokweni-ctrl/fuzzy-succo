import { supabase } from './supabase/client';

type EventType = 'page_view' | 'export' | 'filter' | 'action' | 'error';
type ExportType = 'csv' | 'pdf' | 'excel';

interface AnalyticsEvent {
  event_type: EventType;
  event_name: string;
  page_path?: string;
  metadata?: Record<string, any>;
}

function getSessionId(): string {
  if (typeof window === 'undefined') return 'server';
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
}

export async function trackEvent(event: AnalyticsEvent) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    await supabase.from('analytics_events').insert({
      event_type: event.event_type,
      event_name: event.event_name,
      user_id: user?.id || null,
      session_id: getSessionId(),
      page_path:
        event.page_path || (typeof window !== 'undefined' ? window.location.pathname : null),
      metadata: event.metadata || {},
    });
  } catch (error) {
    console.error('Failed to track event:', error);
  }
}

export async function trackPageView(pageName: string, metadata?: Record<string, any>) {
  return trackEvent({ event_type: 'page_view', event_name: pageName, metadata });
}

export async function trackExport(
  exportType: ExportType,
  recordCount?: number,
  filters?: Record<string, any>
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  await trackEvent({
    event_type: 'export',
    event_name: 'data_export',
    metadata: { export_type: exportType, record_count: recordCount, filters },
  });

  await supabase.from('export_logs').insert({
    user_id: user?.id,
    export_type: exportType,
    format: exportType,
    filters,
    record_count: recordCount,
    status: 'completed',
  });
}

export async function trackUserAction(action: string, metadata?: Record<string, any>) {
  return trackEvent({ event_type: 'action', event_name: action, metadata });
}

export async function getDashboardAnalytics(days: number = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const [pageViews, exports, actions] = await Promise.all([
    supabase
      .from('analytics_events')
      .select('event_name, created_at')
      .eq('event_type', 'page_view')
      .gte('created_at', startDate.toISOString()),
    supabase
      .from('export_logs')
      .select('export_type, record_count, created_at')
      .gte('created_at', startDate.toISOString()),
    supabase
      .from('analytics_events')
      .select('event_name, created_at')
      .eq('event_type', 'action')
      .gte('created_at', startDate.toISOString()),
  ]);

  return {
    pageViews: pageViews.data || [],
    exports: exports.data || [],
    actions: actions.data || [],
  };
}

export async function getActivityByUser(days: number = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const { data } = await supabase
    .from('analytics_events')
    .select('user_id, event_type, event_name, created_at')
    .gte('created_at', startDate.toISOString())
    .order('created_at', { ascending: false });
  return data || [];
}

export function useAnalytics() {
  return { trackPageView, trackExport, trackUserAction, getDashboardAnalytics, getActivityByUser };
}
