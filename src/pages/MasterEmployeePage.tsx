import { useState } from 'react';
import { ArrowUpDown, Download, Plus, RefreshCw, Upload } from 'lucide-react';
import AppLayout from '../components/AppLayout';
import PageHeader from '../components/PageHeader';
import { ActionBtn, Badge, Card, FilterInput } from '../components/shared';
import ActionMenu from '../components/ActionMenu';
import EmployeeDetailModal from '../components/EmployeeDetailModal';
import EmployeeEditModal from '../components/EmployeeEditModal';
import { EMPLOYEES, type Employee } from '../lib/employees-data';
import type { Route } from '../App';

type Props = { currentRoute: Route; onNavigate: (r: Route) => void };

const FILTERS: Array<{ label?: string; chip?: string }> = [
  { chip: 'PT Integrasi Aviasi Solusi' },
  { label: '-Select Area-' },
  { label: '-Select Directorate-' },
  { label: '-Select Group-' },
  { label: '-Select Division-' },
  { label: '-Select Job Family-' },
  { label: '-Select Person Grade-' },
  { label: '-Select Talent Cluster-' },
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
  'Grade Align',
  'Employee Type',
  'Talent Cluster',
  'Action',
];

export default function MasterEmployeePage({ currentRoute, onNavigate }: Props) {
  const [viewing, setViewing] = useState<Employee | null>(null);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const openEdit = (e: Employee | null) => {
    setEditing(e);
    setEditOpen(true);
  };
  const closeEdit = () => {
    setEditOpen(false);
    setEditing(null);
  };

  return (
    <AppLayout currentRoute={currentRoute} onNavigate={onNavigate}>
      <PageHeader
        title="Master Employee"
        breadcrumb={['Home', 'Master Data', 'Master Employee']}
        actions={
          <>
            <ActionBtn icon={Upload} color="teal">Import</ActionBtn>
            <ActionBtn icon={Download} color="emerald">Export Excel</ActionBtn>
            <ActionBtn icon={RefreshCw} color="sky">Sync Data API</ActionBtn>
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
                {EMPLOYEES.map((e) => (
                  <tr key={e.id} className="border-b border-gray-50 hover:bg-gray-50/60">
                    <td className="py-3 px-3 text-gray-500">{e.no}</td>
                    <td className="py-3 px-3 font-medium text-gray-800">{e.id}</td>
                    <td className="py-3 px-3 text-gray-700">{e.name}</td>
                    <td className="py-3 px-3 text-teal-500">{e.organization}</td>
                    <td className="py-3 px-3 text-gray-600 max-w-[220px]">{e.position}</td>
                    <td className="py-3 px-3 text-gray-600 max-w-[260px]">{e.area}</td>
                    <td className="py-3 px-3 text-gray-600">{e.grade}</td>
                    <td className="py-3 px-3"><Badge color="teal">{e.type}</Badge></td>
                    <td className="py-3 px-3"><Badge color="amber">{e.talentCluster}</Badge></td>
                    <td className="py-3 px-3">
                      <ActionMenu
                        onView={() => setViewing(e)}
                        onEdit={() => openEdit(e)}
                        onDelete={() => undefined}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4 text-xs text-gray-500 flex-wrap gap-3">
            <span>Showing 1 to {EMPLOYEES.length} of {EMPLOYEES.length} entries</span>
            <div className="flex items-center gap-1">
              <button className="px-2.5 py-1 border border-gray-200 rounded text-gray-400">Previous</button>
              <button className="px-2.5 py-1 bg-teal-500 text-white rounded">1</button>
              <button className="px-2.5 py-1 border border-gray-200 rounded text-gray-400">Next</button>
            </div>
          </div>
        </Card>
      </div>

      <EmployeeDetailModal open={viewing !== null} onClose={() => setViewing(null)} employee={viewing} />
      <EmployeeEditModal open={editOpen} onClose={closeEdit} employee={editing} />
    </AppLayout>
  );
}


