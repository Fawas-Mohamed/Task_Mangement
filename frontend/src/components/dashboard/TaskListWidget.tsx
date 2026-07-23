import { Link } from 'react-router-dom';
import { Task } from '../../types';
import { formatDateShort } from '../../utils/format';
import { PriorityBadge } from '../ui/Badges';
import { EmptyState } from '../ui/EmptyState';
import { Inbox } from 'lucide-react';

interface TaskListWidgetProps {
  title: string;
  tasks: Task[];
  emptyMessage: string;
  showDueDate?: boolean;
}

export function TaskListWidget({ title, tasks, emptyMessage, showDueDate }: TaskListWidgetProps) {
  return (
    <div className="rounded-lg border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <h3 className="text-[13px] font-semibold text-ink">{title}</h3>
        <Link to="/tasks" className="text-[12px] font-medium text-accent hover:underline">
          View all
        </Link>
      </div>

      {tasks.length === 0 ? (
        <EmptyState icon={Inbox} title="Nothing here yet" description={emptyMessage} />
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id} className="border-b border-border px-5 py-3 last:border-b-0">
              <Link to={`/tasks?open=${task.id}`} className="flex items-center justify-between gap-3">
                <span className="truncate text-[13px] text-ink">{task.title}</span>
                <span className="flex shrink-0 items-center gap-2">
                  {showDueDate && (
                    <span className="font-mono text-[11.5px] text-ink-faint">{formatDateShort(task.dueDate)}</span>
                  )}
                  <PriorityBadge priority={task.priority} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
