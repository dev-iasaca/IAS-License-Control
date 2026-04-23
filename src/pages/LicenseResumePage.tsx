import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Briefcase, FileBarChart, MapPin } from 'lucide-react';
import AppLayout from '../components/AppLayout';
import PageHeader from '../components/PageHeader';
import { Card } from '../components/shared';
import BarList, { type BarItem } from '../components/BarList';
import {
  fetchExpiringLicenses,
  monthsBadgeColor,
  monthsLabel,
  type ExpiringLicense,
} from '../lib/license-expiring-data';
import {
  computeSummary,
  countByLocation,
  countByPosition,
} from '../lib/license-resume-data';
import type { Route } from '../App';

type Props = { currentRoute: Route; onNavigate: (r: Route) => void };

export default function LicenseResumePage({ currentRoute, onNavigate }: Props) {
  const [rows, setRows] = useState<ExpiringLicense[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError(null);
    fetchExpiringLicenses()
      .then((data) => { if (active) setRows(data); })
      .catch((err) => { if (active) setLoadError(err instanceof Error ? err.message : String(err)); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const summary = useMemo(() => computeSummary(rows), [rows]);

  const positionItems: BarItem[] = useMemo(
    () => countByPosition(rows).map((i) => ({ label: i.key, value: i.count, color: 'teal' })),
    [rows],
  );
  const locationItems: BarItem[] = useMemo(
    () => countByLocation(rows).map((i) => ({ label: i.key, value: i.count, color: 'sky' })),
    [rows],
  );
  const expiringItems: BarItem[] = useMemo(
    () =>
      [...rows]
        .filter((l) => l.monthsRemaining > 0)
        .sort((a, b) => a.monthsRemaining - b.monthsRemaining)
        .slice(0, 10)
        .map((l) => ({
          label: `${l.name} — ${l.licenseName}`,
          value: l.monthsRemaining,
          color: monthsBadgeColor(l.monthsRemaining),
          suffix: ` ${monthsLabel(l.monthsRemaining).replace(/^\d+\s/, '')}`.replace(
            ' Sudah Habis',
            ' Habis',
          ),
        })),
    [rows],
  );

  return (
    <AppLayout currentRoute={currentRoute} onNavigate={onNavigate}>
      <PageHeader
        title="License Resume"
        breadcrumb={['Home', 'Dashboard', 'License Resume']}
      />

      <div className="max-w-screen-2xl mx-auto px-6 py-5 space-y-5">
        {loadError && (
          <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-600">
            Gagal memuat data dashboard: {loadError}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={FileBarChart} label="Total Lisensi" value={summary.totalLicense} color="sky" loading={loading} />
          <StatCard icon={Briefcase} label="Total Jabatan" value={summary.totalPosition} color="teal" loading={loading} />
          <StatCard icon={MapPin} label="Total Lokasi" value={summary.totalLocation} color="blue" loading={loading} />
          <StatCard icon={AlertTriangle} label="Akan Habis (≤ 3 bulan)" value={summary.expiringSoon} color="rose" loading={loading} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-800">Total Lisensi per Jabatan</h3>
              <span className="text-[11px] text-gray-400">Top {positionItems.length}</span>
            </div>
            <BarList items={positionItems} defaultColor="teal" labelWidth="w-56" />
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-800">Total Lisensi per Lokasi</h3>
              <span className="text-[11px] text-gray-400">Top {locationItems.length}</span>
            </div>
            <BarList items={locationItems} defaultColor="sky" labelWidth="w-56" />
          </Card>
        </div>

        <Card>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <h3 className="text-sm font-semibold text-gray-800">Lisensi yang Akan Habis</h3>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Panjang bar menunjukkan bulan tersisa. Semakin pendek & merah, semakin mendesak.
              </p>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-gray-500">
              <Legend color="bg-rose-500" label="≤ 1 bulan" />
              <Legend color="bg-amber-500" label="≤ 3 bulan" />
              <Legend color="bg-sky-500" label="≤ 6 bulan" />
              <Legend color="bg-emerald-500" label="> 6 bulan" />
            </div>
          </div>
          <BarList items={expiringItems} labelWidth="w-80" />
        </Card>
      </div>
    </AppLayout>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  loading,
}: {
  icon: typeof AlertTriangle;
  label: string;
  value: number;
  color: 'sky' | 'rose' | 'teal' | 'blue';
  loading?: boolean;
}) {
  const ring: Record<typeof color, string> = {
    sky: 'bg-sky-50 text-sky-600',
    rose: 'bg-rose-50 text-rose-600',
    teal: 'bg-teal-50 text-teal-600',
    blue: 'bg-blue-50 text-blue-600',
  };
  return (
    <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${ring[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <div className="text-xs text-gray-500">{label}</div>
        <div className="text-xl font-semibold text-gray-800">
          {loading ? <span className="text-gray-300">…</span> : value}
        </div>
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`w-2.5 h-2.5 rounded-sm ${color}`} />
      {label}
    </span>
  );
}
