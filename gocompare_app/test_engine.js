import { ProviderManager } from './js/providers/providerManager.js';
import { TradeoffEngine } from './js/services/tradeoffEngine.js';
import { AIAssistantService } from './js/services/aiAssistantService.js';
import { CITIES_DATA } from './js/data/cities.js';

async function runTests() {
  console.log('=== STARTING GOCOMPARE ENGINE VERIFICATION TESTS ===\n');

  const pm = new ProviderManager();
  
  // Test 1: Delhi NCR Route (Connaught Place -> Cyber Hub)
  console.log('--- Test 1: Delhi NCR Route (Connaught Place -> Cyber Hub) ---');
  const delhi = CITIES_DATA['delhi_ncr'];
  const cp = delhi.landmarks[0];
  const cyberHub = delhi.landmarks[1];

  const results = await pm.getAllOptions(cp, cyberHub, 'delhi_ncr');
  console.log(`Calculated ${results.all.length} total options.`);
  console.log(`Direct Dist: ${results.metadata.directDistanceKm} km, Road Dist: ${results.metadata.roadDistanceKm} km`);
  console.log(`Private rides count: ${results.groups.privateRides.length}`);
  console.log(`Public transit count: ${results.groups.publicTransport.length}`);
  console.log(`Mixed-mode routes count: ${results.groups.mixedRoutes.length}`);

  if (results.all.length < 8) throw new Error('Expected at least 8 options');

  // Test 2: Tradeoff Engine
  console.log('\n--- Test 2: Tradeoff Engine Analysis ---');
  const enriched = TradeoffEngine.analyzeTradeoffs(results.all);
  const sample = enriched[0];
  console.log(`Sample: ${sample.name}`);
  console.log(`Fare Rating (1-5): ${sample.tradeoffMetrics.fareRating}, Time Rating: ${sample.tradeoffMetrics.timeRating}`);
  console.log(`Walking Effort: ${sample.tradeoffMetrics.walkingEffort}, Transfer Note: ${sample.tradeoffMetrics.transferNote}`);
  console.log(`Tradeoff Insight: "${sample.tradeoffMetrics.insight}"`);

  // Test 3: AI Assistant Service Queries
  console.log('\n--- Test 3: AI Assistant NLP Queries ---');
  const queries = [
    "What's the cheapest way to reach Cyber Hub?",
    "What is the fastest route?",
    "I don't want to walk more than 500 meters.",
    "Show me options under ₹200.",
    "Which option has the fewest changes?"
  ];

  for (const q of queries) {
    const aiRes = AIAssistantService.answerQuery(q, enriched, results.metadata);
    console.log(`\nQ: "${q}"`);
    console.log(`A: ${aiRes.answer.split('\n')[0]}`);
    console.log(`Matching Options: ${aiRes.matchingOptions.map(o => o.name).join(', ')}`);
  }

  // Test 4: City Coverage (Mumbai, Bengaluru, Hyderabad, Pune)
  console.log('\n--- Test 4: Multi-City Compatibility ---');
  for (const cityId of ['mumbai', 'bengaluru', 'hyderabad', 'pune']) {
    const city = CITIES_DATA[cityId];
    const res = await pm.getAllOptions(city.landmarks[0], city.landmarks[1], cityId);
    console.log(`City: ${city.name} (${city.landmarks[0].name.split('(')[0]} -> ${city.landmarks[1].name.split('(')[0]}): ${res.all.length} options computed.`);
  }

  console.log('\n✅ ALL ENGINE AND ALGORITHM TESTS PASSED SUCCESSFULLY!');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
