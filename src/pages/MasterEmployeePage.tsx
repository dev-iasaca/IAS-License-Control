import { useEffect, useMemo, useState } from 'react';
import { ArrowUpDown, Download, Plus, RefreshCw, Upload } from 'lucide-react';
import AppLayout from '../components/AppLayout';
import PageHeader from '../components/PageHeader';
import { ActionBtn, Badge, Card, FilterInput } from '../components/shared';
import ActionMenu from '../components/ActionMenu';
import EmployeeDetailModal from '../components/EmployeeDetailModal';
import EmployeeEditModal from '../components/EmployeeEditModal';
import { deleteEmployee, fetchEmployees, type Employee } from '../lib/employees-data';
import { exportToXlsx, type ExportColumn } from '../lib/export-excel';
import type { Route } from '../App';

type Props = { currentRoute: Route; onNavigate: (r: Route) => void };

const FILTERS: Array<{ label?: string; chip?: string }> = [
  { chip: 'PT Integrasi Aviasi Solusi' },
  { label: '-Select Area-' },
  { label: '-Select Group-' },
  { label: '-Select Job Family-' },
  { label: '-Select Top Talent-' },
  { label: '-Select BOD Level-' },
];

const HEADERS = [
  '#',
  'Employee ID Number',
  'Employee Name',
  'Organization',
  'Position',
  'Area',
  'Employee Type',
  'Status',
  'Action',
];

export default function MasterEmployeePage({ currentRoute, onNavigate }: Props) {
  const [items, setItems] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [viewing, setViewing] = useState<Employee | null>(null);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((e) => {
      const hay = [e.id, e.name, e.organization, e.position, e.area, e.type, e.status, e.group, e.email, e.phoneNumber]
        .map((v) => String(v ?? '').toLowerCase()).join(' ');
      return hay.includes(q);
    });
  }, [items, search]);

  const loadData = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const rows = await fetchEmployees();
      setItems(rows);
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const openEdit = (e: Employee | null) => {
    setEditing(e);
    setEditOpen(true);
  };
  const closeEdit = () => {
    setEditOpen(false);
    setEditing(null);
  };
  const handleSaved = (item: Employee) =>
    setItems((prev) => {
      const idx = prev.findIndex((x) => x.no === item.no);
      if (idx === -1) return [...prev, item];
      const next = [...prev];
      next[idx] = item;
      return next;
    });

  const handleDelete = async (e: Employee) => {
    if (!window.confirm(`Hapus employee "${e.name}" (NIK ${e.id})? Aksi ini juga menghapus license assignment terkait.`)) return;
    try {
      await deleteEmployee(e.id);
      setItems((prev) => prev.filter((x) => x.id !== e.id));
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Gagal menghapus employee.');
    }
  };

  const handleExport = () => {
    const columns: ExportColumn<Employee>[] = [
      { header: 'No', get: (r) => r.no },
      { header: 'NIK', get: (r) => r.id },
      { header: 'Name', get: (r) => r.name },
      { header: 'Organization', get: (r) => r.organization },
      { header: 'Position', get: (r) => r.position },
      { header: 'Area', get: (r) => r.area },
      { header: 'Type', get: (r) => r.type },
      { header: 'Status', get: (r) => r.status },
      { header: 'Group', get: (r) => r.group },
      { header: 'Gender', get: (r) => r.gender },
      { header: 'Email', get: (r) => r.email },
      { header: 'Phone Number', get: (r) => r.phoneNumber },
    ];
    exportToXlsx({ fileName: `master-employee-${new Date().toISOString().slice(0, 10)}`, sheetName: 'Employees', columns, rows: items });
  };

  return (
    <AppLayout currentRoute={currentRoute} onNavigate={onNavigate}>
      <PageHeader
        title="Master Employee"
        breadcrumb={['Home', 'Master Data', 'Master Employee']}
        actions={
          <>
            <ActionBtn icon={Upload} color="teal">Import</ActionBtn>
            <ActionBtn icon={Download} color="emerald" onClick={handleExport}>Export Excel</ActionBtn>
            <ActionBtn icon={RefreshCw} color="sky" onClick={() => void loadData()}>Sync Data API</ActionBtn>
            <ActionBtn icon={Plus} color="blue" onClick={() => openEdit(null)}>
              Add Employee
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
                placeholder="Cari NIK, nama, posisi..."
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
                {!loading && !loadError && filtered.map((e) => (
                  <tr key={e.id} className="border-b border-gray-50 hover:bg-gray-50/60">
                    <td className="py-3 px-3 text-gray-500">{e.no}</td>
                    <td className="py-3 px-3 font-medium text-gray-800">{e.id}</td>
                    <td className="py-3 px-3 text-gray-700">{e.name}</td>
                    <td className="py-3 px-3 text-teal-500">{e.organization}</td>
                    <td className="py-3 px-3 text-gray-600 max-w-[220px]">{e.position}</td>
                    <td className="py-3 px-3 text-gray-600 max-w-[260px]">{e.area}</td>
                    <td className="py-3 px-3"><Badge color="teal">{e.type}</Badge></td>
                    <td className="py-3 px-3">
                      <Badge color={e.status === 'Aktif' ? 'emerald' : 'rose'}>{e.status}</Badge>
                    </td>
                    <td className="py-3 px-3">
                      <ActionMenu
                        onView={() => setViewing(e)}
                        onEdit={() => openEdit(e)}
                        onDelete={() => void handleDelete(e)}
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

      <EmployeeDetailModal open={viewing !== null} onClose={() => setViewing(null)} employee={viewing} />
      <EmployeeEditModal
        open={editOpen}
        onClose={closeEdit}
        employee={editing}
        onSaved={handleSaved}
        nextNo={items.length + 1}
      />
    </AppLayout>
  );
}

