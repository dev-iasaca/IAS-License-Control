import { useEffect, useState } from 'react';
import Modal from './Modal';
import { insertArea, updateArea, type Area } from '../lib/areas-data';

type Props = {
  open: boolean;
  onClose: () => void;
  area: Area | null;
  onSaved?: (item: Area) => void;
  nextNo?: number;
};

export default function AreaEditModal({ open, onClose, area, onSaved, nextNo = 1 }: Props) {
  const isNew = area === null;
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setCode(area?.code ?? '');
      setName(area?.name ?? '');
      setError(null);
      setSaving(false);
    }
  }, [open, area]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !name.trim()) {
      setError('Semua field wajib diisi.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (isNew) {
        const created = await insertArea({ code, name }, nextNo);
        onSaved?.(created);
      } else if (area) {
        await updateArea(area.code, { code, name });
        onSaved?.({ ...area, code, name });
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
      title={isNew ? 'Add Area' : 'Edit Area'}
      size="md"
    >
      <form onSubmit={handleSubmit}>
        <div className="px-6 py-5 space-y-4">
          <Field label="Kode Area" value={code} onChange={setCode} placeholder="AREA-00000" />
          <Field label="Area" value={name} onChange={setName} />
          {error && (
            <p className="text-xs text-rose-600 bg-rose-50 border border-rose-100 rounded px-3 py-2">
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
            {saving ? 'Saving…' : isNew ? 'Create Area' : 'Save Changes'}
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
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1 text-xs">
      <span className="text-gray-600">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="border border-gray-200 rounded-md px-3 py-2 text-xs focus:outline-none focus:border-teal-400"
      />
    </label>
  );
}
