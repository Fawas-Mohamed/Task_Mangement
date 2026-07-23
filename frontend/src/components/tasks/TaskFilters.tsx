import { Search, X } from 'lucide-react';
import clsx from 'clsx';
import { TaskPriority, TaskStatus } from '../../types';
import { PRIORITY_LABELS, STATUS_LABELS } from '../../utils/format';
import { Select } from '../ui/Select';

interface TaskFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilters: TaskStatus[];
  onToggleStatus: (status: TaskStatus) => void;
  priorityFilters: TaskPriority[];
  onTogglePriority: (priority: TaskPriority) => void;
  sortBy: 'newest' | 'oldest' | 'dueDate';
  onSortChange: (value: 'newest' | 'oldest' | 'dueDate') => void;
  onClearFilters: () => void;
}

const STATUS_OPTIONS: TaskStatus[] = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];
const PRIORITY_OPTIONS: TaskPriority[] = ['LOW', 'MEDIUM', 'HIGH'];

export function TaskFilters({
  search,
  onSearchChange,
  statusFilters,
  onToggleStatus,
  priorityFilters,
  onTogglePriority,
  sortBy,
  onSortChange,
  onClearFilters,
}: TaskFiltersProps) {
  const hasActiveFilters = statusFilters.length > 0 || priorityFilters.length > 0 || search.length > 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[220px] flex-1">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks by title…"
            className="h-9 w-full rounded-md border border-border bg-surface pl-8 pr-3 text-[13px] text-ink placeholder:text-ink-faint focus:border-accent"
          />
        </div>

        <Select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as 'newest' | 'oldest' | 'dueDate')}
          className="w-36"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="dueDate">Due date</option>
        </Select>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11.5px] font-medium uppercase tracking-wide text-ink-faint">Status</span>
        {STATUS_OPTIONS.map((status) => (
          <button
            key={status}
            onClick={() => onToggleStatus(status)}
            className={clsx(
              'rounded-md border px-2.5 py-1 text-[12px] font-medium transition-colors',
              statusFilters.includes(status)
                ? 'border-accent bg-accent-soft text-accent'
                : 'border-border text-ink-soft hover:border-border-strong'
            )}
          >
            {STATUS_LABELS[status]}
          </button>
        ))}

        <span className="ml-2 text-[11.5px] font-medium uppercase tracking-wide text-ink-faint">Priority</span>
        {PRIORITY_OPTIONS.map((priority) => (
          <button
            key={priority}
            onClick={() => onTogglePriority(priority)}
            className={clsx(
              'rounded-md border px-2.5 py-1 text-[12px] font-medium transition-colors',
              priorityFilters.includes(priority)
                ? 'border-accent bg-accent-soft text-accent'
                : 'border-border text-ink-soft hover:border-border-strong'
            )}
          >
            {PRIORITY_LABELS[priority]}
          </button>
        ))}

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="ml-1 flex items-center gap-1 text-[12px] font-medium text-ink-faint hover:text-ink"
          >
            <X size={12} /> Clear
          </button>
        )}
      </div>
    </div>
  );
}
