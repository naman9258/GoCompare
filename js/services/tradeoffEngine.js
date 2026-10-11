/**
 * Trade-Off Engine
 * Quantifies and visually highlights trade-offs between:
 * PRICE ↔ TIME ↔ CONVENIENCE ↔ WALKING ↔ TRANSFERS
 */

export class TradeoffEngine {
  static analyzeTradeoffs(options) {
    if (!options || !options.length) return [];

    const minFare = Math.min(...options.map(o => o.averageFare));
    const maxFare = Math.max(...options.map(o => o.averageFare));
    const minTime = Math.min(...options.map(o => o.durationMinutes));
    const maxTime = Math.max(...options.map(o => o.durationMinutes));

    const fastestOpt = options.find(o => o.durationMinutes === minTime);
    const cheapestOpt = options.find(o => o.averageFare === minFare);

    return options.map(opt => {
      // Relative ratios (0.0 to 1.0, lower is better)
      const fareRatio = maxFare > minFare ? (opt.averageFare - minFare) / (maxFare - minFare) : 0.5;
      const timeRatio = maxTime > minTime ? (opt.durationMinutes - minTime) / (maxTime - minTime) : 0.5;
      
      // Walking hassle
      let walkingEffort = 'None';
      if (opt.walkingMinutes > 10) walkingEffort = 'High';
      else if (opt.walkingMinutes > 5) walkingEffort = 'Moderate';
      else if (opt.walkingMinutes > 0) walkingEffort = 'Low';

      // Transfer hassle
      let transferNote = 'Direct (0 transfers)';
      if (opt.transfers === 1) transferNote = '1 interchange';
      else if (opt.transfers > 1) transferNote = `${opt.transfers} transfers`;

      // Trade-off insight generation
      let insight = '';
      const moneySavedVsFastest = fastestOpt ? Math.round(fastestOpt.averageFare - opt.averageFare) : 0;
      const extraTimeVsFastest = fastestOpt ? Math.round(opt.durationMinutes - fastestOpt.durationMinutes) : 0;
      const timeSavedVsCheapest = cheapestOpt ? Math.round(cheapestOpt.durationMinutes - opt.durationMinutes) : 0;
      const extraMoneyVsCheapest = cheapestOpt ? Math.round(opt.averageFare - cheapestOpt.averageFare) : 0;

      if (opt.id === cheapestOpt?.id && opt.id === fastestOpt?.id) {
        insight = '🏆 The Unicorn: Both the fastest AND the cheapest way to travel!';
      } else if (opt.id === cheapestOpt?.id) {
        insight = `💰 Lowest possible fare. Takes ${extraTimeVsFastest} min longer than ${fastestOpt?.name}.`;
      } else if (opt.id === fastestOpt?.id) {
        insight = `⚡ Fastest arrival. Costs ₹${extraMoneyVsCheapest} more than ${cheapestOpt?.name}.`;
      } else if (moneySavedVsFastest > 100 && extraTimeVsFastest <= 20) {
        insight = `🌟 Sweet Spot: Save ₹${moneySavedVsFastest} for just ${extraTimeVsFastest} min extra travel.`;
      } else if (opt.transfers === 0 && opt.walkingMinutes === 0) {
        insight = `🛋️ Maximum Convenience: Door-to-door direct ride with zero walking.`;
      } else if (opt.mode === 'mixed') {
        insight = `🔄 Hybrid Balance: Combines rapid transit speed with doorstep auto drop.`;
      } else {
        insight = `Balanced choice with ${opt.isAC ? 'air-conditioning' : 'good value'}.`;
      }

      opt.tradeoffMetrics = {
        fareRating: Math.max(1, Math.min(5, Math.round(5 - fareRatio * 4))), // 5 is cheapest
        timeRating: Math.max(1, Math.min(5, Math.round(5 - timeRatio * 4))), // 5 is fastest
        walkingEffort,
        transferNote,
        moneySavedVsFastest,
        extraTimeVsFastest,
        timeSavedVsCheapest,
        extraMoneyVsCheapest,
        insight
      };

      return opt;
    });
  }
}
