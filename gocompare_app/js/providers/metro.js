import { TransportationOption } from '../models.js';

export class MetroProvider {
  constructor() {
    this.name = 'Metro';
  }

  // Haversine distance in km
  haversine(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  findNearestStation(point, lines) {
    let best = null;
    let minDistance = Infinity;

    for (const line of lines) {
      for (let i = 0; i < line.stations.length; i++) {
        const station = line.stations[i];
        const dist = this.haversine(point.lat, point.lng, station.lat, station.lng);
        if (dist < minDistance) {
          minDistance = dist;
          best = { station, line, index: i, distanceKm: dist };
        }
      }
    }
    return best;
  }

  calculateMetroFare(distanceKm, isAirport = false) {
    if (isAirport) return distanceKm > 15 ? 80 : 50;
    if (distanceKm <= 2) return 10;
    if (distanceKm <= 5) return 20;
    if (distanceKm <= 12) return 30;
    if (distanceKm <= 21) return 40;
    if (distanceKm <= 32) return 50;
    return 60;
  }

  getOptions(origin, destination, cityData) {
    const lines = cityData.metroLines || [];
    if (!lines.length) return [];

    const originStation = this.findNearestStation(origin, lines);
    const destStation = this.findNearestStation(destination, lines);

    if (!originStation || !destStation) return [];

    // If both origin and destination are too far from any metro station (> 12km), direct metro is impractical
    if (originStation.distanceKm > 12 && destStation.distanceKm > 12) {
      return [];
    }

    const sameLine = originStation.line.id === destStation.line.id;
    let transfers = 0;
    let interchangeStation = null;
    let intermediateStops = [];
    let metroDistanceKm = 0;
    let trainDurationMinutes = 0;

    const routeSteps = [];
    const waypoints = [{ lat: origin.lat, lng: origin.lng }];

    // 1. Walk to origin station
    const walkToOriginMins = Math.max(3, Math.round(originStation.distanceKm * 12));
    const walkToOriginMeters = Math.round(originStation.distanceKm * 1000);
    routeSteps.push({
      stepNumber: 1,
      type: 'walk',
      mode: 'walk',
      instruction: `Walk ${walkToOriginMins} min (${walkToOriginMeters > 1000 ? (walkToOriginMeters/1000).toFixed(1) + ' km' : walkToOriginMeters + ' m'}) to ${originStation.station.name} Metro Station`,
      durationMinutes: walkToOriginMins,
      distanceMeters: walkToOriginMeters,
      location: originStation.station.name
    });
    waypoints.push({ lat: originStation.station.lat, lng: originStation.station.lng });

    if (sameLine) {
      // Travel along the same line
      const line = originStation.line;
      const startIdx = originStation.index;
      const endIdx = destStation.index;
      const step = startIdx < endIdx ? 1 : -1;
      const stopsList = [];

      for (let i = startIdx; i !== endIdx + step; i += step) {
        stopsList.push(line.stations[i]);
        waypoints.push({ lat: line.stations[i].lat, lng: line.stations[i].lng });
      }

      const numStops = Math.abs(endIdx - startIdx);
      trainDurationMinutes = Math.max(6, Math.round(numStops * 2.2));
      metroDistanceKm = parseFloat((numStops * 1.6).toFixed(1));
      intermediateStops = stopsList;

      const directionStation = step === 1 ? line.stations[line.stations.length - 1].name : line.stations[0].name;

      routeSteps.push({
        stepNumber: 2,
        type: 'metro',
        mode: 'metro',
        instruction: `Board ${line.name} towards ${directionStation}`,
        subtext: `Ride ${numStops} stops (${trainDurationMinutes} min) to ${destStation.station.name}`,
        durationMinutes: trainDurationMinutes,
        lineName: line.name,
        lineColor: line.color,
        textColor: line.textColor,
        stopsCount: numStops,
        stops: stopsList.map(s => s.name)
      });
    } else {
      // Find interchange
      transfers = 1;
      const originLine = originStation.line;
      const destLine = destStation.line;
      
      // Look for common station name or transfer hub
      let transferStation = null;
      for (const s1 of originLine.stations) {
        for (const s2 of destLine.stations) {
          if (s1.name === s2.name || (s1.interchange && s1.interchange.some(ic => destLine.name.includes(ic)))) {
            transferStation = { s1, s2 };
            break;
          }
        }
        if (transferStation) break;
      }

      if (!transferStation) {
        // Default prominent interchange for Delhi: Rajiv Chowk / Kashmere Gate / Central Secretariat
        transferStation = {
          s1: originLine.stations[Math.floor(originLine.stations.length / 2)],
          s2: destLine.stations[Math.floor(destLine.stations.length / 2)]
        };
      }

      interchangeStation = transferStation.s1.name;
      const leg1Stops = Math.max(2, Math.abs(originStation.index - 3));
      const leg2Stops = Math.max(2, Math.abs(destStation.index - 2));
      const leg1Time = Math.round(leg1Stops * 2.2);
      const leg2Time = Math.round(leg2Stops * 2.2);
      const transferTime = 5; // 5 min transfer between platforms

      trainDurationMinutes = leg1Time + transferTime + leg2Time;
      metroDistanceKm = parseFloat(((leg1Stops + leg2Stops) * 1.5).toFixed(1));

      routeSteps.push({
        stepNumber: 2,
        type: 'metro',
        mode: 'metro',
        instruction: `Board ${originLine.name} from ${originStation.station.name}`,
        subtext: `Ride ${leg1Stops} stops to ${interchangeStation}`,
        durationMinutes: leg1Time,
        lineName: originLine.name,
        lineColor: originLine.color,
        textColor: originLine.textColor,
        stopsCount: leg1Stops
      });

      waypoints.push({ lat: transferStation.s1.lat, lng: transferStation.s1.lng });

      routeSteps.push({
        stepNumber: 3,
        type: 'transfer',
        mode: 'transfer',
        instruction: `Interchange at ${interchangeStation} (${transferTime} min walk/wait)`,
        subtext: `Follow station signage to switch from ${originLine.name} to ${destLine.name}`,
        durationMinutes: transferTime
      });

      routeSteps.push({
        stepNumber: 4,
        type: 'metro',
        mode: 'metro',
        instruction: `Board ${destLine.name} towards ${destStation.station.name}`,
        subtext: `Ride ${leg2Stops} stops to ${destStation.station.name}`,
        durationMinutes: leg2Time,
        lineName: destLine.name,
        lineColor: destLine.color,
        textColor: destLine.textColor,
        stopsCount: leg2Stops
      });

      waypoints.push({ lat: destStation.station.lat, lng: destStation.station.lng });
    }

    // Walk to destination
    const walkToDestMins = Math.max(2, Math.round(destStation.distanceKm * 12));
    const walkToDestMeters = Math.round(destStation.distanceKm * 1000);
    routeSteps.push({
      stepNumber: routeSteps.length + 1,
      type: 'walk',
      mode: 'walk',
      instruction: `Walk ${walkToDestMins} min (${walkToDestMeters > 1000 ? (walkToDestMeters/1000).toFixed(1) + ' km' : walkToDestMeters + ' m'}) to ${destination.name}`,
      durationMinutes: walkToDestMins,
      distanceMeters: walkToDestMeters,
      location: destination.name
    });
    waypoints.push({ lat: destination.lat, lng: destination.lng });

    const totalDuration = walkToOriginMins + trainDurationMinutes + walkToDestMins;
    const totalWalkMins = walkToOriginMins + walkToDestMins;
    const totalWalkMeters = walkToOriginMeters + walkToDestMeters;
    const totalDistance = parseFloat((originStation.distanceKm + metroDistanceKm + destStation.distanceKm).toFixed(1));
    const isAirport = originStation.line.id.includes('airport') || destStation.line.id.includes('airport');
    const fare = this.calculateMetroFare(metroDistanceKm, isAirport);

    const metroOption = new TransportationOption({
      id: 'transit_metro',
      category: 'public',
      provider: `${cityData.name} Metro`,
      mode: 'metro',
      name: `${cityData.name} Metro (${originStation.line.name})`,
      vehicleType: 'Air-Conditioned Metro Train',
      estimatedFareMin: fare,
      estimatedFareMax: fare,
      durationMinutes: totalDuration,
      distanceKm: totalDistance,
      walkingMinutes: totalWalkMins,
      walkingDistanceMeters: totalWalkMeters,
      transfers: transfers,
      availability: 'High',
      surgeMultiplier: 1.0,
      rating: 4.9,
      isAC: true,
      badges: ['Zero Traffic Delay', 'Eco Friendly', '100% AC'],
      tagline: 'Fastest predictable transit avoiding all road jams',
      route: waypoints,
      routeSteps: routeSteps,
      convenienceScore: transfers > 0 ? 82 : 88,
      ecoScore: 95
    });

    return [metroOption];
  }
}
