import React, { useState } from 'react';
import { ImageSearchResult } from '@private-browser/shared';
import {
  Image as ImageIcon,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Maximize2,
  RotateCcw,
} from 'lucide-react';

interface ImagesViewProps {
  images: ImageSearchResult[] | null;
}

export const ImagesView: React.FC<ImagesViewProps> = ({ images }) => {
  const [simulateEmptyState, setSimulateEmptyState] = useState(false);
  const [selectedPreviewImage, setSelectedPreviewImage] = useState<ImageSearchResult | null>(null);
  const [failedImageIds, setFailedImageIds] = useState<Set<string>>(new Set());

  const displayImages = simulateEmptyState ? [] : images || [];
  const isLive = displayImages.length > 0 && displayImages[0]?.provenance === 'live';

  const handleImageError = (id: string) => {
    setFailedImageIds((prev) => new Set(prev).add(id));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Strict Provenance Policy Banner */}
      <div className="liquid-card rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-2xl bg-blue-500/15 text-blue-600 dark:text-blue-400 mt-0.5">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                Web-Sourced Image Search
              </h2>
              {isLive ? (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">
                  Live Web Images (Wikimedia Commons Open Archive)
                </span>
              ) : (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                  Curated Reference Catalog (Static Fixture)
                </span>
              )}
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full liquid-pill text-zinc-600 dark:text-zinc-300">
                Zero AI Generation
              </span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-1 leading-relaxed">
              {isLive
                ? 'Authentic photographic records retrieved from live open web archives. Original high-resolution URLs, source pages, author credits, and license terms are preserved.'
                : 'Displaying curated reference photographs for deterministic testing. No live search query was executed.'}
            </p>
          </div>
        </div>

        {/* Test Empty State Button for QA */}
        <button
          onClick={() => setSimulateEmptyState(!simulateEmptyState)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium liquid-pill text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors self-start sm:self-center flex-shrink-0"
          title="Verify honest empty state handling"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{simulateEmptyState ? 'Restore Images' : 'Test Empty State'}</span>
        </button>
      </div>

      {/* Honest Empty State if no images match */}
      {displayImages.length === 0 ? (
        <div className="liquid-card rounded-3xl p-10 text-center space-y-4 max-w-xl mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
              No Permitted Source Images Found
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-1.5 leading-relaxed">
              No genuine photographic sources matched your query across permitted web indexes. Aura will never fabricate synthetic AI images or substitute uncredited placeholders.
            </p>
          </div>
          <button
            onClick={() => setSimulateEmptyState(false)}
            className="px-4 py-2 rounded-xl liquid-pill text-zinc-900 dark:text-zinc-100 text-xs font-semibold transition-colors"
          >
            Show Example Verified Mountain Gallery
          </button>
        </div>
      ) : (
        /* Image Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayImages.map((img) => {
            const hasLoadFailed = failedImageIds.has(img.id);

            return (
              <div
                key={img.id}
                className="liquid-card rounded-3xl overflow-hidden flex flex-col group transition-all hover:border-blue-500/40"
              >
                {/* Image Container with aspect ratio */}
                <div className="relative aspect-[16/10] bg-black/10 dark:bg-black/40 overflow-hidden flex items-center justify-center">
                  {!hasLoadFailed ? (
                    <img
                      src={img.imageUrl}
                      alt={img.title}
                      loading="lazy"
                      onError={() => handleImageError(img.id)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="p-4 text-center space-y-1 text-zinc-500 dark:text-zinc-400">
                      <AlertCircle className="w-6 h-6 mx-auto text-amber-500" />
                      <p className="text-xs font-medium">Image unavailable from origin host</p>
                      <a
                        href={img.sourcePageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-blue-500 underline"
                      >
                        View on source page
                      </a>
                    </div>
                  )}

                  {!hasLoadFailed && (
                    <button
                      onClick={() => setSelectedPreviewImage(img)}
                      aria-label="Inspect high resolution image"
                      className="absolute bottom-3 right-3 p-2 rounded-xl bg-black/60 backdrop-blur-md text-white hover:bg-black/80 transition-colors opacity-0 group-hover:opacity-100"
                      title="View full dimensions"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Attribution and Metadata Box */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-50 leading-snug line-clamp-2">
                      {img.title}
                    </h4>
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1 line-clamp-2">
                      {img.attribution}
                    </p>
                  </div>

                <div className="pt-2.5 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">
                  <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>{img.sourceDomain}</span>
                  </div>

                  <a
                    href={img.sourcePageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
                    title="Visit origin webpage"
                  >
                    <span>Source Page</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
        </div>
      )}

      {/* Lightbox / Detail Modal */}
      {selectedPreviewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-lg animate-fade-in">
          <div className="w-full max-w-3xl liquid-card rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  {selectedPreviewImage.title}
                </h3>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                  Origin: {selectedPreviewImage.sourceDomain} • {selectedPreviewImage.dimensions?.width} × {selectedPreviewImage.dimensions?.height} px
                </span>
              </div>
              <button
                onClick={() => setSelectedPreviewImage(null)}
                className="px-3.5 py-1.5 rounded-xl liquid-pill text-zinc-800 dark:text-zinc-100 text-xs font-medium"
              >
                Close
              </button>
            </div>

            <div className="max-h-[60vh] rounded-2xl overflow-hidden bg-black/20 dark:bg-black/60 flex items-center justify-center">
              <img
                src={selectedPreviewImage.imageUrl}
                alt={selectedPreviewImage.title}
                className="max-h-[60vh] w-auto object-contain"
              />
            </div>

            <div className="flex items-center justify-between pt-2 text-xs text-zinc-600 dark:text-zinc-400">
              <span>{selectedPreviewImage.attribution}</span>
              <a
                href={selectedPreviewImage.imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
              >
                <span>Direct High-Res Link</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
