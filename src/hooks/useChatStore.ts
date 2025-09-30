import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { v4 as uuidv4 } from 'uuid';
import { chatService } from '@/lib/chat';
import type { Message as ApiMessage, SessionInfo as ApiSessionInfo, ToolCall } from '../../worker/types';
export type Message = ApiMessage;
export type SessionInfo = ApiSessionInfo;
export interface KpiData {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: string;
}
export interface ChartData {
  type: 'bar' | 'pie' | 'line';
  data: {
    name: string;
    value: number;
  }[];
}
export interface FunnelData {
  stage: string;
  value: number;
}
export interface SegmentationData {
  name: string;
  value: number;
}
interface AnalyticsData {
  kpis?: KpiData[];
  charts?: ChartData[];
  funnel?: FunnelData[];
  segmentation?: SegmentationData[];
}
type ChatState = {
  sessions: SessionInfo[];
  activeSessionId: string | null;
  messages: Message[];
  input: string;
  isLoading: boolean;
  isStreaming: boolean;
  streamingMessage: string;
  isSidebarOpen: boolean;
  analyticsData: AnalyticsData | null;
  _hasHydrated: boolean;
};
type ChatActions = {
  initialize: () => Promise<void>;
  setActiveSessionId: (sessionId: string | null) => void;
  setInput: (input: string) => void;
  sendMessage: (message?: string) => Promise<void>;
  createNewSession: () => Promise<void>;
  switchSession: (sessionId: string) => Promise<void>;
  toggleSidebar: () => void;
  setHasHydrated: (hydrated: boolean) => void;
  clearAnalytics: () => void;
};
export const useChatStore = create<ChatState & ChatActions>()(
  immer((set, get) => ({
    sessions: [],
    activeSessionId: null,
    messages: [],
    input: '',
    isLoading: false,
    isStreaming: false,
    streamingMessage: '',
    isSidebarOpen: true,
    analyticsData: null,
    _hasHydrated: false,
    setHasHydrated: (hydrated) => {
      set({ _hasHydrated: hydrated });
    },
    toggleSidebar: () => {
      set((state) => {
        state.isSidebarOpen = !state.isSidebarOpen;
      });
    },
    clearAnalytics: () => {
      set({ analyticsData: null });
    },
    initialize: async () => {
      set({ isLoading: true });
      const res = await chatService.listSessions();
      if (res.success && res.data) {
        const sessions = res.data;
        set({ sessions });
        if (sessions.length > 0) {
          await get().switchSession(sessions[0].id);
        } else {
          await get().createNewSession();
        }
      } else {
        await get().createNewSession();
      }
      set({ isLoading: false });
    },
    setActiveSessionId: (sessionId) => {
      set({ activeSessionId: sessionId });
      if (sessionId) {
        chatService.switchSession(sessionId);
      }
    },
    setInput: (input) => {
      set({ input });
    },
    switchSession: async (sessionId) => {
      set({ isLoading: true, messages: [], activeSessionId: sessionId, analyticsData: null });
      chatService.switchSession(sessionId);
      const res = await chatService.getMessages();
      if (res.success && res.data) {
        set({ messages: res.data.messages });
      }
      set({ isLoading: false });
    },
    createNewSession: async () => {
      const newSessionId = uuidv4();
      set({ activeSessionId: newSessionId, messages: [], input: '', analyticsData: null });
      chatService.switchSession(newSessionId);
    },
    sendMessage: async (message) => {
      const input = (message || get().input).trim();
      if (!input || get().isLoading) return;
      const activeSessionId = get().activeSessionId;
      if (!activeSessionId) return;
      set((state) => {
        state.isLoading = true;
        state.input = '';
        state.analyticsData = null; // Clear previous analytics data
        state.messages.push({
          id: uuidv4(),
          role: 'user',
          content: input,
          timestamp: Date.now(),
        });
      });
      const isNewSession = !get().sessions.some(s => s.id === activeSessionId);
      if (isNewSession) {
        const res = await chatService.createSession(undefined, activeSessionId, input);
        if (res.success && res.data) {
            const newSession = {
                id: res.data.sessionId,
                title: res.data.title,
                createdAt: Date.now(),
                lastActive: Date.now(),
            };
            set(state => {
                state.sessions.unshift(newSession);
            });
        }
      }
      set({ isStreaming: true, streamingMessage: '' });
      await chatService.sendMessage(input, undefined, (chunk) => {
        set((state) => {
          state.streamingMessage += chunk;
        });
      });
      set({ isStreaming: false, isLoading: false, streamingMessage: '' });
      const res = await chatService.getMessages();
      if (res.success && res.data) {
        const messages = res.data.messages as Message[];
        set({ messages });
        const lastMessage = messages[messages.length - 1];
        if (lastMessage?.role === 'assistant' && lastMessage.toolCalls) {
          const newAnalyticsData: AnalyticsData = { kpis: [], charts: [], funnel: [], segmentation: [] };
          lastMessage.toolCalls.forEach((toolCall: ToolCall) => {
            if (toolCall.name === 'get_kpi_data' && toolCall.result) {
              newAnalyticsData.kpis = (toolCall.result as any).kpis;
            }
            if (toolCall.name === 'get_user_acquisition_data' && toolCall.result) {
              newAnalyticsData.charts = (toolCall.result as any).chartData;
            }
            if (toolCall.name === 'get_sales_funnel_data' && toolCall.result) {
              newAnalyticsData.funnel = (toolCall.result as any).funnelData;
            }
            if (toolCall.name === 'get_customer_segmentation_data' && toolCall.result) {
              newAnalyticsData.segmentation = (toolCall.result as any).segmentationData;
            }
          });
          if (newAnalyticsData.kpis?.length || newAnalyticsData.charts?.length || newAnalyticsData.funnel?.length || newAnalyticsData.segmentation?.length) {
            set({ analyticsData: newAnalyticsData });
          }
        }
      }
    },
  }))
);