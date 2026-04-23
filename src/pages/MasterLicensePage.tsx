import { useState } from 'react';
import { ArrowUpDown, Download, Plus, RefreshCw, Upload } from 'lucide-react';
import AppLayout from '../components/AppLayout';
import PageHeader from '../components/PageHeader';
import { ActionBtn, Card, FilterInput } from '../components/shared';
import ActionMenu from '../components/ActionMenu';
import LicenseDetailModal from '../components/LicenseDetailModal';
import LicenseEditModal from '../components/LicenseEditModal';
import { LICENSES, type License } from '../lib/licenses-data';
import type { Route } from '../App';

type Props = { currentRoute: Route; onNavigate: (r: Route) => void };

const FILTERS: Array<{ label?: string; chip?: string }> = [
  { chip: 'PT Integrasi Aviasi Solusi' },
  { label: '-Select Job Family-' },
  { label: '-Select License Name-' },
  { label: '-Select Instansi-' },
  { label: '-Select Negara-' },
  { label: '-Select Status-' },
];

const HEADERS = [
  '#',
  'NIK',
  'Employee Name',
  'License Name',
  'Instansi',
  'Start Date',
  'End Date',
  'Negara',
  'Job Family',
  'Action',
];

export default function MasterLicensePage({ currentRoute, onNavigate }: Props) {
  const [viewing, setViewing] = useState<License | null>(null);
  const [editing, setEditing] = useState<License | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const openEdit = (l: License | null) => {
    setEditing(l);
    setEditOpen(true);
  };
  const closeEdit = () => {
    setEditOpen(false);
    setEditing(null);
  };

  return (
    <AppLayout currentRoute={currentRoute} onNavigate={onNavigate}>
      <PageHeader
        title="Master License"
        breadcrumb={['Home', 'Master Data', 'Master License']}
        actions={
          <>
            <ActionBtn icon={Upload} color="teal">Import</ActionBtn>
            <ActionBtn icon={Download} color="emerald">Export Excel</ActionBtn>
            <ActionBtn icon={RefreshCw} color="sky">Sync Data API</ActionBtn>
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
                        {h !== '#' && h !== 'Action' && (
                          <ArrowUpDown className="w-3 h-3 text-gray-300" />
                        )}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {LICENSES.map((l) => (
                  <tr key={`${l.no}-${l.nik}`} className="border-b border-gray-50 hover:bg-gray-50/60">
                    <td className="py-3 px-3 text-gray-500">{l.no}</td>
                    <td className="py-3 px-3 font-medium text-gray-800">{l.nik}</td>
                    <td className="py-3 px-3 text-gray-700">{l.name}</td>
                    <td className="py-3 px-3 text-teal-600 max-w-[260px]">{l.licenseName}</td>
                    <td className="py-3 px-3 text-gray-600">{l.instansi ?? '-'}</td>
                    <td className="py-3 px-3 text-gray-600 whitespace-nowrap">{l.startDate}</td>
                    <td className="py-3 px-3 text-gray-600 whitespace-nowrap">{l.endDate}</td>
                    <td className="py-3 px-3 text-gray-600">{l.negara ?? '-'}</td>
                    <td className="py-3 px-3 text-gray-600">{l.jobFamily ?? '-'}</td>
                    <td className="py-3 px-3">
                      <ActionMenu
                        onView={() => setViewing(l)}
                        onEdit={() => openEdit(l)}
                        onDelete={() => undefined}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4 text-xs text-gray-500 flex-wrap gap-3">
            <span>Showing 1 to {LICENSES.length} of {LICENSES.length} entries</span>
            <div className="flex items-center gap-1">
              <button className="px-2.5 py-1 border border-gray-200 rounded text-gray-400">Previous</button>
              <button className="px-2.5 py-1 bg-teal-500 text-white rounded">1</button>
              <button className="px-2.5 py-1 border border-gray-200 rounded text-gray-400">Next</button>
            </div>
          </div>
        </Card>
      </div>

      <LicenseDetailModal open={viewing !== null} onClose={() => setViewing(null)} license={viewing} />
      <LicenseEditModal open={editOpen} onClose={closeEdit} license={editing} />
    </AppLayout>
  );
}
