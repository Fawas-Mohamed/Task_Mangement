import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Pagination } from '../../types';
import { Button } from '../ui/Button';

interface PaginationBarProps {
  pagination: Pagination;
  onPageChange: (page: number) => void;
}

export function PaginationBar({ pagination, onPageChange }: PaginationBarProps) {
  const { page, totalPages, total } = pagination;

  return (
    <div className="flex items-center justify-between border-t border-border px-5 py-3">
      <p className="text-[12px] text-ink-faint">
        {total} {total === 1 ? 'task' : 'tasks'} total
      </p>
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          <ChevronLeft size={14} />
        </Button>
        <span className="font-mono text-[12px] text-ink-soft">
          {page} / {totalPages}
        </span>
        <Button variant="secondary" size="sm" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
          <ChevronRight size={14} />
        </Button>
      </div>
    </div>
  );
}
