import { NavLink } from 'react-router-dom';
import { LayoutGrid, ListChecks, LogOut } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../../contexts/AuthContext';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutGrid, end: true },
  { to: '/tasks', label: 'Tasks', icon: ListChecks, end: false },
];

export function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="flex h-screen w-56 shrink-0 flex-col border-r border-border bg-surface">
      <div className="flex h-14 items-center gap-2 px-5">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-ink text-[11px] font-bold text-white">
          T
        </div>
        <span className="font-display text-[15px] font-bold tracking-tight text-ink">TaskFlow</span>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 px-3 pt-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium transition-colors',
                isActive ? 'bg-accent-soft text-accent' : 'text-ink-soft hover:bg-black/[0.03] hover:text-ink'
              )
            }
          >
            <item.icon size={16} strokeWidth={1.75} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-border px-3 py-3">
        <div className="flex items-center gap-2.5 rounded-md px-2 py-1.5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-[12px] font-semibold text-white">
            {user?.name?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12.5px] font-medium text-ink">{user?.name}</p>
            <p className="truncate text-[11.5px] text-ink-faint">{user?.email}</p>
          </div>
          <button
            onClick={() => logout()}
            aria-label="Log out"
            className="rounded-md p-1.5 text-ink-faint transition-colors hover:bg-black/[0.05] hover:text-ink"
          >
            <LogOut size={15} strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </aside>
  );
}
