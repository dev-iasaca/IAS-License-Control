import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Eye, MoreVertical, Pencil, Trash2, type LucideIcon } from 'lucide-react';

type Props = {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function ActionMenu({ onView, onEdit, onDelete }: Props) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, right: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleOutside = (e: MouseEvent) => {
      const t = e.target as Node;
      if (
        btnRef.current && !btnRef.current.contains(t) &&
        menuRef.current && !menuRef.current.contains(t)
      ) {
        setOpen(false);
      }
    };
    const close = () => setOpen(false);
    document.addEventListener('mousedown', handleOutside);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [open]);

  const toggle = () => {
    if (!open && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setPos({ top: r.bottom + 4, right: window.innerWidth - r.right });
    }
    setOpen((v) => !v);
  };

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={toggle}
        className="p-1.5 rounded-md bg-sky-500 hover:bg-sky-600 text-white"
        aria-label="Row actions"
      >
        <MoreVertical className="w-3.5 h-3.5" />
      </button>
      {open && (
        <div
          ref={menuRef}
          style={{ position: 'fixed', top: pos.top, right: pos.right, zIndex: 50 }}
          className="w-36 bg-white border border-gray-100 rounded-md shadow-lg overflow-hidden"
        >
          {onView && (
            <Item icon={Eye} color="text-sky-600" onClick={() => { setOpen(false); onView(); }}>
              View
            </Item>
          )}
          {onEdit && (
            <Item icon={Pencil} color="text-amber-600" onClick={() => { setOpen(false); onEdit(); }}>
              Edit
            </Item>
          )}
          {onDelete && (
            <Item icon={Trash2} color="text-rose-600" onClick={() => { setOpen(false); onDelete(); }}>
              Delete
            </Item>
          )}
        </div>
      )}
    </>
  );
}

function Item({
  icon: Icon,
  color,
  onClick,
  children,
}: {
  icon: LucideIcon;
  color: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-left text-gray-700 hover:bg-gray-50"
    >
      <Icon className={`w-3.5 h-3.5 ${color}`} />
      {children}
    </button>
  );
}
