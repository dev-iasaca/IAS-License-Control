import { ArrowLeft, KeyRound, ShieldCheck, UserCog, type LucideIcon } from 'lucide-react';

type Props = { onSelect: () => void; onBack: () => void };

export default function RoleSelectPage({ onSelect, onBack }: Props) {
  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      <div
        aria-hidden
        className="absolute -top-40 -right-40 w-[28rem] h-[28rem] border-[32px] border-gray-100 rounded-full"
      />
      <div
        aria-hidden
        className="absolute -bottom-48 -left-48 w-[32rem] h-[32rem] border-[32px] border-gray-100 rounded-full"
      />

      <button
        type="button"
        onClick={onBack}
        className="absolute top-6 left-6 z-10 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Login
      </button>

      <div className="relative z-0 max-w-5xl mx-auto px-6 py-20">
        <div className="flex items-center justify-center gap-2 mb-12">
          <div className="w-9 h-9 rounded-md bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-sm">
            <KeyRound className="w-5 h-5 text-white" />
          </div>
          <span className="text-gray-800 font-semibold text-lg">
            IAS <span className="text-teal-500">License Control</span>
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-light text-center text-gray-700 mb-12">
          Salam IAS Bestie <span aria-hidden>👋</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RoleCard
            variant="purple"
            title="Login Sebagai HC Admin"
            icon={UserCog}
            onClick={onSelect}
          />
          <RoleCard
            variant="cyan"
            title="Login Sebagai Super Admin"
            icon={ShieldCheck}
            onClick={onSelect}
          />
        </div>
      </div>
    </div>
  );
}

function RoleCard({
  variant,
  title,
  icon: Icon,
  onClick,
}: {
  variant: 'purple' | 'cyan';
  title: string;
  icon: LucideIcon;
  onClick: () => void;
}) {
  const bg =
    variant === 'purple'
      ? 'bg-gradient-to-br from-purple-600 via-violet-600 to-purple-700'
      : 'bg-gradient-to-br from-cyan-400 via-cyan-500 to-sky-500';

  return (
    <div
      className={`group relative rounded-2xl overflow-hidden p-8 min-h-[220px] text-white shadow-lg ${bg}`}
    >
      <svg
        aria-hidden
        className="absolute inset-0 w-full h-full opacity-20"
        viewBox="0 0 400 240"
        preserveAspectRatio="none"
      >
        <path
          d="M0,180 Q80,140 160,170 T340,150 L400,170 L400,240 L0,240 Z"
          fill="rgba(255,255,255,0.15)"
        />
        <circle cx="360" cy="40" r="60" fill="rgba(255,255,255,0.08)" />
        <circle cx="320" cy="20" r="30" fill="rgba(255,255,255,0.08)" />
      </svg>

      <div className="relative z-10 max-w-[60%]">
        <h2 className="text-xl md:text-2xl font-bold mb-6 leading-snug">
          {title}
        </h2>
        <button
          type="button"
          onClick={onClick}
          className="bg-white text-gray-800 font-medium text-sm px-5 py-2 rounded-md shadow hover:shadow-md hover:-translate-y-0.5 transition"
        >
          Klik di sini
        </button>
      </div>

      <Icon
        aria-hidden
        className="absolute right-4 bottom-2 w-40 h-40 text-white/25 group-hover:scale-105 transition-transform"
      />
    </div>
  );
}
