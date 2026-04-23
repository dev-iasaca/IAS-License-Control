import { useMemo, useState } from 'react';
import { AlertTriangle, ArrowUpDown, CalendarClock, CheckCircle2, Clock } from 'lucide-react';
import AppLayout from '../components/AppLayout';
import PageHeader from '../components/PageHeader';
import { Badge, Card } from '../components/shared';
import {
  EXPIRING_LICENSES,
  LICENSE_STATUSES,
  LICENSE_STATUS_COLOR,
  monthsBadgeColor,
  monthsLabel,
  type ExpiringLicense,
  type LicenseStatus,
} from '../lib/license-expiring-data';
import type { Route } from '../App';

type Props = { currentRoute: Route; onNavigate: (r: Route) => void };

const HEADERS = ['#', 'NIK', 'Employee Name', 'License Name', 'Instansi', 'End Date', 'Bulan Tersisa', 'Status'];

export default function LicenseExpiringPage({ currentRoute, onNavigate }: Props) {
  const [rows, setRows] = useState<ExpiringLicense[]>(EXPIRING_LICENSES);
  const [filterStatus, setFilterStatus] = useState<LicenseStatus | 'All'>('All');
  const [filterRange, setFilterRange] = useState<'all' | '1' | '3' | '6'>('all');

  const updateStatus = (no: number, status: LicenseStatus) => {
    setRows((prev) => prev.map((r) => (r.no === no ? { ...r, status } : r)));
  };

  const stats = useMemo(() => {
    const total = rows.length;
    const critical = rows.filter((r) => r.monthsRemaining <= 1).length;
    const warning = rows.filter((r) => r.monthsRemaining > 1 && r.monthsRemaining <= 3).length;
    const active = rows.filter((r) => r.status === 'Aktif').length;
    return { total, critical, warning, active };
  }, [rows]);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (filterStatus !== 'All' && r.status !== filterStatus) return false;
      if (filterRange === '1' && r.monthsRemaining > 1) return false;
      if (filterRange === '3' && r.monthsRemaining > 3) return false;
      if (filterRange === '6' && r.monthsRemaining > 6) return false;
      return true;
    });
  }, [rows, filterStatus, filterRange]);

  return (
    <AppLayout currentRoute={currentRoute} onNavigate={onNavigate}>
      <PageHeader
        title="License Expiring"
        breadcrumb={['Home', 'Dashboard', 'License Expiring']}
      />

      <div className="max-w-screen-2xl mx-auto px-6 py-5 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={CalendarClock} label="Total License Expiring" value={stats.total} color="sky" />
          <StatCard icon={AlertTriangle} label="Kritis (≤ 1 bulan)" value={stats.critical} color="rose" />
          <StatCard icon={Clock} label="Warning (≤ 3 bulan)" value={stats.warning} color="amber" />
          <StatCard icon={CheckCircle2} label="Status Aktif" value={stats.active} color="emerald" />
        </div>

        <Card>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              <label className="text-xs text-gray-600 flex items-center gap-2">
                Rentang:
                <select
                  value={filterRange}
                  onChange={(e) => setFilterRange(e.target.value as typeof filterRange)}
                  className="border border-gray-200 rounded px-2 py-1 text-xs bg-white focus:outline-none focus:border-teal-400"
                >
                  <option value="all">Semua</option>
                  <option value="1">≤ 1 Bulan</option>
                  <option value="3">≤ 3 Bulan</option>
                  <option value="6">≤ 6 Bulan</option>
                </select>
              </label>
              <label className="text-xs text-gray-600 flex items-center gap-2">
                Status:
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as LicenseStatus | 'All')}
                  className="border border-gray-200 rounded px-2 py-1 text-xs bg-white focus:outline-none focus:border-teal-400"
                >
                  <option value="All">Semua</option>
                  {LICENSE_STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </label>
            </div>
            <label className="text-xs text-gray-600 flex items-center gap-2">
              Search:
              <input className="border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-teal-400" />
            </label>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left text-gray-600 border-b border-gray-100">
                  {HEADERS.map((h) => (
                    <th key={h} className="font-semibold py-3 px-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1">
                        {h}
                        {h !== '#' && <ArrowUpDown className="w-3 h-3 text-gray-300" />}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((l) => (
                  <tr key={l.no} className="border-b border-gray-50 hover:bg-gray-50/60">
                    <td className="py-3 px-3 text-gray-500">{l.no}</td>
                    <td className="py-3 px-3 font-medium text-gray-800">{l.nik}</td>
                    <td className="py-3 px-3 text-gray-700">{l.name}</td>
                    <td className="py-3 px-3 text-teal-600 max-w-[260px]">{l.licenseName}</td>
                    <td className="py-3 px-3 text-gray-600">{l.instansi ?? '-'}</td>
                    <td className="py-3 px-3 text-gray-600 whitespace-nowrap">{l.endDate}</td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <Badge color={monthsBadgeColor(l.monthsRemaining)}>
                        {monthsLabel(l.monthsRemaining)}
                      </Badge>
                    </td>
                    <td className="py-3 px-3">
                      <StatusSelect
                        value={l.status}
                        onChange={(s) => updateStatus(l.no, s)}
                      />
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={HEADERS.length} className="py-6 text-center text-gray-400">
                      Tidak ada data yang sesuai dengan filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4 text-xs text-gray-500 flex-wrap gap-3">
            <span>Showing {filtered.length} of {rows.length} entries</span>
          </div>
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
}: {
  icon: typeof AlertTriangle;
  label: string;
  value: number;
  color: 'sky' | 'rose' | 'amber' | 'emerald';
}) {
  const ring: Record<typeof color, string> = {
    sky: 'bg-sky-50 text-sky-600',
    rose: 'bg-rose-50 text-rose-600',
    amber: 'bg-amber-50 text-amber-600',
    emerald: 'bg-emerald-50 text-emerald-600',
  };
  return (
    <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${ring[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <div className="text-xs text-gray-500">{label}</div>
        <div className="text-xl font-semibold text-gray-800">{value}</div>
      </div>
    </div>
  );
}

function StatusSelect({
  value,
  onChange,
}: {
  value: LicenseStatus;
  onChange: (s: LicenseStatus) => void;
}) {
  const color = LICENSE_STATUS_COLOR[value];
  const bg: Record<string, string> = {
    sky: 'bg-sky-50 text-sky-700 border-sky-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as LicenseStatus)}
      className={`text-xs font-medium px-2 py-1 rounded border focus:outline-none ${bg[color]}`}
    >
      {LICENSE_STATUSES.map((s) => (
        <option key={s} value={s} className="bg-white text-gray-700">
          {s}
        </option>
      ))}
    </select>
  );
}
