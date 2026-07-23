import clsx from 'clsx';

export function Skeleton({ className }: { className?: string }) {
  return <div className={clsx('animate-pulse rounded-md bg-black/[0.06]', className)} />;
}

export function TaskRowSkeleton() {
  return (
    <div className="flex items-center gap-4 border-b border-border px-5 py-3.5">
      <Skeleton className="h-4 w-4 rounded" />
      <Skeleton className="h-4 flex-1 max-w-xs" />
      <Skeleton className="h-5 w-20 rounded-md" />
      <Skeleton className="h-5 w-16 rounded-md" />
      <Skeleton className="h-4 w-20" />
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="mt-3 h-7 w-12" />
    </div>
  );
}
