import React, { useState } from 'react';
import { useBrowser } from '../../context/BrowserContext';
import {
  MessageSquare,
  Plus,
  Trash2,
  Edit2,
  Bookmark,
  Check,
  Send,
  Sparkles,
  Bot,
  User,
} from 'lucide-react';

export const ChatView: React.FC = () => {
  const {
    chatSessions,
    activeChatId,
    setActiveChatId,
    createChatSession,
    deleteChatSession,
    renameChatSession,
    addChatMessage,
    pinToResearchMemory,
  } = useBrowser();

  const [inputMessage, setInputMessage] = useState('');
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [pinnedMsgId, setPinnedMsgId] = useState<string | null>(null);

  const currentSession = chatSessions.find((s) => s.id === activeChatId) || chatSessions[0];

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim()) return;
    addChatMessage(inputMessage.trim());
    setInputMessage('');
  };

  const handleStartRename = (id: string, title: string) => {
    setEditingSessionId(id);
    setEditTitle(title);
  };

  const handleSaveRename = (id: string) => {
    if (editTitle.trim()) {
      renameChatSession(id, editTitle.trim());
    }
    setEditingSessionId(null);
  };

  const handlePin = (msgId: string, content: string) => {
    pinToResearchMemory(content.slice(0, 240), 'research_topic');
    setPinnedMsgId(msgId);
    setTimeout(() => setPinnedMsgId(null), 3000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 min-h-[600px] animate-fade-in">
      {/* Left Sidebar: Chat Sessions History */}
      <div className="md:col-span-1 liquid-card rounded-3xl p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-black/5 dark:border-white/5">
            <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">
              Research Sessions
            </span>
            <button
              onClick={createChatSession}
              aria-label="Create new conversation session"
              className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/25 transition-colors"
              title="New Conversation"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-1">
            {chatSessions.map((session) => {
              const isActive = session.id === activeChatId;
              return (
                <div
                  key={session.id}
                  onClick={() => setActiveChatId(session.id)}
                  className={`group p-2.5 rounded-xl text-left cursor-pointer transition-all flex items-center justify-between gap-2 ${
                    isActive
                      ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-900 dark:text-emerald-200 font-medium'
                      : 'hover:bg-black/5 dark:hover:bg-white/5 text-zinc-700 dark:text-zinc-300 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    {editingSessionId === session.id ? (
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={() => handleSaveRename(session.id)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveRename(session.id)}
                        autoFocus
                        className="bg-white dark:bg-black/40 border border-emerald-500/40 rounded px-1.5 py-0.5 text-xs text-zinc-900 dark:text-white focus:outline-none w-full"
                      />
                    ) : (
                      <span className="text-xs truncate">
                        {session.title}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartRename(session.id, session.title);
                      }}
                      className="p-1 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                      title="Rename"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    {chatSessions.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteChatSession(session.id);
                        }}
                        className="p-1 text-zinc-500 hover:text-red-500 dark:text-zinc-400 dark:hover:text-red-400"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-3 border-t border-black/5 dark:border-white/5 text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">
          Private local storage only
        </div>
      </div>

      {/* Main Chat Panel */}
      <div className="md:col-span-3 liquid-card rounded-3xl p-6 flex flex-col justify-between">
        {/* Messages Scroll Area */}
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 mb-4">
          {(!currentSession || currentSession.messages.length === 0) ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                Begin Conversational Research
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 max-w-sm mx-auto leading-relaxed">
                Ask multi-part questions, explore nuances, or analyze documents without telemetry or third-party training.
              </p>
            </div>
          ) : (
            currentSession.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 text-xs leading-relaxed animate-fade-in ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 space-y-2.5 ${
                    msg.role === 'user'
                      ? 'bg-emerald-600 text-white rounded-tr-none shadow-md'
                      : 'bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-zinc-900 dark:text-zinc-100 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>

                  {/* Assistant Footer with Pin & Follow-up chips */}
                  {msg.role === 'assistant' && (
                    <div className="pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between gap-2">
                      <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">
                        {msg.timestamp}
                      </span>
                      <button
                        onClick={() => handlePin(msg.id, msg.content)}
                        className={`flex items-center gap-1 text-[11px] font-medium transition-colors ${
                          pinnedMsgId === msg.id
                            ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                            : 'text-zinc-600 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-300'
                        }`}
                        title="Pin this finding to your private research memory"
                      >
                        {pinnedMsgId === msg.id ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Pinned</span>
                          </>
                        ) : (
                          <>
                            <Bookmark className="w-3 h-3" />
                            <span>Pin to Memory</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Follow-up suggestion chips */}
                  {msg.followUpChips && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.followUpChips.map((chip, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setInputMessage(chip);
                            addChatMessage(chip);
                          }}
                          className="px-2.5 py-1 rounded-lg liquid-pill text-[10px] text-zinc-800 dark:text-zinc-200 transition-colors"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-black/10 dark:bg-white/10 text-zinc-700 dark:text-zinc-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Chat Input Bar */}
        <form onSubmit={handleSendMessage} className="relative flex items-center gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask a follow-up or explore a specific detail..."
            className="w-full rounded-2xl bg-white/70 dark:bg-black/30 border border-black/10 dark:border-white/10 px-4 py-3 text-xs text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/50 shadow-inner"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-all shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
