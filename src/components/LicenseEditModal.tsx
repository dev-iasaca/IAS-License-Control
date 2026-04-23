import Modal from './Modal';
import type { License } from '../lib/licenses-data';

type Props = {
  open: boolean;
  onClose: () => void;
  license: License | null;
};

export default function LicenseEditModal({ open, onClose, license }: Props) {
  const isNew = license === null;
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isNew ? 'Add License' : 'Edit License'}
      size="lg"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onClose();
        }}
      >
        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="NIK" defaultValue={license?.nik} />
          <Field label="Employee Name" defaultValue={license?.name} />
          <Field label="Organization" defaultValue={license?.organization} />
          <Field label="License Name" defaultValue={license?.licenseName} />
          <Field label="Instansi" defaultValue={license?.instansi} />
          <Field label="Negara" defaultValue={license?.negara} />
          <Field label="Job Family" defaultValue={license?.jobFamily} />
          <Field label="Start Date" defaultValue={license?.startDate} />
          <Field label="End Date" defaultValue={license?.endDate} />
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
            {isNew ? 'Create License' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function Field({ label, defaultValue }: { label: string; defaultValue?: string }) {
  return (
    <label className="flex flex-col gap-1 text-xs">
      <span className="text-gray-600">{label}</span>
      <input
        type="text"
        defaultValue={defaultValue ?? ''}
        className="border border-gray-200 rounded-md px-3 py-2 text-xs focus:outline-none focus:border-teal-400"
      />
    </label>
  );
}
