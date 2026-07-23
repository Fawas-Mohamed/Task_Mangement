import { LucideIcon } from 'lucide-react';
import clsx from 'clsx';

interface StatItemProps {
  label: string;
  value: number;
  icon: LucideIcon;
  accentClass?: string;
}

export function StatItem({ label, value, icon: Icon, accentClass = 'text-ink' }: StatItemProps) {
  return (
    <div className="flex-1 rounded-lg border border-border bg-surface px-4 py-3.5">
      <div className="flex items-center gap-1.5 text-[12px] font-medium text-ink-soft">
        <Icon size={13} strokeWidth={1.75} className={accentClass} />
        {label}
      </div>
      <p className={clsx('mt-2 font-mono text-[22px] font-medium leading-none', accentClass)}>{value}</p>
    </div>
  );
}
