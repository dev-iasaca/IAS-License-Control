import Modal from './Modal';
import DetailRow from './DetailRow';
import type { Vendor } from '../lib/vendors-data';

type Props = {
  open: boolean;
  onClose: () => void;
  vendor: Vendor | null;
};

export default function VendorDetailModal({ open, onClose, vendor }: Props) {
  return (
    <Modal open={open} onClose={onClose} title="View Data Vendor" size="lg">
      <div className="px-6 py-5 max-h-[70vh] overflow-y-auto space-y-6">
        {vendor && (
          <>
            <div>
              <DetailRow label="Nama Vendor" value={vendor.name} />
              <DetailRow label="Alamat" value={vendor.address} />
              <DetailRow label="Nomor Telfon" value={vendor.phone} />
              <DetailRow label="Email" value={vendor.email} />
            </div>

            <div>
              <h4 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                Daftar Pelatihan
              </h4>
              <div className="overflow-x-auto border border-gray-100 rounded-md">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-left text-gray-600 bg-gray-50 border-b border-gray-100">
                      <th className="font-semibold py-2.5 px-3 w-10">#</th>
                      <th className="font-semibold py-2.5 px-3">Nama Pelatihan</th>
                      <th className="font-semibold py-2.5 px-3">Jenis Pelatihan</th>
                      <th className="font-semibold py-2.5 px-3">Tempat Pelatihan</th>
                      <th className="font-semibold py-2.5 px-3 whitespace-nowrap">Perkiraan Biaya</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendor.trainings.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-4 px-3 text-center text-gray-400">
                          Belum ada data pelatihan.
                        </td>
                      </tr>
                    ) : (
                      vendor.trainings.map((t, i) => (
                        <tr key={i} className="border-b border-gray-50 last:border-b-0">
                          <td className="py-2.5 px-3 text-gray-500">{i + 1}</td>
                          <td className="py-2.5 px-3 text-gray-800">{t.name}</td>
                          <td className="py-2.5 px-3 text-gray-600">{t.type}</td>
                          <td className="py-2.5 px-3 text-gray-600">{t.location}</td>
                          <td className="py-2.5 px-3 text-teal-600 whitespace-nowrap">{t.estimatedCost}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
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
