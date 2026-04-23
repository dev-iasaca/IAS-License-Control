import Modal from './Modal';
import DetailRow from './DetailRow';
import type { Account } from '../lib/accounts-data';

type Props = {
  open: boolean;
  onClose: () => void;
  account: Account | null;
};

export default function AccountDetailModal({ open, onClose, account }: Props) {
  return (
    <Modal open={open} onClose={onClose} title="View Data Account" size="md">
      <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
        {account && (
          <>
            <DetailRow label="Username" value={account.username} />
            <DetailRow label="NIK" value={account.nik} />
            <DetailRow label="Full Name" value={account.name} />
            <DetailRow label="Email" value={account.email} />
            <DetailRow label="Role" value={account.role} />
            <DetailRow label="Organization" value={account.org} />
            <DetailRow label="Status" value={account.status} />
            <DetailRow label="Last Login" value={account.lastLogin} />
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
