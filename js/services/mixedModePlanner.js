import { TransportationOption } from '../models.js';

export class MixedModePlanner {
  generateMixedOptions(origin, destination, metroOptions, privateOptions, distanceKm, durationMinutes) {
    const results = [];
    const metroOpt = metroOptions[0];
    if (!metroOpt) return results;

    // 1. Metro + Auto Last-Mile (Smart Saver)
    const metroFare = metroOpt.estimatedFareMin;
    const autoLastMileDistance = Math.min(4.0, Math.max(1.8, distanceKm * 0.25));
    const autoFare = Math.round(35 + autoLastMileDistance * 11);
    const autoTime = Math.round(autoLastMileDistance * 2.6);
    const combinedFare = metroFare + autoFare;
    
    // Train time without dest walk + auto time
    const metroTrainTime = Math.max(15, metroOpt.durationMinutes - metroOpt.walkingMinutes);
    const firstMileWalkMins = Math.round(metroOpt.walkingMinutes * 0.4);
    const totalDuration = firstMileWalkMins + metroTrainTime + autoTime + 3; // 3 min auto boarding

    const steps1 = [
      {
        stepNumber: 1,
        type: 'walk',
        mode: 'walk',
        instruction: `Walk ${firstMileWalkMins} min to nearest Metro Station`,
        durationMinutes: firstMileWalkMins,
        distanceMeters: firstMileWalkMins * 70
      },
      {
        stepNumber: 2,
        type: 'metro',
        mode: 'metro',
        instruction: `Metro Trunk Journey (${metroOpt.name})`,
        subtext: `Avoid highway congestion. Rapid transit over ${Math.round(distanceKm * 0.75)} km`,
        durationMinutes: metroTrainTime,
        lineName: 'High Speed Metro Line'
      },
      {
        stepNumber: 3,
        type: 'transfer',
        mode: 'transfer',
        instruction: `Exit station to Auto Rickshaw Stand (3 min)`,
        durationMinutes: 3
      },
      {
        stepNumber: 4,
        type: 'auto',
        mode: 'auto',
        instruction: `Take Auto for last ${autoLastMileDistance.toFixed(1)} km to doorstep`,
        subtext: `Drop off right at ${destination.name.split('(')[0].trim()}`,
        durationMinutes: autoTime,
        distanceKm: autoLastMileDistance
      }
    ];

    results.push(new TransportationOption({
      id: 'mixed_metro_auto',
      category: 'mixed',
      provider: 'Metro + Auto',
      mode: 'mixed',
      name: '🚇 Metro + 🛺 Auto (Last-Mile)',
      vehicleType: 'Transit Train + Auto Rickshaw',
      estimatedFareMin: combinedFare - 5,
      estimatedFareMax: combinedFare + 10,
      durationMinutes: totalDuration,
      distanceKm: distanceKm,
      walkingMinutes: firstMileWalkMins,
      walkingDistanceMeters: firstMileWalkMins * 70,
      transfers: 1,
      availability: 'High',
      surgeMultiplier: 1.0,
      rating: 4.8,
      badges: ['Smart Saver', '65% Cheaper than Cab', 'Zero Traffic Delay'],
      tagline: 'High-speed metro for the long stretch + direct auto to your door',
      route: metroOpt.route,
      routeSteps: steps1,
      convenienceScore: 89,
      ecoScore: 85
    }));

    // 2. Bus + Metro Express (Cheapest Mixed Journey)
    const busFare = 15;
    const busMetroFare = metroFare + busFare;
    const busFeederTime = 14;
    const busMetroDuration = metroTrainTime + busFeederTime + 8;

    const steps2 = [
      {
        stepNumber: 1,
        type: 'bus',
        mode: 'bus',
        instruction: `Board local feeder bus towards Metro Interchange (14 min)`,
        durationMinutes: busFeederTime,
        lineName: 'City Feeder Bus'
      },
      {
        stepNumber: 2,
        type: 'transfer',
        mode: 'transfer',
        instruction: `Transfer to Metro Station Platform (4 min walk)`,
        durationMinutes: 4
      },
      {
        stepNumber: 3,
        type: 'metro',
        mode: 'metro',
        instruction: `Metro Express train to destination terminal`,
        durationMinutes: metroTrainTime,
        lineName: 'Metro Transit'
      },
      {
        stepNumber: 4,
        type: 'walk',
        mode: 'walk',
        instruction: `Walk 4 min (300 m) to final destination`,
        durationMinutes: 4,
        distanceMeters: 300
      }
    ];

    results.push(new TransportationOption({
      id: 'mixed_bus_metro',
      category: 'mixed',
      provider: 'Bus + Metro',
      mode: 'mixed',
      name: '🚌 Bus + 🚇 Metro Express',
      vehicleType: 'City Feeder Bus + Metro Train',
      estimatedFareMin: busMetroFare - 5,
      estimatedFareMax: busMetroFare + 5,
      durationMinutes: busMetroDuration,
      distanceKm: distanceKm,
      walkingMinutes: 6,
      walkingDistanceMeters: 450,
      transfers: 1,
      availability: 'High',
      surgeMultiplier: 1.0,
      rating: 4.5,
      badges: ['Budget Champion', 'High Frequency'],
      tagline: 'Ultra-low cost combination for long distance city travel',
      route: metroOpt.route,
      routeSteps: steps2,
      convenienceScore: 79,
      ecoScore: 92
    }));

    // 3. Rapido Bike + Metro (Fastest Hybrid for Solo Commuters)
    const bikeFeederDist = Math.min(3.5, distanceKm * 0.2);
    const bikeFare = Math.round(18 + bikeFeederDist * 7.5);
    const bikeTime = Math.round(bikeFeederDist * 2.0);
    const hybridSoloFare = metroFare + bikeFare;
    const hybridSoloTime = bikeTime + metroTrainTime + 5;

    const steps3 = [
      {
        stepNumber: 1,
        type: 'moto',
        mode: 'moto',
        instruction: `Rapido Bike Captain pickup to Metro Station (${bikeTime} min)`,
        durationMinutes: bikeTime,
        distanceKm: bikeFeederDist
      },
      {
        stepNumber: 2,
        type: 'metro',
        mode: 'metro',
        instruction: `Metro Express to destination station (${metroTrainTime} min)`,
        durationMinutes: metroTrainTime
      },
      {
        stepNumber: 3,
        type: 'walk',
        mode: 'walk',
        instruction: `Walk 3 min to destination`,
        durationMinutes: 3,
        distanceMeters: 200
      }
    ];

    results.push(new TransportationOption({
      id: 'mixed_moto_metro',
      category: 'mixed',
      provider: 'Rapido + Metro',
      mode: 'mixed',
      name: '🏍️ Rapido + 🚇 Metro',
      vehicleType: 'Bike Feeder + Metro Express',
      estimatedFareMin: hybridSoloFare - 5,
      estimatedFareMax: hybridSoloFare + 10,
      durationMinutes: hybridSoloTime,
      distanceKm: distanceKm,
      walkingMinutes: 3,
      walkingDistanceMeters: 200,
      transfers: 1,
      availability: 'High',
      surgeMultiplier: 1.0,
      rating: 4.8,
      badges: ['Fastest Solo Hybrid', 'Beat The Rush'],
      tagline: 'Skip rush hour traffic with a bike feeder and express train',
      route: metroOpt.route,
      routeSteps: steps3,
      convenienceScore: 87,
      ecoScore: 88
    }));

    return results;
  }
}
