import { useEffect, useMemo, useState } from 'react';
import { ArrowUpDown, Download, Plus, RefreshCw, Upload } from 'lucide-react';
import AppLayout from '../components/AppLayout';
import PageHeader from '../components/PageHeader';
import { ActionBtn, Card, FilterInput } from '../components/shared';
import ActionMenu from '../components/ActionMenu';
import LicenseDetailModal from '../components/LicenseDetailModal';
import LicenseEditModal from '../components/LicenseEditModal';
import { deleteLicense, fetchLicenses, type License } from '../lib/licenses-data';
import { exportToXlsx, type ExportColumn } from '../lib/export-excel';
import type { Route } from '../App';

type Props = { currentRoute: Route; onNavigate: (r: Route) => void };

const FILTERS: Array<{ label?: string; chip?: string }> = [
  { chip: 'PT Integrasi Aviasi Solusi' },
  { label: '-Select Job Family-' },
  { label: '-Select License Name-' },
  { label: '-Select Instansi-' },
  { label: '-Select Status-' },
];

const HEADERS = [
  '#',
  'NIK',
  'Employee Name',
  'Nomor License',
  'License Name',
  'Instansi',
  'Start Date',
  'End Date',
  'Job Family',
  'Action',
];

export default function MasterLicensePage({ currentRoute, onNavigate }: Props) {
  const [items, setItems] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [viewing, setViewing] = useState<License | null>(null);
  const [editing, setEditing] = useState<License | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((l) => {
      const hay = [l.nik, l.name, l.licenseNumber, l.licenseName, l.instansi, l.jobFamily, l.organization, l.startDate, l.endDate]
        .map((v) => String(v ?? '').toLowerCase()).join(' ');
      return hay.includes(q);
    });
  }, [items, search]);

  const loadData = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      setItems(await fetchLicenses());
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const openEdit = (l: License | null) => {
    setEditing(l);
    setEditOpen(true);
  };
  const closeEdit = () => {
    setEditOpen(false);
    setEditing(null);
  };
  const handleSaved = (item: License) =>
    setItems((prev) => {
      const idx = prev.findIndex((x) => x.no === item.no);
      if (idx === -1) return [...prev, item];
      const next = [...prev];
      next[idx] = item;
      return next;
    });

  const handleDelete = async (l: License) => {
    if (!window.confirm(`Hapus license "${l.licenseName}" untuk ${l.name} (NIK ${l.nik})?`)) return;
    try {
      await deleteLicense(l);
      setItems((prev) => prev.filter((x) => !(x.nik === l.nik && x.licenseName === l.licenseName)));
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Gagal menghapus license.');
    }
  };

  const handleExport = () => {
    const columns: ExportColumn<License>[] = [
      { header: 'No', get: (r) => r.no },
      { header: 'NIK', get: (r) => r.nik },
      { header: 'Employee Name', get: (r) => r.name },
      { header: 'Nomor License', get: (r) => r.licenseNumber },
      { header: 'License Name', get: (r) => r.licenseName },
      { header: 'Instansi', get: (r) => r.instansi },
      { header: 'Start Date', get: (r) => r.startDate },
      { header: 'End Date', get: (r) => r.endDate },
      { header: 'Job Family', get: (r) => r.jobFamily },
      { header: 'Organization', get: (r) => r.organization },
    ];
    exportToXlsx({ fileName: `master-license-${new Date().toISOString().slice(0, 10)}`, sheetName: 'Licenses', columns, rows: items });
  };

  return (
    <AppLayout currentRoute={currentRoute} onNavigate={onNavigate}>
      <PageHeader
        title="Master License"
        breadcrumb={['Home', 'Master Data', 'Master License']}
        actions={
          <>
            <ActionBtn icon={Upload} color="teal">Import</ActionBtn>
            <ActionBtn icon={Download} color="emerald" onClick={handleExport}>Export Excel</ActionBtn>
            <ActionBtn icon={RefreshCw} color="sky" onClick={() => void loadData()}>Sync Data API</ActionBtn>
            <ActionBtn icon={Plus} color="blue" onClick={() => openEdit(null)}>
              Add License
            </ActionBtn>
          </>
        }
      />

      <div className="max-w-screen-2xl mx-auto px-6 py-5 space-y-5">
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {FILTERS.map((f, i) => (
              <FilterInput key={i} label={f.label} chip={f.chip} />
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <label className="text-xs text-gray-600 flex items-center gap-2">
              Show
              <select className="border border-gray-200 rounded px-1.5 py-0.5 text-xs focus:outline-none">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
              entries
            </label>
            <label className="text-xs text-gray-600 flex items-center gap-2">
              Search:
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari NIK, nama, lisensi..."
                className="border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-teal-400"
              />
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
                        {h !== '#' && h !== 'Action' && (
                          <ArrowUpDown className="w-3 h-3 text-gray-300" />
                        )}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan={HEADERS.length} className="py-6 text-center text-gray-400">Loading...</td></tr>
                )}
                {!loading && loadError && (
                  <tr><td colSpan={HEADERS.length} className="py-6 text-center text-rose-500">{loadError}</td></tr>
                )}
                {!loading && !loadError && filtered.length === 0 && (
                  <tr><td colSpan={HEADERS.length} className="py-6 text-center text-gray-400">{search ? 'Tidak ada data sesuai pencarian' : 'No data'}</td></tr>
                )}
                {!loading && !loadError && filtered.map((l) => (
                  <tr key={`${l.no}-${l.nik}`} className="border-b border-gray-50 hover:bg-gray-50/60">
                    <td className="py-3 px-3 text-gray-500">{l.no}</td>
                    <td className="py-3 px-3 font-medium text-gray-800">{l.nik}</td>
                    <td className="py-3 px-3 text-gray-700">{l.name}</td>
                    <td className="py-3 px-3 text-gray-600 whitespace-nowrap">{l.licenseNumber ?? '-'}</td>
                    <td className="py-3 px-3 text-teal-600 max-w-[260px]">{l.licenseName}</td>
                    <td className="py-3 px-3 text-gray-600">{l.instansi ?? '-'}</td>
                    <td className="py-3 px-3 text-gray-600 whitespace-nowrap">{l.startDate}</td>
                    <td className="py-3 px-3 text-gray-600 whitespace-nowrap">{l.endDate}</td>
                    <td className="py-3 px-3 text-gray-600">{l.jobFamily ?? '-'}</td>
                    <td className="py-3 px-3">
                      <ActionMenu
                        onView={() => setViewing(l)}
                        onEdit={() => openEdit(l)}
                        onDelete={() => void handleDelete(l)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4 text-xs text-gray-500 flex-wrap gap-3">
            <span>Showing 1 to {filtered.length} of {filtered.length} entries</span>
            <div className="flex items-center gap-1">
              <button className="px-2.5 py-1 border border-gray-200 rounded text-gray-400">Previous</button>
              <button className="px-2.5 py-1 bg-teal-500 text-white rounded">1</button>
              <button className="px-2.5 py-1 border border-gray-200 rounded text-gray-400">Next</button>
            </div>
          </div>
        </Card>
      </div>

      <LicenseDetailModal open={viewing !== null} onClose={() => setViewing(null)} license={viewing} />
      <LicenseEditModal
        open={editOpen}
        onClose={closeEdit}
        license={editing}
        onSaved={handleSaved}
        nextNo={items.length + 1}
      />
    </AppLayout>
  );
}
