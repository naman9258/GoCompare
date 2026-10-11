import { TransportationOption } from '../models.js';

export class BusProvider {
  constructor() {
    this.name = 'Bus';
  }

  getOptions(origin, destination, distanceKm, durationMinutes, cityData) {
    const corridors = cityData.busCorridors || [];
    const busDistance = parseFloat((distanceKm * 1.05).toFixed(1));
    // Buses stop frequently and face traffic: duration approx 1.45x car time
    const busDuration = Math.round(durationMinutes * 1.4 + 10);
    const walkMins = 8;
    const walkMeters = 600;

    const matchedCorridor = corridors[0] || {
      routeNumber: 'City Bus Exp',
      name: 'Direct Trunk Route',
      isAC: true,
      fareMin: 15,
      fareMax: 25,
      keyStops: ['Origin Terminal', 'Midpoint Interchange', 'Destination Stand']
    };

    const fare = Math.min(matchedCorridor.fareMax, Math.max(matchedCorridor.fareMin, Math.round(10 + distanceKm * 1.2)));

    const routeSteps = [
      {
        stepNumber: 1,
        type: 'walk',
        mode: 'walk',
        instruction: `Walk 4 min (300 m) to nearest Bus Stop (${origin.name.split('(')[0].trim()})`,
        durationMinutes: 4,
        distanceMeters: 300
      },
      {
        stepNumber: 2,
        type: 'bus',
        mode: 'bus',
        instruction: `Board ${matchedCorridor.routeNumber} (${matchedCorridor.isAC ? 'Low-Floor AC' : 'Standard Electric'})`,
        subtext: `Via ${matchedCorridor.name}. Ride ~${Math.max(4, Math.round(distanceKm * 0.8))} stops (${busDuration - 8} min)`,
        durationMinutes: busDuration - 8,
        lineName: matchedCorridor.routeNumber,
        isAC: matchedCorridor.isAC
      },
      {
        stepNumber: 3,
        type: 'walk',
        mode: 'walk',
        instruction: `Deboard and walk 4 min (300 m) to ${destination.name.split('(')[0].trim()}`,
        durationMinutes: 4,
        distanceMeters: 300
      }
    ];

    // Waypoints
    const waypoints = [
      { lat: origin.lat, lng: origin.lng },
      { lat: (origin.lat * 2 + destination.lat) / 3 + 0.005, lng: (origin.lng * 2 + destination.lng) / 3 - 0.005 },
      { lat: (origin.lat + destination.lat * 2) / 3 - 0.005, lng: (origin.lng + destination.lng * 2) / 3 + 0.005 },
      { lat: destination.lat, lng: destination.lng }
    ];

    const busOption = new TransportationOption({
      id: 'transit_bus',
      category: 'public',
      provider: `${cityData.name} Bus`,
      mode: 'bus',
      name: `${matchedCorridor.routeNumber} (${cityData.name} City Transit)`,
      vehicleType: matchedCorridor.isAC ? 'AC Low-Floor Electric Bus' : 'Standard City Bus',
      estimatedFareMin: fare,
      estimatedFareMax: fare + 5,
      durationMinutes: busDuration,
      distanceKm: busDistance,
      walkingMinutes: walkMins,
      walkingDistanceMeters: walkMeters,
      transfers: 0,
      availability: 'High',
      surgeMultiplier: 1.0,
      rating: 4.2,
      isAC: matchedCorridor.isAC,
      badges: ['Cheapest Overall', 'Senior & Student Concessions'],
      tagline: 'Lowest fare for point-to-point city transit',
      route: waypoints,
      routeSteps: routeSteps,
      convenienceScore: 70,
      ecoScore: 90
    });

    return [busOption];
  }
}
