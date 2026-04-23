import Modal from './Modal';
import type { JobFamily } from '../lib/job-families-data';

type Props = {
  open: boolean;
  onClose: () => void;
  jobFamily: JobFamily | null;
};

export default function JobFamilyEditModal({ open, onClose, jobFamily }: Props) {
  const isNew = jobFamily === null;
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isNew ? 'Add Job Family' : 'Edit Job Family'}
      size="md"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onClose();
        }}
      >
        <div className="px-6 py-5 space-y-4">
          <Field label="Code Job Family" defaultValue={jobFamily?.code} placeholder="JFM-00000" />
          <Field label="Name Job Family" defaultValue={jobFamily?.name} />
          <Field label="Name Job Family Align" defaultValue={jobFamily?.nameAlign} />
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
            {isNew ? 'Create Job Family' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function Field({
  label,
  defaultValue,
  placeholder,
}: {
  label: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1 text-xs">
      <span className="text-gray-600">{label}</span>
      <input
        type="text"
        defaultValue={defaultValue ?? ''}
        placeholder={placeholder}
        className="border border-gray-200 rounded-md px-3 py-2 text-xs focus:outline-none focus:border-teal-400"
      />
    </label>
  );
}
