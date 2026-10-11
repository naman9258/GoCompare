import { TransportationOption } from '../models.js';

export class RapidoProvider {
  constructor() {
    this.name = 'Rapido';
  }

  async getOptions(origin, destination, distanceKm, durationMinutes, trafficFactor = 1.0) {
    const isPeakHour = trafficFactor > 1.25;
    const surge = isPeakHour ? 1.1 : 1.0;
    
    const webBooking = `https://www.rapido.bike/`;
    const appScheme = `rapido://pickup?lat=${origin.lat}&lng=${origin.lng}&dlat=${destination.lat}&dlng=${destination.lng}`;

    return [
      // 1. Rapido Bike Taxi (Flagship offering)
      new TransportationOption({
        id: 'rapido_bike',
        category: 'private',
        provider: 'Rapido',
        mode: 'moto',
        name: 'Rapido Bike',
        vehicleType: 'Bike Taxi (Fastest)',
        estimatedFareMin: Math.max(20, Math.round((15 + distanceKm * 6.8 + durationMinutes * 0.4) * surge)),
        estimatedFareMax: Math.max(30, Math.round((20 + distanceKm * 8.5 + durationMinutes * 0.6) * surge)),
        durationMinutes: Math.max(4, Math.round(durationMinutes * 0.80)), // Rapido captain weaves best
        distanceKm: distanceKm,
        availability: 'High',
        surgeMultiplier: surge,
        rating: 4.8,
        driverEtaMinutes: 2,
        driverInfo: { vehicleModel: 'Bajaj Pulsar / Hero Splendor', isAC: false, maskedReg: 'DL 5P ****' },
        bookingUrl: webBooking,
        appScheme: appScheme,
        badges: ['Cheapest Private Ride', 'Fastest in Traffic'],
        tagline: "India's favorite bike taxi service",
        convenienceScore: 82,
        ecoScore: 78
      }),

      // 2. Rapido Auto
      new TransportationOption({
        id: 'rapido_auto',
        category: 'private',
        provider: 'Rapido',
        mode: 'auto',
        name: 'Rapido Auto',
        vehicleType: 'Auto Rickshaw (Guaranteed Fare)',
        estimatedFareMin: Math.max(35, Math.round((25 + distanceKm * 10.5 + durationMinutes * 0.7) * 1.0)),
        estimatedFareMax: Math.max(45, Math.round((30 + distanceKm * 12.5 + durationMinutes * 0.9) * 1.0)),
        durationMinutes: Math.round(durationMinutes * 1.08),
        distanceKm: distanceKm,
        availability: 'High',
        surgeMultiplier: 1.0,
        rating: 4.7,
        driverEtaMinutes: 3,
        driverInfo: { vehicleModel: 'Bajaj Compact Auto', isAC: false, maskedReg: 'DL 1R ****' },
        bookingUrl: webBooking,
        appScheme: appScheme,
        badges: ['Zero Cancellation Guarantee', 'Direct Auto'],
        tagline: 'Lowest auto cancellation rate in the city',
        convenienceScore: 85,
        ecoScore: 60
      }),

      // 3. Rapido Economy Cab
      new TransportationOption({
        id: 'rapido_cab',
        category: 'private',
        provider: 'Rapido',
        mode: 'cab',
        name: 'Rapido Cab Economy',
        vehicleType: 'Economy Cab (AC)',
        estimatedFareMin: Math.max(80, Math.round((42 + distanceKm * 13.5 + durationMinutes * 1.3) * surge)),
        estimatedFareMax: Math.max(100, Math.round((50 + distanceKm * 16.0 + durationMinutes * 1.7) * surge)),
        durationMinutes: durationMinutes + 1,
        distanceKm: distanceKm,
        availability: 'Moderate',
        surgeMultiplier: surge,
        rating: 4.6,
        driverEtaMinutes: 5,
        driverInfo: { vehicleModel: 'Hyundai Grand i10 / WagonR', isAC: true, maskedReg: 'DL 1E ****' },
        bookingUrl: webBooking,
        appScheme: appScheme,
        badges: ['Guaranteed AC', 'Low Price'],
        tagline: 'Affordable cab rides with zero surge guarantee',
        convenienceScore: 89,
        ecoScore: 40
      })
    ];
  }
}
