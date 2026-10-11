import { TransportationOption } from '../models.js';

export class UberProvider {
  constructor() {
    this.name = 'Uber';
  }

  async getOptions(origin, destination, distanceKm, durationMinutes, trafficFactor = 1.0) {
    // Realistic Indian Metro pricing base + per km + surge
    const isPeakHour = trafficFactor > 1.25;
    const surge = isPeakHour ? 1.2 : 1.0;
    
    // Deep link builders
    const webBooking = `https://m.uber.com/ul/?action=setPickup&pickup[latitude]=${origin.lat}&pickup[longitude]=${origin.lng}&pickup[formatted_address]=${encodeURIComponent(origin.name)}&dropoff[latitude]=${destination.lat}&dropoff[longitude]=${destination.lng}&dropoff[formatted_address]=${encodeURIComponent(destination.name)}`;
    const appScheme = `uber://?action=setPickup&client_id=gocompare&pickup[latitude]=${origin.lat}&pickup[longitude]=${origin.lng}&dropoff[latitude]=${destination.lat}&dropoff[longitude]=${destination.lng}`;

    const options = [
      // 1. Uber Go
      new TransportationOption({
        id: 'uber_go',
        category: 'private',
        provider: 'Uber',
        mode: 'cab',
        name: 'Uber Go',
        vehicleType: 'Hatchback / Sedan (AC)',
        estimatedFareMin: Math.max(90, Math.round((50 + distanceKm * 14.5 + durationMinutes * 1.5) * surge)),
        estimatedFareMax: Math.max(110, Math.round((60 + distanceKm * 17.5 + durationMinutes * 2.0) * surge)),
        durationMinutes: durationMinutes,
        distanceKm: distanceKm,
        availability: isPeakHour ? 'Moderate' : 'High',
        surgeMultiplier: surge,
        rating: 4.8,
        driverEtaMinutes: 3,
        driverInfo: { vehicleModel: 'Maruti WagonR / Swift Dzire', isAC: true, maskedReg: 'DL 1Z ****' },
        bookingUrl: webBooking,
        appScheme: appScheme,
        badges: ['Most Popular', 'Air Conditioned'],
        tagline: 'Reliable, affordable everyday compact rides',
        convenienceScore: 92,
        ecoScore: 40
      }),

      // 2. Uber Premier
      new TransportationOption({
        id: 'uber_premier',
        category: 'private',
        provider: 'Uber',
        mode: 'cab',
        name: 'Uber Premier',
        vehicleType: 'Premium Sedan (Spacious AC)',
        estimatedFareMin: Math.max(140, Math.round((80 + distanceKm * 21.0 + durationMinutes * 2.5) * surge)),
        estimatedFareMax: Math.max(170, Math.round((100 + distanceKm * 25.0 + durationMinutes * 3.0) * surge)),
        durationMinutes: Math.max(5, durationMinutes - 2),
        distanceKm: distanceKm,
        availability: 'High',
        surgeMultiplier: surge,
        rating: 4.9,
        driverEtaMinutes: 4,
        driverInfo: { vehicleModel: 'Honda City / Hyundai Verna', isAC: true, maskedReg: 'DL 3C ****' },
        bookingUrl: webBooking,
        appScheme: appScheme,
        badges: ['Top-Rated Drivers', 'Extra Legroom'],
        tagline: 'Top-rated drivers & high-comfort sedans',
        convenienceScore: 96,
        ecoScore: 35
      }),

      // 3. Uber Auto
      new TransportationOption({
        id: 'uber_auto',
        category: 'private',
        provider: 'Uber',
        mode: 'auto',
        name: 'Uber Auto',
        vehicleType: '3-Wheeler Auto Rickshaw',
        estimatedFareMin: Math.max(40, Math.round((30 + distanceKm * 11.5 + durationMinutes * 0.8) * 1.0)),
        estimatedFareMax: Math.max(50, Math.round((35 + distanceKm * 13.5 + durationMinutes * 1.1) * 1.0)),
        durationMinutes: Math.round(durationMinutes * 1.08),
        distanceKm: distanceKm,
        availability: 'High',
        surgeMultiplier: 1.0,
        rating: 4.6,
        driverEtaMinutes: 2,
        driverInfo: { vehicleModel: 'Bajaj RE Auto', isAC: false, maskedReg: 'DL 1R ****' },
        bookingUrl: webBooking,
        appScheme: appScheme,
        badges: ['No Surge', 'Doorstep Pickup'],
        tagline: 'Fixed upfront fare, no meter haggling',
        convenienceScore: 84,
        ecoScore: 60
      }),

      // 4. Uber Moto
      new TransportationOption({
        id: 'uber_moto',
        category: 'private',
        provider: 'Uber',
        mode: 'moto',
        name: 'Uber Moto',
        vehicleType: 'Motorbike / Scooter',
        estimatedFareMin: Math.max(25, Math.round((20 + distanceKm * 7.5 + durationMinutes * 0.5) * surge)),
        estimatedFareMax: Math.max(35, Math.round((25 + distanceKm * 9.5 + durationMinutes * 0.7) * surge)),
        durationMinutes: Math.max(4, Math.round(durationMinutes * 0.82)), // Bikes weave through traffic
        distanceKm: distanceKm,
        availability: 'High',
        surgeMultiplier: surge,
        rating: 4.7,
        driverEtaMinutes: 2,
        driverInfo: { vehicleModel: 'Hero Splendor / Honda Activa (Helmet provided)', isAC: false, maskedReg: 'DL 8S ****' },
        bookingUrl: webBooking,
        appScheme: appScheme,
        badges: ['Traffic Buster', 'Pocket Friendly'],
        tagline: 'Fastest through traffic for solo travelers',
        convenienceScore: 78,
        ecoScore: 75
      })
    ];

    return options;
  }
}
