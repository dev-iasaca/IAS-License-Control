import Modal from './Modal';
import type { Account } from '../lib/accounts-data';

type Props = {
  open: boolean;
  onClose: () => void;
  account: Account | null;
};

export default function AccountEditModal({ open, onClose, account }: Props) {
  const isNew = account === null;
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isNew ? 'Add Account' : 'Edit Account'}
      size="md"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onClose();
        }}
      >
        <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Username" defaultValue={account?.username} />
          <Field label="NIK" defaultValue={account?.nik} />
          <Field label="Full Name" defaultValue={account?.name} />
          <Field label="Email" type="email" defaultValue={account?.email} />
          <Select
            label="Role"
            defaultValue={account?.role}
            options={['Administrator', 'Manager', 'Supervisor', 'HC Officer', 'Viewer']}
          />
          <Field label="Organization" defaultValue={account?.org} />
          <Select
            label="Status"
            defaultValue={account?.status}
            options={['Active', 'Inactive', 'Suspended']}
          />
        </div>
        <div className="flex justify-end gap-2 px-6 py-3 border-t border-gray-100 bg-gray-50 rounded-b-lg">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-xs font-medium text-white bg-teal-500 rounded-md hover:bg-teal-600"
          >
            {isNew ? 'Create Account' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function Field({
  label,
  defaultValue,
  type = 'text',
}: {
  label: string;
  defaultValue?: string;
  type?: string;
}) {
  return (
    <label className="flex flex-col gap-1 text-xs">
      <span className="text-gray-600">{label}</span>
      <input
        type={type}
        defaultValue={defaultValue ?? ''}
        className="border border-gray-200 rounded-md px-3 py-2 text-xs focus:outline-none focus:border-teal-400"
      />
    </label>
  );
}

function Select({
  label,
  defaultValue,
  options,
}: {
  label: string;
  defaultValue?: string;
  options: string[];
}) {
  return (
    <label className="flex flex-col gap-1 text-xs">
      <span className="text-gray-600">{label}</span>
      <select
        defaultValue={defaultValue ?? ''}
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
