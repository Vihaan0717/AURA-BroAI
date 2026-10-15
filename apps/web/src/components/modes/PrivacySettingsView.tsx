import React, { useState } from 'react';
import { useBrowser } from '../../context/BrowserContext';
import {
  ShieldCheck,
  Download,
  Trash2,
  Lock,
  Cpu,
  Cookie,
  AlertTriangle,
  CheckCircle,
  Database,
  EyeOff,
} from 'lucide-react';

export const PrivacySettingsView: React.FC = () => {
  const {
    privacySettings,
    updatePrivacySettings,
    savedMemories,
    deleteSavedMemory,
    exportMemoriesJSON,
    purgeAllAccountData,
  } = useBrowser();

  const [showPurgeModal, setShowPurgeModal] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Top Banner: Built-in Privacy Architecture */}
      <div className="liquid-card rounded-3xl p-6 sm:p-8">
        <div className="flex items-start gap-3 pb-4 mb-4 border-b border-black/5 dark:border-white/5">
          <div className="p-2.5 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Privacy Architecture & Sovereignty Controls
            </h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-1 leading-relaxed">
              Privacy is enforced by architecture: zero third-party telemetry, zero advertisements, client-encrypted storage, and no AI model training on your research threads.
            </p>
          </div>
        </div>

        {/* Core Architecture Guarantees */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">Zero Telemetry</span>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-0.5">
                No Google Analytics, tracking pixels, or diagnostic telemetry SDKs.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">Zero Ad Network</span>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-0.5">
                No sponsored links, search arbitrage, or advertising trackers.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">No Model Training</span>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-0.5">
                Your personal queries and data are never used for model fine-tuning.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Model Processing Mode Selector */}
      <div className="liquid-card rounded-3xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">
            AI Inference Processing Boundary
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <button
            onClick={() => updatePrivacySettings({ aiProcessingMode: 'local_model' })}
            className={`p-4 rounded-2xl text-left border transition-all ${
              privacySettings.aiProcessingMode === 'local_model'
                ? 'bg-emerald-500/20 border-emerald-500/40 text-zinc-900 dark:text-zinc-50'
                : 'bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/5 text-zinc-700 dark:text-zinc-300 hover:bg-black/10 dark:hover:bg-white/10'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">Local-Only Model</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 text-emerald-700 dark:text-emerald-300">
                100% On-Device
              </span>
            </div>
            <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Inference runs on localhost (e.g. Ollama or local NPU). Zero network transit of prompt payloads.
            </p>
          </button>

          <button
            onClick={() => updatePrivacySettings({ aiProcessingMode: 'hybrid' })}
            className={`p-4 rounded-2xl text-left border transition-all ${
              privacySettings.aiProcessingMode === 'hybrid'
                ? 'bg-emerald-500/20 border-emerald-500/40 text-zinc-900 dark:text-zinc-50'
                : 'bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/5 text-zinc-700 dark:text-zinc-300 hover:bg-black/10 dark:hover:bg-white/10'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">Hybrid Private</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 text-zinc-700 dark:text-zinc-200">
                Balanced
              </span>
            </div>
            <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Local token stripping & anonymized query keywords before dispatching to search indices.
            </p>
          </button>

          <button
            onClick={() => updatePrivacySettings({ aiProcessingMode: 'cloud_confidential' })}
            className={`p-4 rounded-2xl text-left border transition-all ${
              privacySettings.aiProcessingMode === 'cloud_confidential'
                ? 'bg-emerald-500/20 border-emerald-500/40 text-zinc-900 dark:text-zinc-50'
                : 'bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/5 text-zinc-700 dark:text-zinc-300 hover:bg-black/10 dark:hover:bg-white/10'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">Confidential Cloud</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 text-zinc-700 dark:text-zinc-200">
                Zero-Retention
              </span>
            </div>
            <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Encrypted memory enclaves with contractual zero-day retention and server-side secret management.
            </p>
          </button>
        </div>
      </div>

      {/* Inspectable & Editable Saved Research Memory */}
      <div className="liquid-card rounded-3xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-black/5 dark:border-white/5">
          <div>
            <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Inspectable Personal Research Memory ({savedMemories.length})</span>
            </h3>
            <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-0.5">
              Saved preferences and pinned insights are stored locally and fully editable. Never used to construct cross-session advertising profiles.
            </p>
          </div>

          <button
            onClick={exportMemoriesJSON}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl liquid-pill text-zinc-800 dark:text-zinc-100 text-xs font-medium transition-colors self-start sm:self-center"
            title="Export all saved memories as JSON"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Export JSON</span>
          </button>
        </div>

        {savedMemories.length === 0 ? (
          <div className="p-6 text-center text-xs text-zinc-500 dark:text-zinc-400 font-mono">
            No research memory items saved yet. Use the 'Pin to Memory' button on any search finding.
          </div>
        ) : (
          <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
            {savedMemories.map((mem) => (
              <div
                key={mem.id}
                className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-black/10 dark:bg-white/10 text-zinc-700 dark:text-zinc-300 font-mono text-[10px] uppercase">
                      {mem.category.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">
                      Added: {mem.dateAdded}
                    </span>
                  </div>
                  <p className="text-zinc-900 dark:text-zinc-100 leading-relaxed text-[11px]">
                    {mem.content}
                  </p>
                </div>

                <button
                  onClick={() => deleteSavedMemory(mem.id)}
                  aria-label="Delete saved memory entry"
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-red-500 dark:text-zinc-400 dark:hover:text-red-400 hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex-shrink-0"
                  title="Delete memory"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Account Data Purge Button */}
      <div className="liquid-card rounded-3xl p-6 border border-red-500/20 bg-red-500/5 dark:bg-red-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
            Complete Account Data Wipe
          </h4>
          <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-1">
            Irrevocably delete all local chat history, saved research memory, cookies, and cached findings.
          </p>
        </div>

        <button
          onClick={() => setShowPurgeModal(true)}
          className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-all self-start sm:self-center flex-shrink-0 shadow-md"
        >
          Purge All Data
        </button>
      </div>

      {/* Safety Confirmation Modal */}
      {showPurgeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md liquid-card rounded-3xl p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-600 dark:text-red-400 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
              Confirm Data Deletion
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Are you sure you want to permanently erase all local research sessions, pinned preferences, and cached payloads? This cannot be undone.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowPurgeModal(false)}
                className="flex-1 px-4 py-2.5 rounded-xl liquid-pill text-xs font-medium text-zinc-800 dark:text-zinc-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  purgeAllAccountData();
                  setShowPurgeModal(false);
                }}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-colors shadow-md"
              >
                Yes, Purge Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
