import { useEffect, useMemo, useState } from 'react';
import { ArrowUpDown, Download, Plus, Upload } from 'lucide-react';
import AppLayout from '../components/AppLayout';
import PageHeader from '../components/PageHeader';
import { ActionBtn, Badge, Card, FilterInput, type AccentColor } from '../components/shared';
import ActionMenu from '../components/ActionMenu';
import AccountDetailModal from '../components/AccountDetailModal';
import AccountEditModal from '../components/AccountEditModal';
import { deleteAccount, fetchAccounts, type Account, type AccountStatus } from '../lib/accounts-data';
import { exportToXlsx, type ExportColumn } from '../lib/export-excel';
import type { Route } from '../App';

type Props = { currentRoute: Route; onNavigate: (r: Route) => void };

const STATUS_COLOR: Record<AccountStatus, AccentColor> = {
  Active: 'emerald',
  Inactive: 'rose',
  Suspended: 'amber',
};

const FILTERS: Array<{ label?: string; chip?: string }> = [
  { chip: 'PT Integrasi Aviasi Solusi' },
  { label: '-Select Role-' },
  { label: '-Select Status-' },
  { label: '-Select Department-' },
];

const HEADERS = [
  '#', 'Username', 'NIK', 'Full Name', 'Email',
  'Role', 'Organization', 'Status', 'Last Login', 'Action',
];

export default function MasterAccountPage({ currentRoute, onNavigate }: Props) {
  const [items, setItems] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [viewing, setViewing] = useState<Account | null>(null);
  const [editing, setEditing] = useState<Account | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((a) => {
      const hay = [a.username, a.nik, a.name, a.email, a.role, a.org, a.status]
        .map((v) => String(v ?? '').toLowerCase()).join(' ');
      return hay.includes(q);
    });
  }, [items, search]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setLoadError(null);
      try {
        setItems(await fetchAccounts());
      } catch (e) {
        setLoadError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const openEdit = (a: Account | null) => {
    setEditing(a);
    setEditOpen(true);
  };
  const closeEdit = () => {
    setEditOpen(false);
    setEditing(null);
  };
  const handleSaved = (item: Account) =>
    setItems((prev) => {
      const idx = prev.findIndex((x) => x.no === item.no);
      if (idx === -1) return [...prev, item];
      const next = [...prev];
      next[idx] = item;
      return next;
    });

  const handleDelete = async (a: Account) => {
    if (!window.confirm(`Hapus account "${a.username}"?`)) return;
    try {
      await deleteAccount(a.username);
      setItems((prev) => prev.filter((x) => x.username !== a.username));
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Gagal menghapus account.');
    }
  };

  const handleExport = () => {
    const columns: ExportColumn<Account>[] = [
      { header: 'No', get: (r) => r.no },
      { header: 'Username', get: (r) => r.username },
      { header: 'NIK', get: (r) => r.nik },
      { header: 'Full Name', get: (r) => r.name },
      { header: 'Email', get: (r) => r.email },
      { header: 'Role', get: (r) => r.role },
      { header: 'Organization', get: (r) => r.org },
      { header: 'Status', get: (r) => r.status },
      { header: 'Last Login', get: (r) => r.lastLogin },
    ];
    exportToXlsx({ fileName: `master-account-${new Date().toISOString().slice(0, 10)}`, sheetName: 'Accounts', columns, rows: items });
  };

  return (
    <AppLayout currentRoute={currentRoute} onNavigate={onNavigate}>
      <PageHeader
        title="Master Account"
        breadcrumb={['Home', 'Master Data', 'Master Account']}
        actions={
          <>
            <ActionBtn icon={Upload} color="teal">Import</ActionBtn>
            <ActionBtn icon={Download} color="emerald" onClick={handleExport}>Export Excel</ActionBtn>
            <button
              type="button"
              onClick={() => openEdit(null)}
              className="inline-flex items-center gap-2 text-white text-xs font-medium px-3.5 py-2 rounded-md shadow-sm transition-colors bg-blue-500 hover:bg-blue-600"
            >
              <Plus className="w-4 h-4" />
              Add Account
            </button>
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
                placeholder="Cari username, nama, email..."
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
                {!loading && !loadError && filtered.map((a) => (
                  <tr key={a.username} className="border-b border-gray-50 hover:bg-gray-50/60">
                    <td className="py-3 px-3 text-gray-500">{a.no}</td>
                    <td className="py-3 px-3 font-medium text-gray-800">{a.username}</td>
                    <td className="py-3 px-3 text-gray-600">{a.nik}</td>
                    <td className="py-3 px-3 text-gray-700">{a.name}</td>
                    <td className="py-3 px-3 text-teal-500">{a.email}</td>
                    <td className="py-3 px-3 text-gray-600">{a.role}</td>
                    <td className="py-3 px-3 text-gray-600">{a.org}</td>
                    <td className="py-3 px-3"><Badge color={STATUS_COLOR[a.status]}>{a.status}</Badge></td>
                    <td className="py-3 px-3 text-gray-500 whitespace-nowrap">{a.lastLogin}</td>
                    <td className="py-3 px-3">
                      <ActionMenu
                        onView={() => setViewing(a)}
                        onEdit={() => openEdit(a)}
                        onDelete={() => void handleDelete(a)}
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

      <AccountDetailModal open={viewing !== null} onClose={() => setViewing(null)} account={viewing} />
      <AccountEditModal
        open={editOpen}
        onClose={closeEdit}
        account={editing}
        onSaved={handleSaved}
        nextNo={items.length + 1}
      />
    </AppLayout>
  );
}
