import { CheckCircle2, CircleDashed, Layers, ListTodo, TriangleAlert } from 'lucide-react';
import { useDashboardStats } from '../hooks/useTasks';
import { StatItem } from '../components/dashboard/StatItem';
import { CompletionChart } from '../components/dashboard/CompletionChart';
import { TaskListWidget } from '../components/dashboard/TaskListWidget';
import { StatCardSkeleton } from '../components/ui/Skeleton';
import { useAuth } from '../contexts/AuthContext';

export function DashboardPage() {
  const { data: stats, isLoading } = useDashboardStats();
  const { user } = useAuth();

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-[20px] font-bold tracking-tight">Good to see you, {user?.name}</h1>
        <p className="mt-1 text-[13px] text-ink-soft">Here's where things stand across your tasks.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {isLoading || !stats ? (
          Array.from({ length: 5 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatItem label="Total" value={stats.total} icon={Layers} />
            <StatItem label="Pending" value={stats.pending} icon={CircleDashed} accentClass="text-status-pending" />
            <StatItem label="In progress" value={stats.inProgress} icon={ListTodo} accentClass="text-accent" />
            <StatItem label="Completed" value={stats.completed} icon={CheckCircle2} accentClass="text-status-done" />
            <StatItem label="Overdue" value={stats.overdue} icon={TriangleAlert} accentClass="text-priority-high" />
          </>
        )}
      </div>

      {stats && (
        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <CompletionChart stats={stats} />
          </div>
          <div className="lg:col-span-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TaskListWidget
              title="Recent tasks"
              tasks={stats.recent}
              emptyMessage="Tasks you create will show up here."
            />
            <TaskListWidget
              title="Upcoming deadlines"
              tasks={stats.upcoming}
              emptyMessage="No upcoming due dates — you're clear for now."
              showDueDate
            />
          </div>
        </div>
      )}
    </div>
  );
}
