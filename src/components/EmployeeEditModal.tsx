import Modal from './Modal';
import type { Employee } from '../lib/employees-data';

type Props = {
  open: boolean;
  onClose: () => void;
  employee: Employee | null;
};

export default function EmployeeEditModal({ open, onClose, employee }: Props) {
  const isNew = employee === null;
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isNew ? 'Add Employee' : 'Edit Employee'}
      size="lg"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onClose();
        }}
      >
        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="NIK" defaultValue={employee?.id} />
          <Field label="Employee Name" defaultValue={employee?.name} />
          <Field label="Organization" defaultValue={employee?.organization} />
          <Field label="Position" defaultValue={employee?.position} />
          <Field label="Job Title" defaultValue={employee?.jobTitle} />
          <Field label="Directorate" defaultValue={employee?.directorate} />
          <Field label="Group" defaultValue={employee?.group} />
          <Field label="Division" defaultValue={employee?.division} />
          <Field label="Area" defaultValue={employee?.area} />
          <Field label="Grade Align" defaultValue={employee?.grade} />
          <Select
            label="Employee Type"
            defaultValue={employee?.type}
            options={['Tetap', 'Kontrak', 'Magang']}
          />
          <Select
            label="Talent Cluster"
            defaultValue={employee?.talentCluster}
            options={[
              'Unfit (Talent Cluster 1)',
              'Emerging (Talent Cluster 2)',
              'Solid (Talent Cluster 3)',
              'Top Talent (Talent Cluster 4)',
            ]}
          />
          <Select
            label="Gender"
            defaultValue={employee?.gender}
            options={['Laki-laki', 'Perempuan']}
          />
          <Field label="Email" type="email" defaultValue={employee?.email} />
          <Field label="Phone Number" defaultValue={employee?.phoneNumber} />
          <Field label="Line Manager" defaultValue={employee?.lineManager} />
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
            {isNew ? 'Create Employee' : 'Save Changes'}
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
