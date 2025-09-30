import { Plus, MessageSquare, X, Menu, LoaderCircle } from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChatStore } from '@/hooks/useChatStore';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
export function Sidebar() {
  const sessions = useChatStore((state) => state.sessions);
  const activeSessionId = useChatStore((state) => state.activeSessionId);
  const createNewSession = useChatStore((state) => state.createNewSession);
  const switchSession = useChatStore((state) => state.switchSession);
  const isSidebarOpen = useChatStore((state) => state.isSidebarOpen);
  const toggleSidebar = useChatStore((state) => state.toggleSidebar);
  const isLoading = useChatStore((state) => state.isLoading);
  const sidebarVariants: Variants = {
    open: {
      x: 0,
      width: '280px',
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
    closed: {
      x: '-100%',
      width: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
  };
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            key="sidebar"
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-y-0 left-0 z-40 lg:relative lg:translate-x-0 bg-slate-50 border-r border-slate-200 flex flex-col"
          >
            <div className="p-4 flex justify-between items-center border-b border-slate-200">
              <h1 className="text-xl font-bold text-slate-800">InsightSphere</h1>
              <Button variant="ghost" size="icon" onClick={createNewSession} className="hover:bg-indigo-100">
                <Plus className="h-5 w-5 text-indigo-600" />
              </Button>
            </div>
            <ScrollArea className="flex-1">
              <nav className="p-4 space-y-2">
                {isLoading && sessions.length === 0 ? (
                  <div className="flex items-center justify-center p-4">
                    <LoaderCircle className="h-6 w-6 animate-spin text-indigo-600" />
                  </div>
                ) : (
                  sessions.map((session) => (
                    <Button
                      key={session.id}
                      variant={activeSessionId === session.id ? 'secondary' : 'ghost'}
                      className={cn(
                        'w-full justify-start px-3 py-2 h-auto text-left',
                        activeSessionId === session.id && 'bg-indigo-100 text-indigo-700 font-semibold'
                      )}
                      onClick={() => switchSession(session.id)}
                    >
                      <MessageSquare className="mr-3 h-4 w-4 flex-shrink-0" />
                      <div className="flex flex-col overflow-hidden">
                        <span className="truncate text-sm">{session.title}</span>
                        <span className="text-xs text-slate-500 font-normal">
                          {formatDistanceToNow(new Date(session.lastActive), { addSuffix: true })}
                        </span>
                      </div>
                    </Button>
                  ))
                )}
              </nav>
            </ScrollArea>
            <div className="p-4 border-t border-slate-200">
              <p className="text-xs text-slate-500 text-center">
                Built with ❤️ at Cloudflare
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}