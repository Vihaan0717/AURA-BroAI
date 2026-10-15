import React, { useState } from 'react';
import { ShoppingResultPayload, ProductAttributeComparison } from '@private-browser/shared';
import {
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  Wrench,
  Truck,
  RotateCcw,
} from 'lucide-react';

interface ShoppingViewProps {
  data: ShoppingResultPayload;
}

export const ShoppingView: React.FC<ShoppingViewProps> = ({ data }) => {
  const [selectedProductId, setSelectedProductId] = useState<string>(data.products[0]?.id || '');
  const activeProduct = data.products.find((p) => p.id === selectedProductId) || data.products[0];

  const getDurabilityBadge = (basis: ProductAttributeComparison['durability']['evidenceBasis']) => {
    switch (basis) {
      case 'independent_testing':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/25">
            Independent Lab Teardown & Stress Test
          </span>
        );
      case 'recurring_owner_reports':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/25">
            Recurring Long-Term Owner Reports
          </span>
        );
      case 'manufacturer_claims':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-blue-500/15 text-blue-800 dark:text-blue-300 border border-blue-500/25">
            Manufacturer Marketing Spec (Unverified)
          </span>
        );
      case 'limited_inference':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-purple-500/15 text-purple-800 dark:text-purple-300 border border-purple-500/25">
            Limited Structural Inference
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Summary */}
      <div className="liquid-card rounded-3xl p-6 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-black/5 dark:border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                Shopping Intelligence Matrix
              </h2>
              <span className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                {data.budgetFit}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap self-start sm:self-center">
            <span className="text-[10px] font-mono px-2.5 py-1 rounded-full liquid-pill">
              Zero Sponsored Placements
            </span>
            <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30">
              {data.isLivePricing ? 'Live Retailer Verification' : 'Reference Catalog (Unverified Live Quote)'}
            </span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
          {data.comparisonSummary}
        </p>

        {/* Product Selector Tabs */}
        <div className="flex flex-wrap gap-2 mt-5">
          {data.products.map((prod) => (
            <button
              key={prod.id}
              onClick={() => setSelectedProductId(prod.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedProductId === prod.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'liquid-pill text-zinc-800 dark:text-zinc-200'
              }`}
            >
              <span>{prod.brand} {prod.name.split(' ')[1]}</span>
              <span className="font-mono text-[11px] opacity-90">{prod.price.formatted}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Product Detailed Breakdown */}
      {activeProduct && (
        <div className="space-y-6 animate-fade-in">
          {/* Main Specs & Retailer Options Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Product Identity & Specifications */}
            <div className="lg:col-span-2 liquid-card rounded-3xl p-6 sm:p-7 space-y-5">
              <div>
                <span className="text-xs font-mono text-emerald-700 dark:text-emerald-400 uppercase tracking-wider font-semibold">
                  Verified Variant: {activeProduct.modelVariant}
                </span>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mt-1">
                  {activeProduct.name}
                </h3>
              </div>

              {/* Exact Specs Table */}
              <div>
                <h4 className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-2.5">
                  Technical Specifications
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {Object.entries(activeProduct.specs).map(([specKey, specVal]) => (
                    <div
                      key={specKey}
                      className="p-3 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/5 dark:border-white/5 flex flex-col justify-between"
                    >
                      <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">{specKey}</span>
                      <span className="font-medium text-zinc-900 dark:text-zinc-100 mt-0.5">{specVal}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Warranty & Return Policies */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-black/5 dark:border-white/5 text-xs">
                <div className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">Warranty Coverage</span>
                    <p className="text-zinc-600 dark:text-zinc-300 text-[11px] mt-0.5">{activeProduct.warranty}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <RotateCcw className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">Return Policy</span>
                    <p className="text-zinc-600 dark:text-zinc-300 text-[11px] mt-0.5">{activeProduct.returnPolicy}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col: Verified Retailers & Pricing */}
            <div className="liquid-card rounded-3xl p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                    Authorized Retailers
                  </h4>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono font-semibold">INR Pricing</span>
                </div>

                <div className="space-y-3">
                  {activeProduct.retailers.map((ret, idx) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        ret.isRecommended
                          ? 'bg-emerald-500/10 border-emerald-500/30'
                          : 'bg-black/[0.03] dark:bg-white/[0.04] border-black/5 dark:border-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                          {ret.name}
                        </span>
                        <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300">
                          {ret.listedPrice}
                        </span>
                      </div>
                      {ret.reason && (
                        <p className="text-[11px] text-zinc-600 dark:text-zinc-300 mt-1.5 leading-snug">
                          {ret.reason}
                        </p>
                      )}
                      <div className="mt-2 pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[10px] text-zinc-500 dark:text-zinc-400">
                        <span>Reliability: {ret.reliabilityRating} / 5.0</span>
                        <a
                          href={ret.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 hover:underline font-medium"
                        >
                          <span>Store Link</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {activeProduct.deliveryNotes && (
                <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/5 flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-300">
                  <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span className="text-[11px]">{activeProduct.deliveryNotes}</span>
                </div>
              )}
            </div>
          </div>

          {/* Praise vs Complaints & Durability Teardown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Praise & Complaints */}
            <div className="liquid-card rounded-3xl p-6 sm:p-7 space-y-4">
              <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                Recurring Praise & Common Complaints
              </h4>
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 mb-2">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Consistent Positive Feedback</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-[11px] text-zinc-800 dark:text-zinc-200 pl-1 leading-relaxed">
                    {activeProduct.recurringPraise.map((pr, i) => (
                      <li key={i}>{pr}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-red-800 dark:text-red-300 mb-2">
                    <ThumbsDown className="w-3.5 h-3.5" />
                    <span>Documented Owner Complaints</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-[11px] text-zinc-800 dark:text-zinc-200 pl-1 leading-relaxed">
                    {activeProduct.commonComplaints.map((co, i) => (
                      <li key={i}>{co}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Durability Assessment */}
            <div className="liquid-card rounded-3xl p-6 sm:p-7 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    Durability & Repairability Verdict
                  </h4>
                </div>
                <div className="mb-2.5">
                  {getDurabilityBadge(activeProduct.durability.evidenceBasis)}
                </div>
                <p className="text-xs text-zinc-900 dark:text-zinc-100 leading-relaxed font-semibold">
                  {activeProduct.durability.verdict}
                </p>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-300 leading-relaxed mt-2">
                  {activeProduct.durability.explanation}
                </p>
              </div>

              {/* Review Manipulation Risk Signals */}
              {activeProduct.reviewRiskSignals && activeProduct.reviewRiskSignals.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-900 dark:text-amber-200">
                  <div className="flex items-center gap-1.5 font-semibold text-amber-800 dark:text-amber-300 mb-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Review Anomaly Risk Signal</span>
                  </div>
                  <p className="text-[11px] text-amber-800/90 dark:text-amber-200/80 leading-relaxed">
                    {activeProduct.reviewRiskSignals[0]}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Recommendation Rationale */}
          <div className="liquid-card rounded-3xl p-6 sm:p-7 space-y-4">
            <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
              Transparent Recommendation Rationale
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/5 dark:border-white/5">
                <span className="font-semibold text-zinc-900 dark:text-zinc-100 block mb-1">Why It Matches</span>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  {activeProduct.recommendationBreakdown.whyItMatches}
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/5 dark:border-white/5">
                <span className="font-semibold text-emerald-800 dark:text-emerald-300 block mb-1">Credible Advantages</span>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-zinc-600 dark:text-zinc-300 pl-1">
                  {activeProduct.recommendationBreakdown.credibleAdvantages.map((adv, i) => (
                    <li key={i}>{adv}</li>
                  ))}
                </ul>
              </div>
              <div className="p-3.5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/5 dark:border-white/5">
                <span className="font-semibold text-amber-800 dark:text-amber-300 block mb-1">Key Trade-offs</span>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-zinc-600 dark:text-zinc-300 pl-1">
                  {activeProduct.recommendationBreakdown.keyTradeOffs.map((tro, i) => (
                    <li key={i}>{tro}</li>
                  ))}
                </ul>
              </div>
              <div className="p-3.5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/5 dark:border-white/5">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">Unverified Information</span>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-zinc-500 dark:text-zinc-400 pl-1">
                  {activeProduct.recommendationBreakdown.unverifiedAttributes.map((unv, i) => (
                    <li key={i}>{unv}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
