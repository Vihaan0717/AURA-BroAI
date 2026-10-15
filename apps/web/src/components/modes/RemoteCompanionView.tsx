import React, { useState } from 'react';
import { useBrowser } from '../../context/BrowserContext';
import {
  Laptop,
  Wifi,
  Shield,
  KeyRound,
  Play,
  Square,
  AlertOctagon,
  Terminal,
  Clock,
  CheckCircle2,
  ExternalLink,
  Lock,
} from 'lucide-react';

export const RemoteCompanionView: React.FC = () => {
  const {
    remoteState,
    connectRemoteCompanion,
    disconnectRemoteCompanion,
    triggerRemoteAction,
  } = useBrowser();

  const [pairingCode, setPairingCode] = useState('');
  const [isAuthorizingAction, setIsAuthorizingAction] = useState(false);

  const isConnected = remoteState.status === 'connected';
  const isPairing = remoteState.status === 'pairing';

  const handleStartSession = async () => {
    await connectRemoteCompanion();
  };

  const handleStopSession = () => {
    disconnectRemoteCompanion();
  };

  const handleSendSafeQuery = (commandDesc: string) => {
    setIsAuthorizingAction(true);
    triggerRemoteAction(commandDesc);
    setTimeout(() => setIsAuthorizingAction(false), 600);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Status & Bridge Banner */}
      <div className="liquid-card rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-black/5 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-2xl flex items-center justify-center transition-colors ${
                isConnected
                  ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 shadow-sm'
                  : 'bg-black/5 dark:bg-white/5 text-zinc-500 dark:text-zinc-400'
              }`}
            >
              <Laptop className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                  Google Antigravity & Personal Device Bridge
                </h2>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase ${
                    isConnected
                      ? 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30'
                      : isPairing
                      ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 animate-pulse'
                      : 'bg-black/5 dark:bg-white/10 text-zinc-600 dark:text-zinc-400 border border-black/10 dark:border-white/10'
                  }`}
                >
                  {remoteState.status}
                </span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-1 leading-relaxed">
                Official Antigravity Remote Control workflow • Secure TLS WebSocket bridge
              </p>
            </div>
          </div>

          {/* Session Start / Stop Buttons */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            {isConnected ? (
              <button
                onClick={handleStopSession}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-700 dark:text-red-300 border border-red-500/40 text-xs font-semibold transition-all active:scale-95"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop Session</span>
              </button>
            ) : (
              <button
                onClick={handleStartSession}
                disabled={isPairing}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-semibold transition-all shadow-md active:scale-95"
              >
                {isPairing ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Pairing Device...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Start Remote Session</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Device Information Panel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase font-mono block mb-1">
              Paired Workstation
            </span>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">
              {remoteState.targetDevice.name}
            </span>
            <span className="text-[11px] text-zinc-600 dark:text-zinc-400 font-mono mt-0.5 block">
              {remoteState.targetDevice.platform}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase font-mono block mb-1">
              Local Subnet Binding
            </span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 block font-mono">
              {remoteState.targetDevice.hostMasked}
            </span>
            <span className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-0.5 block">
              Direct peer-to-peer TLS
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase font-mono block mb-1">
              Daemon Environment
            </span>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">
              {remoteState.targetDevice.antigravityVersion}
            </span>
            <span className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-0.5 block">
              Status: {remoteState.targetDevice.lastSeen}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase font-mono block mb-1">
              Active Session Token
            </span>
            <span className="font-mono text-cyan-600 dark:text-cyan-300 font-semibold block truncate">
              {remoteState.activeSessionId || 'None (Idle)'}
            </span>
            <span className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-0.5 block">
              Timeout: {remoteState.safety.timeoutMinutes}m auto-release
            </span>
          </div>
        </div>
      </div>

      {/* Safety Architecture Disclosures */}
      <div className="liquid-card rounded-3xl p-6 space-y-4">
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
          <Shield className="w-4 h-4" />
          <h3 className="text-xs font-semibold uppercase tracking-wider">
            Safety & Input Sovereignty Rules
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 space-y-1">
            <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">
              Physical Keyboard Preserved
            </span>
            <p className="text-[11px] text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Your laptop's physical keyboard and mouse are never globally locked. You maintain immediate local override control at all times.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 space-y-1">
            <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">
              Emergency Local Unlock
            </span>
            <p className="text-[11px] text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Pressing <code className="text-emerald-600 dark:text-emerald-300 font-mono font-semibold">Esc</code> 3 times on the laptop immediately drops remote authorization and releases all locks.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 space-y-1">
            <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">
              Zero WAN Port Exposure
            </span>
            <p className="text-[11px] text-zinc-600 dark:text-zinc-300 leading-relaxed">
              The companion never opens an unauthenticated public listening socket. Connections require explicit local pairing verification.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Quick Actions (When Connected) */}
      {isConnected && (
        <div className="liquid-card rounded-3xl p-6 space-y-4 animate-slide-up">
          <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">
            Authorized Antigravity Session Actions
          </h3>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => handleSendSafeQuery('Query active Antigravity background tasks')}
              disabled={isAuthorizingAction}
              className="px-3.5 py-2 rounded-xl liquid-pill text-xs font-medium text-zinc-800 dark:text-zinc-200 transition-colors flex items-center gap-2"
            >
              <Terminal className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>Inspect Background Tasks</span>
            </button>

            <button
              onClick={() => handleSendSafeQuery('Request workspace memory usage stats')}
              disabled={isAuthorizingAction}
              className="px-3.5 py-2 rounded-xl liquid-pill text-xs font-medium text-zinc-800 dark:text-zinc-200 transition-colors flex items-center gap-2"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Query Memory Health</span>
            </button>

            <button
              onClick={() => handleSendSafeQuery('List recent conversation transcript summaries')}
              disabled={isAuthorizingAction}
              className="px-3.5 py-2 rounded-xl liquid-pill text-xs font-medium text-zinc-800 dark:text-zinc-200 transition-colors flex items-center gap-2"
            >
              <Lock className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>Verify Session Logs</span>
            </button>
          </div>
        </div>
      )}

      {/* Audit Log Trail */}
      <div className="liquid-card rounded-3xl p-6 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/5">
          <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Companion Security Audit Trail ({remoteState.auditLogs.length})</span>
          </h3>
          <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">No sensitive payload logging</span>
        </div>

        <div className="space-y-2">
          {remoteState.auditLogs.map((log, i) => (
            <div
              key={i}
              className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 flex items-center justify-between text-xs font-mono"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-zinc-500 dark:text-zinc-400 text-[11px] flex-shrink-0">{log.timestamp}</span>
                <span className="text-zinc-800 dark:text-zinc-200 truncate">{log.action}</span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[10px] uppercase font-semibold flex-shrink-0">
                {log.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
