import clsx from 'clsx';
import { TaskPriority, TaskStatus } from '../../types';
import { PRIORITY_LABELS, STATUS_LABELS } from '../../utils/format';

const priorityStyles: Record<TaskPriority, string> = {
  HIGH: 'text-priority-high bg-priority-highSoft',
  MEDIUM: 'text-priority-medium bg-priority-mediumSoft',
  LOW: 'text-priority-low bg-priority-lowSoft',
};

const priorityDot: Record<TaskPriority, string> = {
  HIGH: 'bg-priority-high',
  MEDIUM: 'bg-priority-medium',
  LOW: 'bg-priority-low',
};

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-medium',
        priorityStyles[priority]
      )}
    >
      <span className={clsx('h-1.5 w-1.5 rounded-full', priorityDot[priority])} />
      {PRIORITY_LABELS[priority]}
    </span>
  );
}

const statusStyles: Record<TaskStatus, string> = {
  PENDING: 'text-status-pending bg-status-pendingSoft',
  IN_PROGRESS: 'text-status-progress bg-status-progressSoft',
  COMPLETED: 'text-status-done bg-status-doneSoft',
};

export function StatusBadge({ status, overdue }: { status: TaskStatus; overdue?: boolean }) {
  if (overdue) {
    return (
      <span className="inline-flex items-center rounded-md bg-status-overdueSoft px-2 py-0.5 text-[11px] font-medium text-status-overdue">
        Overdue
      </span>
    );
  }

  return (
    <span className={clsx('inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium', statusStyles[status])}>
      {STATUS_LABELS[status]}
    </span>
  );
}
