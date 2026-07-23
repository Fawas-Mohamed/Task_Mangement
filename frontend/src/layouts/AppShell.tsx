import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';

export function AppShell() {
  return (
    <div className="flex h-screen bg-canvas">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
