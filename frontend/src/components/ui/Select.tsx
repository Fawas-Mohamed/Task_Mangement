import { forwardRef, SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & { error?: string };

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({ className, error, children, ...props }, ref) => (
  <div className="relative">
    <select
      ref={ref}
      className={clsx(
        'h-9 w-full appearance-none rounded-md border bg-surface pl-3 pr-8 text-[13px] text-ink transition-colors focus:border-accent',
        error ? 'border-priority-high' : 'border-border',
        className
      )}
      {...props}
    >
      {children}
    </select>
    <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-faint" />
  </div>
));
Select.displayName = 'Select';
