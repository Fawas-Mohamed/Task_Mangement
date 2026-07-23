import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft text-accent">
        <Icon size={20} strokeWidth={1.75} />
      </div>
      <div className="space-y-1">
        <p className="text-[14px] font-medium text-ink">{title}</p>
        <p className="max-w-sm text-[13px] text-ink-soft">{description}</p>
      </div>
      {action}
    </div>
  );
}
