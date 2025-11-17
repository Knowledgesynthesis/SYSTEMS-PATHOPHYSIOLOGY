import { Outlet, Link, useLocation } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import {
  Activity,
  GitBranch,
  Clock,
  Grid3x3,
  Heart,
  FileText,
  BookOpen,
  Menu,
  X
} from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Home', path: '/', icon: Activity },
  { name: 'Organ Propagation', path: '/propagation', icon: GitBranch },
  { name: 'Timeline Simulator', path: '/timeline', icon: Clock },
  { name: 'Multi-Organ Matrix', path: '/matrix', icon: Grid3x3 },
  { name: 'Organ Modules', path: '/organs', icon: Heart },
  { name: 'Case Engine', path: '/cases', icon: FileText },
  { name: 'Assessment', path: '/assessment', icon: BookOpen },
];

export default function Layout() {
  const { sidebarOpen, toggleSidebar } = useStore();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-4 md:px-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="md:hidden"
          >
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
          <div className="flex items-center space-x-3 ml-2 md:ml-0">
            <Activity className="h-6 w-6 text-primary" />
            <h1 className="text-lg md:text-xl font-bold">
              Systems Pathophysiology
            </h1>
          </div>
          <div className="ml-auto">
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Organ Failure Simulator
            </span>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-40 mt-16 w-64 border-r border-border bg-background transition-transform duration-300 ease-in-out md:relative md:mt-0 md:translate-x-0',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <nav className="space-y-1 p-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-4 md:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
}
