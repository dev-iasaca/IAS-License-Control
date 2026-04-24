import { useEffect, useMemo, useState } from 'react';
import { ArrowUpDown, ChevronDown, Download, Plus, Upload } from 'lucide-react';
import AppLayout from '../components/AppLayout';
import PageHeader from '../components/PageHeader';
import { ActionBtn, Card } from '../components/shared';
import ActionMenu from '../components/ActionMenu';
import JobFamilyEditModal from '../components/JobFamilyEditModal';
import { deleteJobFamily, fetchJobFamilies, type JobFamily } from '../lib/job-families-data';
import { exportToXlsx, type ExportColumn } from '../lib/export-excel';
import type { Route } from '../App';

type Props = { currentRoute: Route; onNavigate: (r: Route) => void };

const HEADERS = ['#', 'Code Job Family', 'Name Job Family', 'Name Job Family Align', 'Action'];

export default function MasterJobFamilyPage({ currentRoute, onNavigate }: Props) {
  const [items, setItems] = useState<JobFamily[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editing, setEditing] = useState<JobFamily | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((j) => {
      const hay = [j.code, j.name, j.nameAlign].map((v) => String(v ?? '').toLowerCase()).join(' ');
      return hay.includes(q);
    });
  }, [items, search]);

  const loadData = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      setItems(await fetchJobFamilies());
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const openEdit = (j: JobFamily | null) => {
    setEditing(j);
    setEditOpen(true);
  };
  const closeEdit = () => {
    setEditOpen(false);
    setEditing(null);
  };
  const handleSaved = () => {
    void loadData();
  };

  const handleDelete = async (j: JobFamily) => {
    if (!window.confirm(`Hapus job family "${j.name}" (${j.code})?`)) return;
    try {
      await deleteJobFamily(j.code);
      await loadData();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Gagal menghapus job family.');
    }
  };

  const handleExport = () => {
    const columns: ExportColumn<JobFamily>[] = [
      { header: 'No', get: (r) => r.no },
      { header: 'Code Job Family', get: (r) => r.code },
      { header: 'Name Job Family', get: (r) => r.name },
      { header: 'Name Job Family Align', get: (r) => r.nameAlign },
    ];
    exportToXlsx({ fileName: `master-job-family-${new Date().toISOString().slice(0, 10)}`, sheetName: 'Job Families', columns, rows: items });
  };

  return (
    <AppLayout currentRoute={currentRoute} onNavigate={onNavigate}>
      <PageHeader
        title="Master Job Family"
        breadcrumb={['Home', 'Master Data', 'Master Job Family']}
        actions={
          <>
            <ActionBtn icon={Upload} color="teal">Import</ActionBtn>
            <ActionBtn icon={Download} color="emerald" onClick={handleExport}>Export Excel</ActionBtn>
            <ActionBtn icon={Plus} color="blue" onClick={() => openEdit(null)}>
              Add Job Family
            </ActionBtn>
          </>
        }
      />

      <div className="max-w-screen-2xl mx-auto px-6 py-5 space-y-5">
        <Card>
          <h3 className="text-sm font-semibold text-gray-800 mb-4">
            List Job Family Member
          </h3>

          <button
            type="button"
            className="flex items-center justify-between w-full px-3 py-2.5 mb-4 text-xs text-gray-400 bg-white border border-gray-200 rounded-md hover:border-gray-300"
          >
            <span>-Pilih Organization-</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

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
                placeholder="Cari code atau nama..."
                className="border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-teal-400"
              />
            </label>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left text-gray-600 border-b border-gray-100">
                  {HEADERS.map((h, i) => (
                    <th key={h} className="font-semibold py-3 px-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1">
                        <span className={i === 0 ? 'text-teal-500' : ''}>{h}</span>
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
                {!loading && !loadError && filtered.map((j) => (
                  <tr key={j.code} className="border-b border-gray-50 hover:bg-gray-50/60">
                    <td className="py-3 px-3 text-gray-500">{j.no}</td>
                    <td className="py-3 px-3 text-gray-700">{j.code}</td>
                    <td className="py-3 px-3 text-teal-600">{j.name}</td>
                    <td className="py-3 px-3 text-teal-600">{j.nameAlign}</td>
                    <td className="py-3 px-3">
                      <ActionMenu onEdit={() => openEdit(j)} onDelete={() => void handleDelete(j)} />
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

      <JobFamilyEditModal
        open={editOpen}
        onClose={closeEdit}
        jobFamily={editing}
        onSaved={handleSaved}
        nextNo={items.length + 1}
      />
    </AppLayout>
  );
}
