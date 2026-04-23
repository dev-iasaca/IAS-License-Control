type Props = {
  title: string;
  breadcrumb: string[];
  actions?: React.ReactNode;
};

export default function PageHeader({ title, breadcrumb, actions }: Props) {
  return (
    <div className="bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-screen-2xl mx-auto flex items-center justify-between px-6 py-4 flex-wrap gap-3">
        <div className="flex items-center gap-5 flex-wrap">
          <h2 className="text-base font-semibold text-gray-800">{title}</h2>
          <nav className="flex items-center text-xs text-gray-400">
            {breadcrumb.map((crumb, i) => (
              <span key={i} className="flex items-center">
                {i > 0 && <span className="mx-2 text-gray-300">•</span>}
                <span className={i === breadcrumb.length - 1 ? 'text-gray-500' : ''}>
                  {crumb}
                </span>
              </span>
            ))}
          </nav>
        </div>
        {actions && (
          <div className="flex items-center gap-2 flex-wrap">{actions}</div>
        )}
      </div>
    </div>
  );
}
