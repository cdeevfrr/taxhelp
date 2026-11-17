import type { Lot } from '../Types';
import { isLongTerm } from '../utils/taxCalculations';

export default function AssetCard(
  { lots,
    soldAmounts,
    assetPrice, 
    onAssetPriceChange, 
    onUpdateLot, 
    onAddLot, 
    onRemoveLot,
  }: {
    lots: Array<Lot>,
    soldAmounts: {[lotId: string]: number }
    assetPrice: number,
    onAssetPriceChange: (newVal: number) => void,
    onUpdateLot: (lot: Partial<Lot> & Pick<Lot, 'id'>) => void,
    onRemoveLot: (lotId: Lot['id']) => void,
    onAddLot: () => void,
  }) {
  return (
    <section className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-6 shadow-lg mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">2. Asset & Lot Inventory</h2>
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-slate-300">Current Asset Price ($/sh):</label>
          <input 
            type="number" 
            value={assetPrice} 
            min="0.01" 
            step="0.01" 
            onChange={(e) => onAssetPriceChange(parseFloat(e.target.value) || 0)}
            className="w-28 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-700 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-3">Purchase Date</th>
              <th className="py-3 px-3">Shares Owned</th>
              <th className="py-3 px-3">Cost Basis ($/sh)</th>
              <th className="py-3 px-3">Term</th>
              <th className="py-3 px-3">Shares Sold Under Plan</th>
              <th className="py-3 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50 text-sm">
            {lots.map((lot) => {
              const lt = isLongTerm(lot.date);
              return (
                <tr key={lot.id} className="hover:bg-slate-700/20">
                  <td className="py-3 px-3">
                    <input 
                      type="date" 
                      value={lot.date} 
                      onChange={(e) => onUpdateLot({id: lot.id, date:  e.target.value})} 
                      className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                    />
                  </td>
                  <td className="py-3 px-3">
                    <input 
                      type="number" 
                      value={lot.amount} 
                      min="0.001" 
                      step="any" 
                      onChange={(e) => onUpdateLot({id: lot.id, amount: parseFloat(e.target.value) || 0})} 
                      className="w-24 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                    />
                  </td>
                  <td className="py-3 px-3">
                    <input 
                      type="number" 
                      value={lot.costBasis} 
                      min="0" 
                      step="0.01" 
                      onChange={(e) => onUpdateLot({id: lot.id, costBasis:  parseFloat(e.target.value) || 0})} 
                      className="w-24 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                    />
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${lt ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'}`}>
                      {lt ? 'Long-Term' : 'Short-Term (Bypassed)'}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-indigo-300 font-semibold">
                    {(soldAmounts[lot.id] || 0).toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button 
                      onClick={() => onRemoveLot(lot.id)} 
                      className="text-rose-400 hover:text-rose-300 text-xs px-2 py-1 rounded bg-rose-950/40 border border-rose-900/50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <button 
          onClick={onAddLot} 
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition shadow"
        >
          + Add Lot
        </button>
      </div>
    </section>
  );
}