import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Modal from './Modal';
import { insertVendor, updateVendor, type Training, type Vendor } from '../lib/vendors-data';

type Props = {
  open: boolean;
  onClose: () => void;
  vendor: Vendor | null;
  onSaved?: (item: Vendor) => void;
  nextNo?: number;
};

const EMPTY_TRAINING: Training = { name: '', type: '', location: '', estimatedCost: '' };

export default function VendorEditModal({ open, onClose, vendor, onSaved, nextNo = 1 }: Props) {
  const isNew = vendor === null;
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setName(vendor?.name ?? '');
      setAddress(vendor?.address ?? '');
      setPhone(vendor?.phone ?? '');
      setEmail(vendor?.email ?? '');
      setTrainings(vendor?.trainings ?? []);
      setError(null);
      setSaving(false);
    }
  }, [vendor, open]);

  const updateTraining = (i: number, patch: Partial<Training>) => {
    setTrainings((prev) => prev.map((t, idx) => (idx === i ? { ...t, ...patch } : t)));
  };
  const removeTraining = (i: number) => {
    setTrainings((prev) => prev.filter((_, idx) => idx !== i));
  };
  const addTraining = () => {
    setTrainings((prev) => [...prev, { ...EMPTY_TRAINING }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Nama Vendor wajib diisi.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (isNew) {
        const created = await insertVendor(
          { name, address, phone, email, trainings },
          nextNo,
        );
        onSaved?.(created);
      } else if (vendor) {
        await updateVendor(vendor.name, { name, address, phone, email, trainings });
        onSaved?.({ ...vendor, name, address, phone, email, trainings });
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
      title={isNew ? 'Add Vendor' : 'Edit Vendor'}
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto space-y-5">
          <div className="space-y-4">
            <ControlledField label="Nama Vendor" value={name} onChange={setName} />
            <ControlledField label="Alamat" value={address} onChange={setAddress} textarea />
            <ControlledField label="Nomor Telfon" value={phone} onChange={setPhone} />
            <ControlledField label="Email" type="email" value={email} onChange={setEmail} />
          </div>

          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Daftar Pelatihan
              </h4>
              <button
                type="button"
                onClick={addTraining}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-teal-600 hover:text-teal-700"
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah Pelatihan
              </button>
            </div>

            {trainings.length === 0 ? (
              <div className="text-center text-xs text-gray-400 py-6 border border-dashed border-gray-200 rounded-md">
                Belum ada pelatihan. Klik "Tambah Pelatihan" untuk menambahkan.
              </div>
            ) : (
              <div className="space-y-3">
                {trainings.map((t, i) => (
                  <TrainingRow
                    key={i}
                    index={i}
                    training={t}
                    onChange={(patch) => updateTraining(i, patch)}
                    onRemove={() => removeTraining(i)}
                  />
                ))}
              </div>
            )}
          </div>
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
            {saving ? 'Saving…' : isNew ? 'Create Vendor' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function TrainingRow({
  index,
  training,
  onChange,
  onRemove,
}: {
  index: number;
  training: Training;
  onChange: (patch: Partial<Training>) => void;
  onRemove: () => void;
}) {
  return (
    <div className="relative bg-gray-50/60 border border-gray-100 rounded-md p-3 pr-10">
      <span className="absolute top-3 right-3">
        <button
          type="button"
          onClick={onRemove}
          className="p-1 text-rose-500 hover:text-rose-600"
          aria-label="Remove training"
          title="Hapus pelatihan"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </span>
      <div className="text-[11px] font-medium text-gray-500 mb-2">
        Pelatihan #{index + 1}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <ControlledField
          label="Nama Pelatihan"
          value={training.name}
          onChange={(v) => onChange({ name: v })}
        />
        <ControlledField
          label="Jenis Pelatihan"
          value={training.type}
          onChange={(v) => onChange({ type: v })}
        />
        <ControlledField
          label="Tempat Pelatihan"
          value={training.location}
          onChange={(v) => onChange({ location: v })}
        />
        <ControlledField
          label="Perkiraan Biaya"
          value={training.estimatedCost}
          onChange={(v) => onChange({ estimatedCost: v })}
          placeholder="Rp 0"
        />
      </div>
    </div>
  );
}

function ControlledField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  textarea = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  textarea?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1 text-xs">
      <span className="text-gray-600">{label}</span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="border border-gray-200 rounded-md px-3 py-2 text-xs focus:outline-none focus:border-teal-400 resize-none"
        />
      ) : (
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="border border-gray-200 rounded-md px-3 py-2 text-xs bg-white focus:outline-none focus:border-teal-400"
        />
      )}
    </label>
  );
}
