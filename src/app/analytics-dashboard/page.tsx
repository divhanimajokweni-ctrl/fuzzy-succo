import AppLayout from '@/components/AppLayout';
import KPIGrid from '@/components/dashboard/KPIGrid';

export default function AnalyticsDashboard() {
  return (
    <AppLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Analytics Dashboard</h1>
          <p className="text-slate-600 mt-1">Monitor your Ubuntu Pools community performance</p>
        </div>
        <KPIGrid />
      </div>
    </AppLayout>
  );
}
