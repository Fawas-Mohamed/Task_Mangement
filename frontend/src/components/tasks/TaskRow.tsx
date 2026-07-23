import { motion } from 'framer-motion';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Task } from '../../types';
import { PriorityBadge, StatusBadge } from '../ui/Badges';
import { formatDateShort, isOverdue } from '../../utils/format';
import clsx from 'clsx';

interface TaskRowProps {
  task: Task;
  onView: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const priorityRail: Record<Task['priority'], string> = {
  HIGH: 'bg-priority-high',
  MEDIUM: 'bg-priority-medium',
  LOW: 'bg-priority-low',
};

export function TaskRow({ task, onView, onEdit, onDelete }: TaskRowProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="group relative flex items-center gap-4 border-b border-border px-5 py-3 last:border-b-0 hover:bg-black/[0.015]"
    >
      <span className={clsx('h-6 w-1 shrink-0 rounded-full', priorityRail[task.priority])} />

      <button onClick={() => onView(task)} className="min-w-0 flex-1 text-left">
        <p className="truncate text-[13px] font-medium text-ink">{task.title}</p>
        {task.description && <p className="mt-0.5 truncate text-[12px] text-ink-faint">{task.description}</p>}
      </button>

      <div className="hidden shrink-0 items-center gap-2 sm:flex">
        <StatusBadge status={task.status} overdue={overdue} />
        <PriorityBadge priority={task.priority} />
      </div>

      <span className="hidden w-20 shrink-0 font-mono text-[12px] text-ink-faint md:block">
        {formatDateShort(task.dueDate)}
      </span>

      <div className="relative shrink-0">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Task actions"
          className="rounded-md p-1.5 text-ink-faint opacity-0 transition-opacity hover:bg-black/[0.05] hover:text-ink group-hover:opacity-100"
        >
          <MoreHorizontal size={16} />
        </button>

        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 top-8 z-20 w-36 rounded-md border border-border bg-surface py-1 shadow-popover">
              <button
                onClick={() => {
                  onEdit(task);
                  setMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-[12.5px] text-ink hover:bg-black/[0.03]"
              >
                <Pencil size={13} /> Edit
              </button>
              <button
                onClick={() => {
                  onDelete(task);
                  setMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-[12.5px] text-priority-high hover:bg-priority-highSoft"
              >
                <Trash2 size={13} /> Delete
              </button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
