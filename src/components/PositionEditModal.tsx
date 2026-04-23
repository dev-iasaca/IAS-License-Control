import { useEffect, useState } from 'react';
import Modal from './Modal';
import { insertPosition, updatePosition, type Position } from '../lib/positions-data';

type Props = {
  open: boolean;
  onClose: () => void;
  position: Position | null;
  onSaved?: (item: Position) => void;
  nextNo?: number;
};

export default function PositionEditModal({ open, onClose, position, onSaved, nextNo = 1 }: Props) {
  const isNew = position === null;
  const [code, setCode] = useState('');
  const [group, setGroup] = useState('');
  const [positionTitle, setPositionTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setCode(position?.code ?? '');
      setGroup(position?.group ?? '');
      setPositionTitle(position?.position ?? '');
      setError(null);
      setSaving(false);
    }
  }, [open, position]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !group.trim() || !positionTitle.trim()) {
      setError('Semua field wajib diisi.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (isNew) {
        const created = await insertPosition({ code, group, position: positionTitle }, nextNo);
        onSaved?.(created);
      } else if (position) {
        await updatePosition(position.code, { code, group, position: positionTitle });
        onSaved?.({ ...position, code, group, position: positionTitle });
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
      title={isNew ? 'Add Jabatan' : 'Edit Jabatan'}
      size="md"
    >
      <form onSubmit={handleSubmit}>
        <div className="px-6 py-5 space-y-4">
          <Field label="Kode Jabatan" value={code} onChange={setCode} placeholder="JBT-00000" />
          <Field label="Group" value={group} onChange={setGroup} />
          <Field label="Position" value={positionTitle} onChange={setPositionTitle} />
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
            {saving ? 'Saving…' : isNew ? 'Create Jabatan' : 'Save Changes'}
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
