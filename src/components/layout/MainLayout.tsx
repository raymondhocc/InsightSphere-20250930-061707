import { Sidebar } from './Sidebar';
import { ChatView } from '../chat/ChatView';
import { AnalyticsDashboard } from '../analytics/AnalyticsDashboard';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useChatStore } from '@/hooks/useChatStore';
import { cn } from '@/lib/utils';
import { AlertTriangle } from 'lucide-react';
import { ThemeToggle } from '../ThemeToggle';

export function MainLayout() {
  const isSidebarOpen = useChatStore((state) => state.isSidebarOpen);
  return (
    <div className="h-screen w-screen bg-slate-100 flex text-slate-800">
      <Sidebar />
      <main className={cn(
        "flex-1 flex flex-col transition-all duration-300 ease-in-out relative",
        isSidebarOpen ? "lg:ml-[280px]" : "lg:ml-0"
      )}>
        <div className="absolute top-4 right-6 z-10">
          <ThemeToggle />
        </div>
        <div className="flex-1 p-6 pb-2 overflow-hidden">
          <ResizablePanelGroup direction="vertical" className="h-full max-w-7xl mx-auto">
            <ResizablePanel defaultSize={60} minSize={30}>
              <div className="h-full pr-4">
                <ChatView />
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={40} minSize={20}>
              <div className="h-full overflow-y-auto pt-6 pr-4">
                <AnalyticsDashboard />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
        <footer className="px-6 py-2 text-center text-xs text-slate-500 max-w-7xl mx-auto w-full">
          <div className="flex items-center justify-center space-x-2 bg-yellow-100/80 text-yellow-800 p-2 rounded-md border border-yellow-200/80">
            <AlertTriangle className="h-4 w-4" />
            <p>
              <strong>Demo Environment:</strong> AI features require API keys. To enable them, deploy this project and add your keys as secrets in Cloudflare.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}