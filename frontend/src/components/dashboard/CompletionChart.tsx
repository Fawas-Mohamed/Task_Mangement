import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { DashboardStats } from '../../types';

interface CompletionChartProps {
  stats: DashboardStats;
}

export function CompletionChart({ stats }: CompletionChartProps) {
  const data = [
    { name: 'Completed', value: stats.completed, color: '#4A7C59' },
    { name: 'In progress', value: stats.inProgress, color: '#3D5A80' },
    { name: 'Pending', value: stats.pending, color: '#D6D3CB' },
  ];

  const completionRate = stats.total === 0 ? 0 : Math.round((stats.completed / stats.total) * 100);

  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <h3 className="text-[13px] font-semibold text-ink">Completion overview</h3>
      <div className="relative mt-2 flex items-center justify-center">
        <ResponsiveContainer width="100%" height={160}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={52}
              outerRadius={72}
              paddingAngle={data.some((d) => d.value > 0) ? 3 : 0}
              startAngle={90}
              endAngle={-270}
              stroke="none"
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={stats.total === 0 ? '#F0EFEC' : entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute flex flex-col items-center">
          <span className="font-mono text-[22px] font-semibold text-ink">{completionRate}%</span>
          <span className="text-[11px] text-ink-faint">done</span>
        </div>
      </div>
      <div className="mt-3 flex flex-col gap-1.5">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center justify-between text-[12px]">
            <span className="flex items-center gap-1.5 text-ink-soft">
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
              {entry.name}
            </span>
            <span className="font-mono text-ink">{entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
