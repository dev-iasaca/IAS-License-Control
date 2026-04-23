type Props = { label: string; value?: string | null };

export default function DetailRow({ label, value }: Props) {
  return (
    <div className="grid grid-cols-[170px_12px_1fr] gap-2 py-2.5 border-b border-gray-50 text-sm last:border-b-0">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-400">:</span>
      <span className="text-gray-800 break-words">
        {value && value !== '' ? value : '-'}
      </span>
    </div>
  );
}
