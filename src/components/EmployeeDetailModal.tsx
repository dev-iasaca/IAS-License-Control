import Modal from './Modal';
import DetailRow from './DetailRow';
import type { Employee } from '../lib/employees-data';

type Props = {
  open: boolean;
  onClose: () => void;
  employee: Employee | null;
};

export default function EmployeeDetailModal({ open, onClose, employee }: Props) {
  return (
    <Modal open={open} onClose={onClose} title="View Data Employee" size="lg">
      <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
        {employee && (
          <>
            <DetailRow label="NIK" value={employee.id} />
            <DetailRow label="Previous NIK" value={employee.previousNik} />
            <DetailRow label="Employee Name" value={employee.name} />
            <DetailRow label="Organization" value={employee.organization} />
            <DetailRow label="Position" value={employee.position} />
            <DetailRow label="Directorate Code" value={employee.directorateCode} />
            <DetailRow label="Group" value={employee.group} />
            <DetailRow label="Group Code" value={employee.groupCode} />
            <DetailRow label="Division Code" value={employee.divisionCode} />
            <DetailRow label="Area" value={employee.area} />
            <DetailRow label="Area Nomenklatur" value={employee.areaNomenklatur} />
            <DetailRow label="Employee Type" value={employee.type} />
            <DetailRow label="Gender" value={employee.gender} />
            <DetailRow label="Morst" value={employee.morst} />
            <DetailRow label="Birthplace" value={employee.birthplace} />
            <DetailRow label="Education Level" value={employee.educationLevel} />
            <DetailRow label="University Name" value={employee.universityName} />
            <DetailRow label="ID Card Number" value={employee.idCardNumber} />
            <DetailRow label="Email" value={employee.email} />
            <DetailRow label="Phone Number" value={employee.phoneNumber} />
          </>
        )}
      </div>
      <div className="flex justify-end px-6 py-3 border-t border-gray-100 bg-gray-50 rounded-b-lg">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}
