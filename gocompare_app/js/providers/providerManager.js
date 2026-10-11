import { UberProvider } from './uber.js';
import { OlaProvider } from './ola.js';
import { RapidoProvider } from './rapido.js';
import { MetroProvider } from './metro.js';
import { BusProvider } from './bus.js';
import { MixedModePlanner } from '../services/mixedModePlanner.js';
import { CITIES_DATA } from '../data/cities.js';

export class ProviderManager {
  constructor() {
    this.uber = new UberProvider();
    this.ola = new OlaProvider();
    this.rapido = new RapidoProvider();
    this.metro = new MetroProvider();
    this.bus = new BusProvider();
    this.mixedPlanner = new MixedModePlanner();
  }

  // Haversine distance
  calcHaversine(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  }

  async getAllOptions(origin, destination, cityId = 'delhi_ncr') {
    const cityData = CITIES_DATA[cityId] || CITIES_DATA['delhi_ncr'];
    
    // Calculate road network distance & baseline time
    const directKm = this.calcHaversine(origin.lat, origin.lng, destination.lat, destination.lng);
    // Road factor in Indian cities ~ 1.35x crow flies
    const distanceKm = parseFloat(Math.max(1.2, directKm * 1.35).toFixed(1));
    
    // Time factor: Average city speed ~ 22-26 km/h
    const baseDurationMins = Math.max(8, Math.round((distanceKm / 24) * 60));
    
    // Simulate real peak traffic based on time of day
    const hour = new Date().getHours();
    const isPeak = (hour >= 8 && hour <= 11) || (hour >= 17 && hour <= 21);
    const trafficFactor = isPeak ? 1.3 : 1.05;
    const drivingDuration = Math.round(baseDurationMins * trafficFactor);

    // Call providers in parallel
    const [uberOptions, olaOptions, rapidoOptions, metroOptions, busOptions] = await Promise.all([
      this.uber.getOptions(origin, destination, distanceKm, drivingDuration, trafficFactor),
      this.ola.getOptions(origin, destination, distanceKm, drivingDuration, trafficFactor),
      this.rapido.getOptions(origin, destination, distanceKm, drivingDuration, trafficFactor),
      this.metro.getOptions(origin, destination, cityData),
      this.bus.getOptions(origin, destination, distanceKm, drivingDuration, cityData)
    ]);

    const privateOptions = [...uberOptions, ...olaOptions, ...rapidoOptions];
    const publicOptions = [...metroOptions, ...busOptions];
    
    // Generate mixed-mode options
    const mixedOptions = this.mixedPlanner.generateMixedOptions(
      origin, destination, metroOptions, privateOptions, distanceKm, drivingDuration
    );

    const allOptions = [...privateOptions, ...publicOptions, ...mixedOptions];

    // Identify and stamp global badges
    let cheapest = allOptions[0];
    let fastest = allOptions[0];

    for (const opt of allOptions) {
      if (opt.averageFare < cheapest.averageFare) cheapest = opt;
      if (opt.durationMinutes < fastest.durationMinutes) fastest = opt;
    }

    if (cheapest && !cheapest.badges.includes('Cheapest')) {
      cheapest.badges.unshift('Cheapest');
    }
    if (fastest && !fastest.badges.includes('Fastest')) {
      fastest.badges.unshift('Fastest');
    }

    return {
      metadata: {
        origin,
        destination,
        city: cityData.name,
        directDistanceKm: parseFloat(directKm.toFixed(1)),
        roadDistanceKm: distanceKm,
        isPeakHour: isPeak,
        trafficMultiplier: trafficFactor,
        calculatedAt: new Date().toISOString(),
        totalCount: allOptions.length
      },
      groups: {
        privateRides: privateOptions,
        publicTransport: publicOptions,
        mixedRoutes: mixedOptions
      },
      all: allOptions
    };
  }
}
