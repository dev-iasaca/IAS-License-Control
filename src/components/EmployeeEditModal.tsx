import { useEffect, useState } from 'react';
import Modal from './Modal';
import { insertEmployee, updateEmployee, type Employee } from '../lib/employees-data';
import { fetchPositions, type Position } from '../lib/positions-data';
import { fetchAreas, type Area } from '../lib/areas-data';

type Props = {
  open: boolean;
  onClose: () => void;
  employee: Employee | null;
  onSaved?: (item: Employee) => void;
  nextNo?: number;
};

const EMPTY_FORM = {
  id: '',
  name: '',
  organization: '',
  position: '',
  group: '',
  area: '',
  type: 'Tetap',
  gender: 'Laki-laki',
  email: '',
  phoneNumber: '',
};

export default function EmployeeEditModal({ open, onClose, employee, onSaved, nextNo = 1 }: Props) {
  const isNew = employee === null;
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);

  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        const [p, a] = await Promise.all([fetchPositions(), fetchAreas()]);
        setPositions(p);
        setAreas(a);
      } catch {
        /* silent — selects will fall back to current value */
      }
    })();
  }, [open]);

  useEffect(() => {
    if (open) {
      setForm({
        id: employee?.id ?? '',
        name: employee?.name ?? '',
        organization: employee?.organization ?? '',
        position: employee?.position ?? '',
        group: employee?.group ?? '',
        area: employee?.area ?? '',
        type: employee?.type ?? 'Tetap',
        gender: employee?.gender ?? 'Laki-laki',
        email: employee?.email ?? '',
        phoneNumber: employee?.phoneNumber ?? '',
      });
      setError(null);
      setSaving(false);
    }
  }, [open, employee]);

  const update = (patch: Partial<typeof form>) => setForm((prev) => ({ ...prev, ...patch }));

  const handlePositionChange = (positionTitle: string) => {
    const match = positions.find((p) => p.position === positionTitle);
    update({ position: positionTitle, group: match?.group ?? form.group });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.id.trim() || !form.name.trim()) {
      setError('NIK dan Employee Name wajib diisi.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (isNew) {
        const created = await insertEmployee(form, nextNo);
        onSaved?.(created);
      } else if (employee) {
        await updateEmployee(employee.id, form);
        onSaved?.({ ...employee, ...form });
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan data.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isNew ? 'Add Employee' : 'Edit Employee'}
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="NIK" value={form.id} onChange={(v) => update({ id: v })} />
          <Field label="Employee Name" value={form.name} onChange={(v) => update({ name: v })} />
          <Field label="Organization" value={form.organization} onChange={(v) => update({ organization: v })} />
          <Select
            label="Position"
            value={form.position}
            onChange={handlePositionChange}
            options={buildOptions(form.position, positions.map((p) => p.position))}
            placeholder="-Select Position-"
          />
          <Select
            label="Group"
            value={form.group}
            onChange={(v) => update({ group: v })}
            options={buildOptions(form.group, Array.from(new Set(positions.map((p) => p.group))))}
            placeholder="-Select Group-"
          />
          <Select
            label="Area"
            value={form.area}
            onChange={(v) => update({ area: v })}
            options={buildOptions(form.area, areas.map((a) => a.name))}
            placeholder="-Select Area-"
          />
          <Select
            label="Employee Type"
            value={form.type}
            onChange={(v) => update({ type: v })}
            options={['Tetap', 'Kontrak', 'Magang']}
          />
          <Select
            label="Gender"
            value={form.gender}
            onChange={(v) => update({ gender: v })}
            options={['Laki-laki', 'Perempuan']}
          />
          <Field label="Email" type="email" value={form.email} onChange={(v) => update({ email: v })} />
          <Field label="Phone Number" value={form.phoneNumber} onChange={(v) => update({ phoneNumber: v })} />
          {error && (
            <p className="md:col-span-2 text-xs text-rose-600 bg-rose-50 border border-rose-100 rounded px-3 py-2">
              {error}
            </p>
          )}
        </div>
        <div className="flex justify-end gap-2 px-6 py-3 border-t border-gray-100 bg-gray-50 rounded-b-lg">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 text-xs font-medium text-white bg-teal-500 rounded-md hover:bg-teal-600 disabled:opacity-60"
          >
            {saving ? 'Saving…' : isNew ? 'Create Employee' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="flex flex-col gap-1 text-xs">
      <span className="text-gray-600">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-200 rounded-md px-3 py-2 text-xs focus:outline-none focus:border-teal-400"
      />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1 text-xs">
      <span className="text-gray-600">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-200 rounded-md px-3 py-2 text-xs bg-white focus:outline-none focus:border-teal-400"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function buildOptions(current: string, list: string[]): string[] {
  const filtered = list.filter((x) => x.trim() !== '');
  if (current && !filtered.includes(current)) return [current, ...filtered];
  return filtered;
}
