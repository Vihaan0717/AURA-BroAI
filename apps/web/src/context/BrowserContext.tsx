import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  SearchMode,
  SearchResultPayload,
  ShoppingResultPayload,
  EntertainmentItem,
  ImageSearchResult,
  RemoteCompanionState,
  PrivacySettings,
  UserSavedMemory,
  ChatSession,
  QueryIntent,
} from '@private-browser/shared';
import {
  MOCK_SEARCH_RESULTS,
  MOCK_SHOPPING_RESULTS,
  MOCK_ENTERTAINMENT_RESULTS,
  MOCK_IMAGE_RESULTS,
  MOCK_REMOTE_STATE,
  MOCK_SAVED_MEMORIES,
  MOCK_PRIVACY_SETTINGS,
  MOCK_INITIAL_CHAT_SESSIONS,
} from '../services/mockDataService';
import { analyzeQueryIntent } from '../services/intentDetector';

interface BrowserContextValue {
  view: 'home' | 'results';
  mode: SearchMode;
  query: string;
  refinedQuery: string;
  useRefinedQuery: boolean;
  intent: QueryIntent | null;
  isLoading: boolean;
  isOnline: boolean;
  searchResult: SearchResultPayload | null;
  shoppingResult: ShoppingResultPayload | null;
  entertainmentResult: EntertainmentItem | null;
  imageResults: ImageSearchResult[] | null;
  chatSessions: ChatSession[];
  activeChatId: string;
  remoteState: RemoteCompanionState;
  privacySettings: PrivacySettings;
  savedMemories: UserSavedMemory[];
  // Actions
  setMode: (mode: SearchMode) => void;
  setQuery: (q: string) => void;
  setUseRefinedQuery: (use: boolean) => void;
  performSearch: (searchQuery?: string, explicitMode?: SearchMode) => void;
  navigateHome: () => void;
  addChatMessage: (content: string) => void;
  createChatSession: () => void;
  deleteChatSession: (id: string) => void;
  renameChatSession: (id: string, newTitle: string) => void;
  setActiveChatId: (id: string) => void;
  pinToResearchMemory: (content: string, category?: UserSavedMemory['category']) => void;
  deleteSavedMemory: (id: string) => void;
  exportMemoriesJSON: () => void;
  updatePrivacySettings: (partial: Partial<PrivacySettings>) => void;
  purgeAllAccountData: () => void;
  connectRemoteCompanion: () => Promise<void>;
  disconnectRemoteCompanion: () => void;
  triggerRemoteAction: (actionName: string) => void;
}

const BrowserContext = createContext<BrowserContextValue | undefined>(undefined);

export const BrowserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [view, setView] = useState<'home' | 'results'>('home');
  const [mode, setMode] = useState<SearchMode>('search');
  const [query, setQuery] = useState('');
  const [refinedQuery, setRefinedQuery] = useState('');
  const [useRefinedQuery, setUseRefinedQuery] = useState(true);
  const [intent, setIntent] = useState<QueryIntent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Results State
  const [searchResult, setSearchResult] = useState<SearchResultPayload | null>(null);
  const [shoppingResult, setShoppingResult] = useState<ShoppingResultPayload | null>(null);
  const [entertainmentResult, setEntertainmentResult] = useState<EntertainmentItem | null>(null);
  const [imageResults, setImageResults] = useState<ImageSearchResult[] | null>(null);

  // Chat & Memory State
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(MOCK_INITIAL_CHAT_SESSIONS);
  const [activeChatId, setActiveChatId] = useState<string>(MOCK_INITIAL_CHAT_SESSIONS[0].id);
  const [savedMemories, setSavedMemories] = useState<UserSavedMemory[]>(MOCK_SAVED_MEMORIES);
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>(MOCK_PRIVACY_SETTINGS);
  const [remoteState, setRemoteState] = useState<RemoteCompanionState>(MOCK_REMOTE_STATE);

  // Network listener
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const performSearch = (overrideQuery?: string, explicitMode?: SearchMode) => {
    const targetQuery = overrideQuery !== undefined ? overrideQuery : query;
    if (!targetQuery.trim() && !explicitMode) return;

    setIsLoading(true);
    const detectedIntent = analyzeQueryIntent(targetQuery, explicitMode || mode);
    setIntent(detectedIntent);
    setRefinedQuery(detectedIntent.refinedQuery);
    const effectiveMode = explicitMode || detectedIntent.detectedMode;
    setMode(effectiveMode);

    // Transition to results workspace
    setView('results');

    // Simulate genuine network & reasoning latency (600ms)
    setTimeout(() => {
      if (effectiveMode === 'shopping') {
        setShoppingResult(MOCK_SHOPPING_RESULTS.headphones);
        setSearchResult(null);
        setEntertainmentResult(null);
        setImageResults(null);
      } else if (effectiveMode === 'entertainment') {
        setEntertainmentResult(MOCK_ENTERTAINMENT_RESULTS.scifi);
        setSearchResult(null);
        setShoppingResult(null);
        setImageResults(null);
      } else if (effectiveMode === 'images') {
        setImageResults(MOCK_IMAGE_RESULTS.nature);
        setSearchResult(null);
        setShoppingResult(null);
        setEntertainmentResult(null);
      } else if (effectiveMode === 'companion') {
        // Keeps results view with companion active
      } else if (effectiveMode === 'privacy') {
        // Keeps results view with privacy settings
      } else {
        // General search / deep research
        setSearchResult({
          ...MOCK_SEARCH_RESULTS.default,
          query: targetQuery,
          refinedQuery: detectedIntent.refinedQuery,
          mode: effectiveMode,
        });
        setShoppingResult(null);
        setEntertainmentResult(null);
        setImageResults(null);
      }
      setIsLoading(false);
    }, 550);
  };

  const navigateHome = () => {
    setView('home');
  };

  // Chat Actions
  const addChatMessage = (content: string) => {
    const currentSession = chatSessions.find((s) => s.id === activeChatId);
    if (!currentSession) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      role: 'user' as const,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...currentSession.messages, userMsg];
    setChatSessions((prev) =>
      prev.map((s) => (s.id === activeChatId ? { ...s, messages: updatedMessages, updatedAt: new Date().toISOString() } : s))
    );

    // Simulated AI Assistant Turn
    setTimeout(() => {
      const assistantMsg = {
        id: `asst-${Date.now()}`,
        role: 'assistant' as const,
        content: `I've synthesized your inquiry about "${content}". When evaluating this within your configured privacy boundaries (local-first inference and zero third-party telemetry), we maintain strict host isolation. Would you like to save this finding to your research memory, or explore the source citations?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        followUpChips: [
          'Pin key finding to research memory',
          'Inspect raw evidence sources',
          'Switch to Deep Research mode',
        ],
      };

      setChatSessions((prev) =>
        prev.map((s) =>
          s.id === activeChatId ? { ...s, messages: [...updatedMessages, assistantMsg], updatedAt: new Date().toISOString() } : s
        )
      );
    }, 700);
  };

  const createChatSession = () => {
    const newSession: ChatSession = {
      id: `sess-${Date.now()}`,
      title: 'New Research Inquiry',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [],
    };
    setChatSessions((prev) => [newSession, ...prev]);
    setActiveChatId(newSession.id);
  };

  const deleteChatSession = (id: string) => {
    setChatSessions((prev) => prev.filter((s) => s.id !== id));
    if (activeChatId === id && chatSessions.length > 1) {
      const nextSession = chatSessions.find((s) => s.id !== id);
      if (nextSession) setActiveChatId(nextSession.id);
    }
  };

  const renameChatSession = (id: string, newTitle: string) => {
    setChatSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, title: newTitle } : s))
    );
  };

  // Memory Actions
  const pinToResearchMemory = (content: string, category: UserSavedMemory['category'] = 'research_topic') => {
    const newMem: UserSavedMemory = {
      id: `mem-${Date.now()}`,
      category,
      content,
      dateAdded: new Date().toISOString().split('T')[0],
    };
    setSavedMemories((prev) => [newMem, ...prev]);
  };

  const deleteSavedMemory = (id: string) => {
    setSavedMemories((prev) => prev.filter((m) => m.id !== id));
  };

  const exportMemoriesJSON = () => {
    const blob = new Blob([JSON.stringify(savedMemories, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aura-research-memory-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Privacy Actions
  const updatePrivacySettings = (partial: Partial<PrivacySettings>) => {
    setPrivacySettings((prev) => ({ ...prev, ...partial }));
  };

  const purgeAllAccountData = () => {
    setSavedMemories([]);
    setChatSessions([
      {
        id: `sess-${Date.now()}`,
        title: 'Initial Research Session',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: [],
      },
    ]);
    setSearchResult(null);
    setShoppingResult(null);
    setEntertainmentResult(null);
    setImageResults(null);
    setQuery('');
    setView('home');
  };

  // Remote Companion Actions
  const connectRemoteCompanion = async () => {
    setRemoteState((prev) => ({ ...prev, status: 'pairing' }));
    await new Promise((r) => setTimeout(r, 1200));
    setRemoteState((prev) => ({
      ...prev,
      status: 'connected',
      activeSessionId: `antigravity-ses-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      sessionStartedAt: new Date().toISOString(),
      auditLogs: [
        {
          timestamp: new Date().toLocaleTimeString(),
          action: 'Secure TLS WebSocket established with Google Antigravity Session',
          status: 'completed',
        },
        ...prev.auditLogs,
      ],
    }));
  };

  const disconnectRemoteCompanion = () => {
    setRemoteState((prev) => ({
      ...prev,
      status: 'disconnected',
      activeSessionId: undefined,
      sessionStartedAt: undefined,
      auditLogs: [
        {
          timestamp: new Date().toLocaleTimeString(),
          action: 'Remote session terminated cleanly by client',
          status: 'completed',
        },
        ...prev.auditLogs,
      ],
    }));
  };

  const triggerRemoteAction = (actionName: string) => {
    setRemoteState((prev) => ({
      ...prev,
      auditLogs: [
        {
          timestamp: new Date().toLocaleTimeString(),
          action: `Action dispatched: ${actionName}`,
          status: 'authorized',
        },
        ...prev.auditLogs,
      ],
    }));
  };

  return (
    <BrowserContext.Provider
      value={{
        view,
        mode,
        query,
        refinedQuery,
        useRefinedQuery,
        intent,
        isLoading,
        isOnline,
        searchResult,
        shoppingResult,
        entertainmentResult,
        imageResults,
        chatSessions,
        activeChatId,
        remoteState,
        privacySettings,
        savedMemories,
        setMode,
        setQuery,
        setUseRefinedQuery,
        performSearch,
        navigateHome,
        addChatMessage,
        createChatSession,
        deleteChatSession,
        renameChatSession,
        setActiveChatId,
        pinToResearchMemory,
        deleteSavedMemory,
        exportMemoriesJSON,
        updatePrivacySettings,
        purgeAllAccountData,
        connectRemoteCompanion,
        disconnectRemoteCompanion,
        triggerRemoteAction,
      }}
    >
      {children}
    </BrowserContext.Provider>
  );
};

export const useBrowser = () => {
  const ctx = useContext(BrowserContext);
  if (!ctx) throw new Error('useBrowser must be used within BrowserProvider');
  return ctx;
};
