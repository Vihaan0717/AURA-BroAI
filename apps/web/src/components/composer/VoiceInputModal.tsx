import React, { useState, useEffect } from 'react';
import { Mic, MicOff, X, Check, Volume2 } from 'lucide-react';

interface VoiceInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTranscriptionComplete: (text: string) => void;
}

export const VoiceInputModal: React.FC<VoiceInputModalProps> = ({
  isOpen,
  onClose,
  onTranscriptionComplete,
}) => {
  const [isListening, setIsListening] = useState(true);
  const [transcription, setTranscription] = useState('');
  const [simulatedVolume, setSimulatedVolume] = useState<number[]>([15, 30, 60, 45, 75, 50, 20]);

  useEffect(() => {
    if (!isOpen) {
      setTranscription('');
      setIsListening(true);
      return;
    }

    const volumeInterval = setInterval(() => {
      setSimulatedVolume(
        Array.from({ length: 7 }, () => Math.floor(Math.random() * 65) + 15)
      );
    }, 120);

    const sampleSentences = [
      'compare sony xm5 and sennheiser momentum 4 with hinge durability and inr price',
      'photos of swiss alps in winter high resolution',
      'dune part two reviews and streaming availability in india',
      'privacy implications of on-device neural inference',
    ];
    const chosen = sampleSentences[Math.floor(Math.random() * sampleSentences.length)];

    let currentIdx = 0;
    const words = chosen.split(' ');
    const speechInterval = setInterval(() => {
      if (currentIdx < words.length) {
        setTranscription((prev) => (prev ? `${prev} ${words[currentIdx]}` : words[currentIdx]));
        currentIdx++;
      } else {
        clearInterval(speechInterval);
      }
    }, 320);

    return () => {
      clearInterval(volumeInterval);
      clearInterval(speechInterval);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (transcription.trim()) {
      onTranscriptionComplete(transcription.trim());
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md liquid-card rounded-3xl p-6 text-center relative animate-scale-in">
        <button
          onClick={onClose}
          aria-label="Close voice modal"
          className="absolute top-4 right-4 p-1.5 rounded-xl text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-medium mb-4">
          <Volume2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
          <span>Private On-Device Speech</span>
        </div>

        {/* Dynamic Voice Pulse Circle */}
        <div className="relative my-5 flex items-center justify-center">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
              isListening
                ? 'bg-gradient-to-tr from-emerald-600 to-teal-400 shadow-[0_0_30px_rgba(87,229,189,0.35)]'
                : 'bg-black/10 dark:bg-white/10'
            }`}
          >
            {isListening ? (
              <Mic className="w-7 h-7 text-white animate-pulse" />
            ) : (
              <MicOff className="w-7 h-7 text-zinc-500 dark:text-zinc-400" />
            )}
          </div>

          {/* Sound Wave Bars */}
          <div className="absolute inset-x-0 bottom-[-20px] flex items-center justify-center gap-1 h-5">
            {simulatedVolume.map((vol, i) => (
              <div
                key={i}
                className="w-1 bg-emerald-500 dark:bg-emerald-400/80 rounded-full transition-all duration-100"
                style={{ height: `${vol}%` }}
              />
            ))}
          </div>
        </div>

        {/* Live Transcription Box */}
        <div className="mt-7 min-h-[68px] p-3.5 rounded-2xl bg-black/5 dark:bg-black/30 border border-black/10 dark:border-white/10 text-xs text-zinc-900 dark:text-zinc-100 text-left font-normal">
          {transcription ? (
            <span className="leading-relaxed">{transcription}</span>
          ) : (
            <span className="text-zinc-500 dark:text-zinc-400 italic">Listening for speech...</span>
          )}
        </div>

        {/* Controls */}
        <div className="mt-5 flex items-center justify-between gap-3">
          <button
            onClick={() => setIsListening(!isListening)}
            className="flex-1 px-3.5 py-2 rounded-xl border border-black/10 dark:border-white/10 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            {isListening ? 'Pause Microphone' : 'Resume'}
          </button>
          <button
            onClick={handleConfirm}
            disabled={!transcription.trim()}
            className="flex-1 flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-30 disabled:cursor-not-allowed text-xs font-medium transition-all shadow-md"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Insert Query</span>
          </button>
        </div>
      </div>
    </div>
  );
};
