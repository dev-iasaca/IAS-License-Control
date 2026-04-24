import Modal from './Modal';
import DetailRow from './DetailRow';
import type { License } from '../lib/licenses-data';

type Props = {
  open: boolean;
  onClose: () => void;
  license: License | null;
};

export default function LicenseDetailModal({ open, onClose, license }: Props) {
  return (
    <Modal open={open} onClose={onClose} title="View Data License" size="lg">
      <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
        {license && (
          <>
            <DetailRow label="NIK" value={license.nik} />
            <DetailRow label="Employee Name" value={license.name} />
            <DetailRow label="Organization" value={license.organization} />
            <DetailRow label="Nomor License" value={license.licenseNumber} />
            <DetailRow label="License Name" value={license.licenseName} />
            <DetailRow label="Instansi" value={license.instansi} />
            <DetailRow label="Job Family" value={license.jobFamily} />
            <DetailRow label="Start Date" value={license.startDate} />
            <DetailRow label="End Date" value={license.endDate} />
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
