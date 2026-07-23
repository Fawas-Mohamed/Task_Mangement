import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Plus, ListChecks } from 'lucide-react';
import { useCreateTask, useDeleteTask, useTask, useTasks, useUpdateTask } from '../hooks/useTasks';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { Task, TaskPriority, TaskStatus } from '../types';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { TaskFilters } from '../components/tasks/TaskFilters';
import { TaskRow } from '../components/tasks/TaskRow';
import { TaskForm } from '../components/tasks/TaskForm';
import { TaskDetail } from '../components/tasks/TaskDetail';
import { PaginationBar } from '../components/tasks/PaginationBar';
import { TaskRowSkeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { TaskFormSchema } from '../utils/schemas/taskSchema';

type ModalMode = 'none' | 'create' | 'edit' | 'view' | 'delete';

export function TasksPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState('');
  const [statusFilters, setStatusFilters] = useState<TaskStatus[]>([]);
  const [priorityFilters, setPriorityFilters] = useState<TaskPriority[]>([]);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'dueDate'>('newest');
  const [page, setPage] = useState(1);
  const [modalMode, setModalMode] = useState<ModalMode>('none');
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const debouncedSearch = useDebouncedValue(search, 300);

  const { data, isLoading, isFetching } = useTasks({
    page,
    limit: 8,
    search: debouncedSearch || undefined,
    status: statusFilters.length ? statusFilters : undefined,
    priority: priorityFilters.length ? priorityFilters : undefined,
    sortBy,
  });

  const openFromQuery = searchParams.get('open');
  const { data: linkedTask } = useTask(openFromQuery ?? undefined);

  useEffect(() => {
    if (linkedTask) {
      setActiveTask(linkedTask);
      setModalMode('view');
      searchParams.delete('open');
      setSearchParams(searchParams, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linkedTask]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilters, priorityFilters, sortBy]);

  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  function toggleStatus(status: TaskStatus) {
    setStatusFilters((prev) => (prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]));
  }

  function togglePriority(priority: TaskPriority) {
    setPriorityFilters((prev) => (prev.includes(priority) ? prev.filter((p) => p !== priority) : [...prev, priority]));
  }

  function clearFilters() {
    setSearch('');
    setStatusFilters([]);
    setPriorityFilters([]);
  }

  function closeModal() {
    setModalMode('none');
    setActiveTask(null);
  }

  async function handleFormSubmit(values: TaskFormSchema) {
    const payload = {
      title: values.title,
      description: values.description || undefined,
      status: values.status,
      priority: values.priority,
      dueDate: values.dueDate || undefined,
    };

    if (modalMode === 'edit' && activeTask) {
      await updateTask.mutateAsync({ id: activeTask.id, values: payload });
    } else {
      await createTask.mutateAsync(payload);
    }
    closeModal();
  }

  async function handleConfirmDelete() {
    if (!activeTask) return;
    await deleteTask.mutateAsync(activeTask.id);
    closeModal();
  }

  const tasks = data?.data ?? [];

  return (
    <div className="animate-fade-in">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold tracking-tight">Tasks</h1>
          <p className="mt-1 text-[13px] text-ink-soft">Everything you're working on, in one place.</p>
        </div>
        <Button onClick={() => setModalMode('create')}>
          <Plus size={15} /> New task
        </Button>
      </div>

      <div className="mb-4">
        <TaskFilters
          search={search}
          onSearchChange={setSearch}
          statusFilters={statusFilters}
          onToggleStatus={toggleStatus}
          priorityFilters={priorityFilters}
          onTogglePriority={togglePriority}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onClearFilters={clearFilters}
        />
      </div>

      <div className="rounded-lg border border-border bg-surface">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => <TaskRowSkeleton key={i} />)
        ) : tasks.length === 0 ? (
          <EmptyState
            icon={ListChecks}
            title="No tasks match these filters"
            description="Try adjusting your search or filters, or create a new task to get started."
            action={
              <Button size="sm" variant="secondary" onClick={clearFilters}>
                Clear filters
              </Button>
            }
          />
        ) : (
          <div className={isFetching ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
            <AnimatePresence initial={false}>
              {tasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onView={(t) => {
                    setActiveTask(t);
                    setModalMode('view');
                  }}
                  onEdit={(t) => {
                    setActiveTask(t);
                    setModalMode('edit');
                  }}
                  onDelete={(t) => {
                    setActiveTask(t);
                    setModalMode('delete');
                  }}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {data && data.pagination.total > 0 && <PaginationBar pagination={data.pagination} onPageChange={setPage} />}
      </div>

      <Modal
        isOpen={modalMode === 'create' || modalMode === 'edit'}
        onClose={closeModal}
        title={modalMode === 'edit' ? 'Edit task' : 'New task'}
      >
        <TaskForm
          initialTask={modalMode === 'edit' ? activeTask ?? undefined : undefined}
          onSubmit={handleFormSubmit}
          onCancel={closeModal}
          isSubmitting={createTask.isPending || updateTask.isPending}
        />
      </Modal>

      <Modal isOpen={modalMode === 'view'} onClose={closeModal} title={activeTask?.title ?? 'Task'}>
        {activeTask && (
          <TaskDetail
            task={activeTask}
            onEdit={() => setModalMode('edit')}
            onDelete={() => setModalMode('delete')}
          />
        )}
      </Modal>

      <ConfirmDialog
        isOpen={modalMode === 'delete'}
        onClose={closeModal}
        onConfirm={handleConfirmDelete}
        title="Delete this task?"
        description={`"${activeTask?.title}" will be permanently removed. This can't be undone.`}
        isLoading={deleteTask.isPending}
      />
    </div>
  );
}
