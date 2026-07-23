import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import clsx from 'clsx';

interface FieldWrapperProps {
  label?: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  htmlFor?: string;
}

export function FieldWrapper({ label, error, hint, children, htmlFor }: FieldWrapperProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={htmlFor} className="text-[13px] font-medium text-ink">
          {label}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-[12px] text-priority-high">{error}</p>
      ) : hint ? (
        <p className="text-[12px] text-ink-faint">{hint}</p>
      ) : null}
    </div>
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & { error?: string };

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, error, ...props }, ref) => (
  <input
    ref={ref}
    className={clsx(
      'h-9 rounded-md border bg-surface px-3 text-[13px] text-ink placeholder:text-ink-faint transition-colors focus:border-accent',
      error ? 'border-priority-high' : 'border-border',
      className
    )}
    {...props}
  />
));
Input.displayName = 'Input';

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string };

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, error, ...props }, ref) => (
  <textarea
    ref={ref}
    className={clsx(
      'rounded-md border bg-surface px-3 py-2 text-[13px] text-ink placeholder:text-ink-faint transition-colors focus:border-accent resize-none',
      error ? 'border-priority-high' : 'border-border',
      className
    )}
    {...props}
  />
));
Textarea.displayName = 'Textarea';
