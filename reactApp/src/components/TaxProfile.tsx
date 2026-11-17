import type { FilingStatus } from "../Types";

export default function TaxProfile({ 
    filingStatus, 
    ordinaryIncome, 
    qualifiedDividends, 
    onChange 
}: {
    filingStatus: FilingStatus,
    ordinaryIncome: number,
    qualifiedDividends: number,
    onChange: (key: string, value: any) => void // Currently untyped, should be typed eventually.
}) {
  return (
    <section className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-6 shadow-lg mb-8">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center justify-between">
        <span>1. Tax Profile (2026)</span>
        <span className="text-xs bg-indigo-900 text-indigo-200 px-2.5 py-1 rounded-full font-medium">2026 IRS Rules</span>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Filing Status</label>
          <select 
            value={filingStatus} 
            onChange={(e) => onChange('filingStatus', e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="single">Single</option>
            <option value="married">Married Filing Jointly</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Expected Ordinary Income ($)</label>
          <input 
            type="number" 
            value={ordinaryIncome} 
            min="0" 
            step="500" 
            onChange={(e) => onChange('ordinaryIncome', parseFloat(e.target.value) || 0)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Expected Qualified Dividends ($)</label>
          <input 
            type="number" 
            value={qualifiedDividends} 
            min="0" 
            step="100" 
            onChange={(e) => onChange('qualifiedDividends', parseFloat(e.target.value) || 0)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
      </div>
    </section>
  );
}