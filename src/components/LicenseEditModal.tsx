import { useEffect, useState } from 'react';
import Modal from './Modal';
import { insertLicense, updateLicense, type License } from '../lib/licenses-data';

type Props = {
  open: boolean;
  onClose: () => void;
  license: License | null;
  onSaved?: (item: License) => void;
  nextNo?: number;
};

const EMPTY_FORM = {
  nik: '',
  name: '',
  organization: 'PT Integrasi Aviasi Solusi',
  licenseName: '',
  instansi: '',
  negara: '',
  jobFamily: '',
  startDate: '',
  endDate: '',
};

export default function LicenseEditModal({ open, onClose, license, onSaved, nextNo = 1 }: Props) {
  const isNew = license === null;
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setForm({
        nik: license?.nik ?? '',
        name: license?.name ?? '',
        organization: license?.organization ?? 'PT Integrasi Aviasi Solusi',
        licenseName: license?.licenseName ?? '',
        instansi: license?.instansi ?? '',
        negara: license?.negara ?? '',
        jobFamily: license?.jobFamily ?? '',
        startDate: license?.startDate ?? '',
        endDate: license?.endDate ?? '',
      });
      setError(null);
      setSaving(false);
    }
  }, [open, license]);

  const update = (patch: Partial<typeof form>) => setForm((prev) => ({ ...prev, ...patch }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nik.trim() || !form.licenseName.trim()) {
      setError('NIK dan License Name wajib diisi.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (isNew) {
        const created = await insertLicense(form, nextNo);
        onSaved?.(created);
      } else if (license) {
        await updateLicense(license, form);
        onSaved?.({ ...license, ...form });
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
      title={isNew ? 'Add License' : 'Edit License'}
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="NIK" value={form.nik} onChange={(v) => update({ nik: v })} />
          <Field label="Employee Name" value={form.name} onChange={(v) => update({ name: v })} />
          <Field label="Organization" value={form.organization} onChange={(v) => update({ organization: v })} />
          <Field label="License Name" value={form.licenseName} onChange={(v) => update({ licenseName: v })} />
          <Field label="Instansi" value={form.instansi} onChange={(v) => update({ instansi: v })} />
          <Field label="Negara" value={form.negara} onChange={(v) => update({ negara: v })} />
          <Field label="Job Family" value={form.jobFamily} onChange={(v) => update({ jobFamily: v })} />
          <Field label="Start Date" type="date" value={form.startDate} onChange={(v) => update({ startDate: v })} />
          <Field label="End Date" type="date" value={form.endDate} onChange={(v) => update({ endDate: v })} />
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
            {saving ? 'Saving…' : isNew ? 'Create License' : 'Save Changes'}
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
