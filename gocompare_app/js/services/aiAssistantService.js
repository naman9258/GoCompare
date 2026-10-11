/**
 * AI Travel Assistant Engine
 * Evaluates natural language user questions against real calculated transport routes.
 */

export class AIAssistantService {
  static answerQuery(query, activeOptions, contextMetadata) {
    if (!activeOptions || activeOptions.length === 0) {
      return {
        answer: "Please enter a pickup and destination to compare routes first. Once routes are loaded, I can analyze fares, travel times, walking distances, and mixed-mode alternatives for you!",
        matchingOptions: [],
        suggestedActions: ["Search Connaught Place to Cyber Hub"]
      };
    }

    const q = query.toLowerCase().trim();
    const sortedByPrice = [...activeOptions].sort((a, b) => a.averageFare - b.averageFare);
    const sortedByTime = [...activeOptions].sort((a, b) => a.durationMinutes - b.durationMinutes);
    const destinationName = contextMetadata?.destination?.name || 'your destination';

    // 1. Cheapest query
    if (q.includes('cheapest') || q.includes('lowest price') || q.includes('least expensive') || q.includes('budget')) {
      const best = sortedByPrice[0];
      const second = sortedByPrice[1];
      const fastest = sortedByTime[0];
      const diff = Math.round(fastest.averageFare - best.averageFare);

      return {
        answer: `The cheapest way to reach **${destinationName}** is **${best.name}** at just **${best.fareDisplay}** (${best.durationDisplay}).\n\nCompared to the fastest ride (${fastest.name} at ${fastest.fareDisplay}), you will save approximately **₹${diff}**!`,
        matchingOptions: [best, second].filter(Boolean),
        recommendedId: best.id,
        suggestedActions: [`Book / View ${best.name}`, `Show under ₹100`]
      };
    }

    // 2. Fastest query
    if (q.includes('fastest') || q.includes('quickest') || q.includes('least time') || q.includes('hurry') || q.includes('rush')) {
      const best = sortedByTime[0];
      const second = sortedByTime[1];
      const cheapest = sortedByPrice[0];
      const timeSaved = Math.round(cheapest.durationMinutes - best.durationMinutes);

      return {
        answer: `The fastest option to reach **${destinationName}** is **${best.name}**, taking only **${best.durationDisplay}** (${best.fareDisplay}).\n\nThis arrives approximately **${timeSaved} minutes sooner** than public transit options.`,
        matchingOptions: [best, second].filter(Boolean),
        recommendedId: best.id,
        suggestedActions: [`Book ${best.name}`, `Compare private rides`]
      };
    }

    // 3. Walking limit constraint (e.g. "I don't want to walk more than 500 meters" or "no walking")
    if (q.includes('walk') || q.includes('walking') || q.includes('stairs') || q.includes('accessible')) {
      const maxMeters = q.match(/(\d+)\s*(m|meter|metre)/i) ? parseInt(q.match(/(\d+)\s*(m|meter|metre)/i)[1]) : 500;
      const lowWalkOptions = activeOptions.filter(o => o.walkingDistanceMeters <= maxMeters);
      
      if (lowWalkOptions.length > 0) {
        const bestPrivate = lowWalkOptions.find(o => o.category === 'private');
        const bestMixed = lowWalkOptions.find(o => o.mode === 'mixed' || o.mode === 'auto');

        return {
          answer: `Here are the options with **≤ ${maxMeters} meters** of walking. All private cabs/autos provide direct doorstep drop-off with 0m walking. If you want savings without excessive walking, **${bestMixed?.name || bestPrivate?.name}** is optimal.`,
          matchingOptions: lowWalkOptions.slice(0, 4),
          recommendedId: bestPrivate?.id,
          suggestedActions: [`Show Direct Cabs`, `Filter ≤ 500m walk`]
        };
      } else {
        return {
          answer: `Most public transit options require walking between stations. Direct private rides (Uber, Ola, Rapido) offer 0 walking straight to your doorstep.`,
          matchingOptions: activeOptions.filter(o => o.category === 'private').slice(0, 3),
          suggestedActions: [`Book Uber Go`, `Book Rapido Auto`]
        };
      }
    }

    // 4. Budget limit (e.g. "under ₹200", "under 150", "less than 100")
    const priceMatch = q.match(/(under|below|less than|within)\s*₹?\s*(\d+)/i);
    if (priceMatch) {
      const budget = parseInt(priceMatch[2]);
      const affordable = activeOptions.filter(o => o.averageFare <= budget);

      if (affordable.length > 0) {
        const fastestAffordable = [...affordable].sort((a, b) => a.durationMinutes - b.durationMinutes)[0];
        return {
          answer: `Found **${affordable.length} options** under **₹${budget}**. The fastest among them is **${fastestAffordable.name}** at **${fastestAffordable.fareDisplay}** taking **${fastestAffordable.durationDisplay}**.`,
          matchingOptions: affordable.slice(0, 4),
          recommendedId: fastestAffordable.id,
          suggestedActions: [`Book ${fastestAffordable.name}`, `Sort by price`]
        };
      } else {
        return {
          answer: `No options found strictly under ₹${budget}. The closest budget option is **${sortedByPrice[0].name}** at **${sortedByPrice[0].fareDisplay}**.`,
          matchingOptions: [sortedByPrice[0]],
          recommendedId: sortedByPrice[0].id
        };
      }
    }

    // 5. Transfers / Changes (e.g. "fewest changes", "no transfers", "direct route")
    if (q.includes('change') || q.includes('transfer') || q.includes('interchange') || q.includes('direct')) {
      const directOptions = activeOptions.filter(o => o.transfers === 0);
      const cheapestDirect = [...directOptions].sort((a, b) => a.averageFare - b.averageFare)[0];

      return {
        answer: `There are **${directOptions.length} direct options** with **0 transfers**. The most cost-effective direct route is **${cheapestDirect.name}** at **${cheapestDirect.fareDisplay}** (${cheapestDirect.durationDisplay}).`,
        matchingOptions: directOptions.slice(0, 4),
        recommendedId: cheapestDirect.id,
        suggestedActions: [`View ${cheapestDirect.name}`, `Compare direct options`]
      };
    }

    // 6. AC / Comfort
    if (q.includes('ac') || q.includes('air condition') || q.includes('comfort') || q.includes('hot')) {
      const acOptions = activeOptions.filter(o => o.isAC);
      const cheapestAC = [...acOptions].sort((a, b) => a.averageFare - b.averageFare)[0];

      return {
        answer: `For comfortable air-conditioned travel, **${cheapestAC.name}** is the most affordable at **${cheapestAC.fareDisplay}**, while **Uber Go** or **Delhi Metro** both provide 100% chilled AC rides.`,
        matchingOptions: acOptions.slice(0, 4),
        recommendedId: cheapestAC.id,
        suggestedActions: [`Book AC Cab`, `View Metro Route`]
      };
    }

    // Default fallback - general smart synthesis
    const cheapest = sortedByPrice[0];
    const fastest = sortedByTime[0];
    const mixed = activeOptions.find(o => o.mode === 'mixed');

    return {
      answer: `Here is the trade-off summary for your journey to **${destinationName}**:\n\n• **Cheapest**: ${cheapest.name} at ${cheapest.fareDisplay} (${cheapest.durationDisplay})\n• **Fastest**: ${fastest.name} at ${fastest.fareDisplay} (${fastest.durationDisplay})\n• **Best Value Hybrid**: ${mixed?.name || 'Metro'} at ${mixed?.fareDisplay || cheapest.fareDisplay}\n\nWhat would you prioritize: lowest cost, fastest time, or door-to-door comfort?`,
      matchingOptions: [fastest, cheapest, mixed].filter(Boolean),
      suggestedActions: ["Cheapest option", "Fastest route", "Options under ₹200", "Zero transfers"]
    };
  }
}
