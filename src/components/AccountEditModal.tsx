import { useEffect, useState } from 'react';
import Modal from './Modal';
import { insertAccount, updateAccount, type Account, type AccountStatus } from '../lib/accounts-data';

type Props = {
  open: boolean;
  onClose: () => void;
  account: Account | null;
  onSaved?: (item: Account) => void;
  nextNo?: number;
};

const EMPTY_FORM = {
  username: '',
  nik: '',
  name: '',
  email: '',
  role: 'Viewer',
  org: '',
  status: 'Active' as AccountStatus,
};

export default function AccountEditModal({ open, onClose, account, onSaved, nextNo = 1 }: Props) {
  const isNew = account === null;
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setForm({
        username: account?.username ?? '',
        nik: account?.nik ?? '',
        name: account?.name ?? '',
        email: account?.email ?? '',
        role: account?.role ?? 'Viewer',
        org: account?.org ?? '',
        status: account?.status ?? 'Active',
      });
      setError(null);
      setSaving(false);
    }
  }, [open, account]);

  const update = (patch: Partial<typeof form>) => setForm((prev) => ({ ...prev, ...patch }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username.trim() || !form.role.trim()) {
      setError('Username dan Role wajib diisi.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (isNew) {
        const created = await insertAccount(form, nextNo);
        onSaved?.(created);
      } else if (account) {
        await updateAccount(account.username, form);
        onSaved?.({ ...account, ...form });
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
      title={isNew ? 'Add Account' : 'Edit Account'}
      size="md"
    >
      <form onSubmit={handleSubmit}>
        <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Username" value={form.username} onChange={(v) => update({ username: v })} />
          <Field label="NIK" value={form.nik} onChange={(v) => update({ nik: v })} />
          <Field label="Full Name" value={form.name} onChange={(v) => update({ name: v })} />
          <Field label="Email" type="email" value={form.email} onChange={(v) => update({ email: v })} />
          <Select
            label="Role"
            value={form.role}
            onChange={(v) => update({ role: v })}
            options={['Administrator', 'Manager', 'Supervisor', 'HC Officer', 'Viewer']}
          />
          <Field label="Organization" value={form.org} onChange={(v) => update({ org: v })} />
          <Select
            label="Status"
            value={form.status}
            onChange={(v) => update({ status: v as AccountStatus })}
            options={['Active', 'Inactive', 'Suspended']}
          />
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
            {saving ? 'Saving…' : isNew ? 'Create Account' : 'Save Changes'}
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
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="flex flex-col gap-1 text-xs">
      <span className="text-gray-600">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-200 rounded-md px-3 py-2 text-xs bg-white focus:outline-none focus:border-teal-400"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
