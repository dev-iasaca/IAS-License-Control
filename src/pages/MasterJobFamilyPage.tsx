import { useState } from 'react';
import { ArrowUpDown, ChevronDown, Plus, Upload } from 'lucide-react';
import AppLayout from '../components/AppLayout';
import PageHeader from '../components/PageHeader';
import { ActionBtn, Card } from '../components/shared';
import JobFamilyEditModal from '../components/JobFamilyEditModal';
import { JOB_FAMILIES, type JobFamily } from '../lib/job-families-data';
import type { Route } from '../App';

type Props = { currentRoute: Route; onNavigate: (r: Route) => void };

const HEADERS = ['#', 'Code Job Family', 'Name Job Family', 'Name Job Family Align'];

export default function MasterJobFamilyPage({ currentRoute, onNavigate }: Props) {
  const [editing, setEditing] = useState<JobFamily | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const openEdit = (j: JobFamily | null) => {
    setEditing(j);
    setEditOpen(true);
  };
  const closeEdit = () => {
    setEditOpen(false);
    setEditing(null);
  };

  return (
    <AppLayout currentRoute={currentRoute} onNavigate={onNavigate}>
      <PageHeader
        title="Master Job Family"
        breadcrumb={['Home', 'Master Data', 'Master Job Family']}
        actions={
          <>
            <ActionBtn icon={Upload} color="teal">Import</ActionBtn>
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

          <label className="text-xs text-gray-600 flex items-center gap-2 mb-4">
            Show
            <select className="border border-gray-200 rounded px-1.5 py-0.5 text-xs focus:outline-none">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
            entries
          </label>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left text-gray-600 border-b border-gray-100">
                  {HEADERS.map((h, i) => (
                    <th key={h} className="font-semibold py-3 px-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1">
                        <span className={i === 0 ? 'text-teal-500' : ''}>{h}</span>
                        <ArrowUpDown className="w-3 h-3 text-gray-300" />
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {JOB_FAMILIES.map((j) => (
                  <tr key={j.code} className="border-b border-gray-50 hover:bg-gray-50/60">
                    <td className="py-3 px-3 text-gray-500">{j.no}</td>
                    <td className="py-3 px-3 text-gray-700">{j.code}</td>
                    <td className="py-3 px-3 text-teal-600">{j.name}</td>
                    <td className="py-3 px-3 text-teal-600">{j.nameAlign}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4 text-xs text-gray-500 flex-wrap gap-3">
            <span>Showing 1 to {JOB_FAMILIES.length} of {JOB_FAMILIES.length} entries</span>
            <div className="flex items-center gap-1">
              <button className="px-2.5 py-1 border border-gray-200 rounded text-gray-400">Previous</button>
              <button className="px-2.5 py-1 bg-teal-500 text-white rounded">1</button>
              <button className="px-2.5 py-1 border border-gray-200 rounded text-gray-400">Next</button>
            </div>
          </div>
        </Card>
      </div>

      <JobFamilyEditModal open={editOpen} onClose={closeEdit} jobFamily={editing} />
    </AppLayout>
  );
}
