import { useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useChatStore } from '@/hooks/useChatStore';
import { Toaster } from '@/components/ui/sonner';
export function HomePage() {
  const initialize = useChatStore((state) => state.initialize);
  const _hasHydrated = useChatStore((state) => state._hasHydrated);
  const setHasHydrated = useChatStore((state) => state.setHasHydrated);
  useEffect(() => {
    if (!_hasHydrated) {
      initialize();
      setHasHydrated(true);
    }
  }, [initialize, _hasHydrated, setHasHydrated]);
  return (
    <>
      <MainLayout />
      <Toaster />
    </>
  );
}