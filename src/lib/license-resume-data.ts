import type { ExpiringLicense } from './license-expiring-data';

export type CountByKey = { key: string; count: number };

export type DashboardSummary = {
  totalLicense: number;
  totalPosition: number;
  totalLocation: number;
  expiringSoon: number;
};

export function computeSummary(rows: ExpiringLicense[]): DashboardSummary {
  const positions = new Set<string>();
  const locations = new Set<string>();
  let expiringSoon = 0;
  for (const r of rows) {
    if (r.position) positions.add(r.position);
    if (r.area) locations.add(r.area);
    if (r.monthsRemaining > 0 && r.monthsRemaining <= 3) expiringSoon += 1;
  }
  return {
    totalLicense: rows.length,
    totalPosition: positions.size,
    totalLocation: locations.size,
    expiringSoon,
  };
}

function groupCount(rows: ExpiringLicense[], key: 'position' | 'area'): CountByKey[] {
  const counts = new Map<string, number>();
  for (const r of rows) {
    const v = r[key];
    if (!v) continue;
    counts.set(v, (counts.get(v) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([k, count]) => ({ key: k, count }))
    .sort((a, b) => b.count - a.count);
}

export function countByPosition(rows: ExpiringLicense[], limit = 10): CountByKey[] {
  return groupCount(rows, 'position').slice(0, limit);
}

export function countByLocation(rows: ExpiringLicense[], limit = 10): CountByKey[] {
  return groupCount(rows, 'area').slice(0, limit);
}
