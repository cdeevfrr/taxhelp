import { useState } from 'react';
import Disclaimer from './components/Disclaimer';
import TaxProfile from './components/TaxProfile';
import AssetCard from './components/AssetCard';
import HarvestSimulator from './components/HarvestSimulator';
import { calculateHarvestPlan } from './utils/taxCalculations';
import type { FilingStatus, Lot } from './Types';
import './App.css'

export default function App() {
  const [state, setState] = useState({
    filingStatus: 'single' as FilingStatus,
    ordinaryIncome: 30000,
    qualifiedDividends: 5000,
    assetPrice: 150.00,
    currentSellAmount: 12000,
    lots: [
      { id: '1', date: '2023-04-15', amount: 100, costBasis: 60.00 },
      { id: '2', date: '2024-08-10', amount: 80, costBasis: 110.00 },
      { id: '3', date: '2026-02-01', amount: 50, costBasis: 140.00 }
    ] as Array<Lot>
  });

  // Handlers
  // Crazy untyped handler leftover from when this was ported from javascript. 
  // Clean it up and type it if you feel like it.
  const handleProfileChange = (field: string, value: any) => {
    setState(prev => ({ ...prev, [field]: value }));
  };

  const handleAssetPriceChange = (price: number) => {
    setState(prev => ({ ...prev, assetPrice: price }));
  };

  const handleSliderChange = (val: number) => {
    setState(prev => ({ ...prev, currentSellAmount: val }));
  };

  const handleAddLot = () => {
    setState(prev => {
      const newId = Math.random().toString()
      return {
        ...prev,
        lots: [...prev.lots, { id: newId, date: '2024-01-01', amount: 50, costBasis: 100.00 }]
      };
    });
  };

  const handleRemoveLot = (id: Lot['id']) => {
    setState(prev => ({
      ...prev,
      lots: prev.lots.filter(l => l.id !== id)
    }));
  };

  const handleUpdateLot = (update: Partial<Lot> & Pick<Lot, 'id'>) => {
    setState(prev => ({
      ...prev,
      lots: prev.lots.map(lot => lot.id === update.id ? { ...lot, ...update } : lot)
    }));
  };

  // Run calculation engine
  const calculationResults = calculateHarvestPlan({
    assetPrice: state.assetPrice,
    currentSellAmount: state.currentSellAmount,
    filingStatus: state.filingStatus,
    lots: state.lots,
    ordinaryIncome: state.ordinaryIncome,
    qualifiedDividends: state.qualifiedDividends,
  });

  // Sync lots with calculated shares sold
  const finalLots = calculationResults.processedLots;
  const soldAmounts = Object.fromEntries(
    finalLots.map(lot_ish => [lot_ish.id, lot_ish.sharesSold])
  )
  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen font-sans antialiased">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Capital Gains Harvest Calculator</h1>
          <p className="text-slate-400 text-sm">Optimize your 0% long-term capital gains tax bracket (React Modular Version).</p>
        </header>

        <Disclaimer />

        <TaxProfile 
          filingStatus={state.filingStatus}
          ordinaryIncome={state.ordinaryIncome}
          qualifiedDividends={state.qualifiedDividends}
          onChange={handleProfileChange}
        />

        <AssetCard 
          lots={finalLots}
          soldAmounts={soldAmounts}
          assetPrice={state.assetPrice}
          onAssetPriceChange={handleAssetPriceChange}
          onUpdateLot={handleUpdateLot}
          onAddLot={handleAddLot}
          onRemoveLot={handleRemoveLot}
        />

        <HarvestSimulator 
          currentSellAmount={state.currentSellAmount}
          maxPortfolioVal={calculationResults.maxPortfolioVal}
          onSliderChange={handleSliderChange}
          calculatedPlan={calculationResults}
        />
      </div>
    </div>
  );
}