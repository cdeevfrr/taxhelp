import type { calculateHarvestPlan } from "../utils/taxCalculations";

export default function HarvestSimulator({
    currentSellAmount,
    maxPortfolioVal,
    onSliderChange,
    calculatedPlan
}: {
    currentSellAmount: number,
    maxPortfolioVal: number,
    onSliderChange: (newSellAmount: number) => void,
    calculatedPlan: ReturnType<typeof calculateHarvestPlan>
}) {
  const { 
    actualProceeds, 
    totalRealizedGain, 
    realizedGainInZero, 
    realizedGainSpill, 
    estimatedTax, 
    grossCeiling, 
    baselineIncome, 
    barScaleMax 
  } = calculatedPlan;

  const baselineWidth = Math.min(100, (baselineIncome / barScaleMax) * 100);
  const zeroGainWidth = Math.max(0, Math.min(100 - baselineWidth, (realizedGainInZero / barScaleMax) * 100));
  const spillWidth = Math.max(0, (realizedGainSpill / barScaleMax) * 100);

  return (
    <section className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-6">3. Harvest Simulator</h2>

      {/* Slider Control */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-slate-300">Target Amount to Sell (Proceeds):</label>
          <span className="text-lg font-mono font-bold text-indigo-300">
            ${currentSellAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
          </span>
        </div>
        <input 
          type="range" 
          value={currentSellAmount} 
          min="0" 
          max={maxPortfolioVal} 
          step="10" 
          onChange={(e) => onSliderChange(parseFloat(e.target.value) || 0)}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />
        <div className="flex justify-between text-[11px] text-slate-400 mt-1">
          <span>$0</span>
          <span>Max Portfolio Value: ${Math.round(maxPortfolioVal).toLocaleString()}</span>
        </div>
      </div>

      {/* Tax Bar Visualization */}
      <div className="mb-8 bg-slate-900/90 border border-slate-700 rounded-xl p-4">
        <div className="text-xs font-semibold text-slate-300 mb-2 flex justify-between">
          <span>Income & Tax Stacking Visualization</span>
          <span className="text-slate-400">Anchored at Standard Deduction</span>
        </div>

        <div className="relative h-12 bg-slate-800 rounded-lg overflow-hidden flex border border-slate-700">
          <div className="h-full bg-slate-600 transition-all duration-150 flex items-center justify-center text-[10px] font-bold text-slate-200 overflow-hidden px-1" style={{ width: `${baselineWidth}%` }}>
            {baselineWidth > 10 && `Baseline ($${baselineIncome.toLocaleString()})`}
          </div>
          <div className="h-full bg-emerald-600 transition-all duration-150 flex items-center justify-center text-[10px] font-bold text-white overflow-hidden px-1" style={{ width: `${zeroGainWidth}%` }}>
            {zeroGainWidth > 5 && `0% Gain ($${Math.round(realizedGainInZero).toLocaleString()})`}
          </div>
          <div className="h-full bg-amber-600 transition-all duration-150 flex items-center justify-center text-[10px] font-bold text-white overflow-hidden px-1" style={{ width: `${spillWidth}%` }}>
            {spillWidth > 5 && `15% Spill ($${Math.round(realizedGainSpill).toLocaleString()})`}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 mt-3 text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-slate-600 inline-block"></span> Ordinary / Div</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-600 inline-block"></span> 0% Tax Gain</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-600 inline-block"></span> 15% Tax Spillover</span>
          </div>
          <div className="font-mono text-[11px] text-indigo-300">
            0% Ceiling Limit: ${grossCeiling.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Summary Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-700/60 rounded-xl p-4 text-center">
          <div className="text-xs text-slate-400 mb-1">Total Proceeds</div>
          <div className="text-xl font-mono font-bold text-white">
            ${actualProceeds.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-700/60 rounded-xl p-4 text-center">
          <div className="text-xs text-slate-400 mb-1">Realized Capital Gain</div>
          <div className="text-xl font-mono font-bold text-emerald-400">
            ${totalRealizedGain.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-700/60 rounded-xl p-4 text-center">
          <div className="text-xs text-slate-400 mb-1">Estimated Federal LTCG Tax</div>
          <div className={`text-xl font-mono font-bold ${estimatedTax > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
            ${estimatedTax.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
          </div>
        </div>
      </div>
    </section>
  );
}