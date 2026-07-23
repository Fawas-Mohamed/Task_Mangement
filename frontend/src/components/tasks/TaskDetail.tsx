import { Task } from '../../types';
import { PriorityBadge, StatusBadge } from '../ui/Badges';
import { formatDate, isOverdue } from '../../utils/format';
import { Button } from '../ui/Button';
import { Pencil, Trash2 } from 'lucide-react';

interface TaskDetailProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
}

export function TaskDetail({ task, onEdit, onDelete }: TaskDetailProps) {
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge status={task.status} overdue={overdue} />
        <PriorityBadge priority={task.priority} />
      </div>

      <p className="text-[13px] leading-relaxed text-ink-soft">
        {task.description || 'No description provided.'}
      </p>

      <dl className="grid grid-cols-2 gap-4 rounded-md border border-border bg-canvas p-3.5">
        <div>
          <dt className="text-[11px] uppercase tracking-wide text-ink-faint">Due date</dt>
          <dd className="mt-0.5 font-mono text-[12.5px] text-ink">{formatDate(task.dueDate)}</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-wide text-ink-faint">Created</dt>
          <dd className="mt-0.5 font-mono text-[12.5px] text-ink">{formatDate(task.createdAt)}</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-wide text-ink-faint">Last updated</dt>
          <dd className="mt-0.5 font-mono text-[12.5px] text-ink">{formatDate(task.updatedAt)}</dd>
        </div>
      </dl>

      <div className="mt-1 flex justify-end gap-2">
        <Button variant="secondary" onClick={onDelete}>
          <Trash2 size={14} /> Delete
        </Button>
        <Button onClick={onEdit}>
          <Pencil size={14} /> Edit task
        </Button>
      </div>
    </div>
  );
}
