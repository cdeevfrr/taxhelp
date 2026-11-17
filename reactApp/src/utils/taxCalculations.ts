import type { FilingStatus, Lot } from "../Types";

export const TODAY = new Date('2026-11-13');

export function isLongTerm(dateStr: string) {
  if (!dateStr) return false;
  // I believe tax code would look at each day and check dates, not ms timestamps? 
  // This is probably close enough though, maybe users can only specify days not hours?
  let diffDays = (TODAY.getTime() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24);
  return diffDays >= 365;
}

/**
 * Sell as much as you can to maximize the jump in cost basis, unless/until
 * you start running into actual tax liability. If that happens, instead of 
 * selling low cost basis lots, sell high cost basis lots (reducing tax burden)
 * 
 * Balance things at 0 tax burden for as long as you can. 
 *  
 * @param param0 
 * @returns 
 */
export function calculateHarvestPlan({ 
  filingStatus, 
  ordinaryIncome, 
  qualifiedDividends, 
  assetPrice, 
  currentSellAmount, 
  lots 
}: {
  filingStatus: FilingStatus, 
  ordinaryIncome: number, 
  qualifiedDividends: number, 
  assetPrice: number, 
  currentSellAmount: number, 
  lots: Array<Lot>,
}) {
  
  let standardDeduction = filingStatus === 'single' ? 16100 : 32200;
  let zeroCeiling = filingStatus === 'single' ? 49450 : 98900;
  let grossCeiling = standardDeduction + zeroCeiling;
  let baselineIncome = ordinaryIncome + qualifiedDividends;

  // Filter & clone long-term lots for optimization
  let processedLots = lots.map(l => ({ ...l, sharesSold: 0 }));
  let ltLots = processedLots.filter(l => isLongTerm(l.date));
  ltLots.sort((a, b) => a.costBasis - b.costBasis); // Lowest cost basis first

  let remainingProceeds = currentSellAmount;
  let actualProceeds = 0;
  let totalRealizedGain = 0;

  let taxableBeforeGain = Math.max(0, baselineIncome - standardDeduction);
  let zeroHeadroom = Math.max(0, zeroCeiling - taxableBeforeGain);
  let realizedGainInZero = 0;
  let realizedGainSpill = 0;

  for (let lot of ltLots) {
    if (remainingProceeds <= 0) break;
    let lotMaxProceeds = lot.amount * assetPrice;
    let proceedsTaken = Math.min(remainingProceeds, lotMaxProceeds);
    let fraction = proceedsTaken / lotMaxProceeds;
    let sharesSold = lot.amount * fraction;

    // Update sharesSold on the corresponding lot reference
    let originalLot = processedLots.find(l => l.id === lot.id);
    if (originalLot) originalLot.sharesSold = sharesSold;

    actualProceeds += proceedsTaken;
    remainingProceeds -= proceedsTaken;

    let gainPerShare = Math.max(0, assetPrice - lot.costBasis);
    let lotGain = sharesSold * gainPerShare;
    totalRealizedGain += lotGain;

    if (zeroHeadroom > 0) {
      let inZero = Math.min(zeroHeadroom, lotGain);
      realizedGainInZero += inZero;
      zeroHeadroom -= inZero;
      let spill = lotGain - inZero;
      if (spill > 0) realizedGainSpill += spill;
    } else {
      realizedGainSpill += lotGain;
    }
  }

  let estimatedTax = realizedGainSpill * 0.15;
  let maxPortfolioVal = lots.reduce((sum, lot) => sum + (isLongTerm(lot.date) ? lot.amount * assetPrice : 0), 1000);
  let barScaleMax = Math.max(grossCeiling * 1.3, baselineIncome + totalRealizedGain * 1.1, 100000);

  return {
    processedLots,
    actualProceeds,
    totalRealizedGain,
    realizedGainInZero,
    realizedGainSpill,
    estimatedTax,
    grossCeiling,
    baselineIncome,
    maxPortfolioVal,
    barScaleMax
  };
}