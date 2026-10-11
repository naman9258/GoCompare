import { TransportationOption } from '../models.js';

export class OlaProvider {
  constructor() {
    this.name = 'Ola';
  }

  async getOptions(origin, destination, distanceKm, durationMinutes, trafficFactor = 1.0) {
    const isPeakHour = trafficFactor > 1.25;
    const surge = isPeakHour ? 1.15 : 1.0;
    
    const webBooking = `https://book.olacabs.com/?pickup_lat=${origin.lat}&pickup_lng=${origin.lng}&pickup_name=${encodeURIComponent(origin.name)}&drop_lat=${destination.lat}&drop_lng=${destination.lng}&drop_name=${encodeURIComponent(destination.name)}`;
    const appScheme = `olacabs://app/launch?landing_screen=booking&pickup_lat=${origin.lat}&pickup_lng=${origin.lng}&drop_lat=${destination.lat}&drop_lng=${destination.lng}`;

    return [
      // 1. Ola Mini
      new TransportationOption({
        id: 'ola_mini',
        category: 'private',
        provider: 'Ola',
        mode: 'cab',
        name: 'Ola Mini',
        vehicleType: 'Economy Hatchback (AC)',
        estimatedFareMin: Math.max(85, Math.round((45 + distanceKm * 14.0 + durationMinutes * 1.4) * surge)),
        estimatedFareMax: Math.max(105, Math.round((55 + distanceKm * 16.5 + durationMinutes * 1.8) * surge)),
        durationMinutes: durationMinutes + 1,
        distanceKm: distanceKm,
        availability: 'High',
        surgeMultiplier: surge,
        rating: 4.7,
        driverEtaMinutes: 4,
        driverInfo: { vehicleModel: 'Tata Tiago / Maruti Celerio', isAC: true, maskedReg: 'DL 1Y ****' },
        bookingUrl: webBooking,
        appScheme: appScheme,
        badges: ['Budget Friendly', 'AC'],
        tagline: 'Affordable compact cabs for daily commute',
        convenienceScore: 90,
        ecoScore: 40
      }),

      // 2. Ola Prime Sedan
      new TransportationOption({
        id: 'ola_prime',
        category: 'private',
        provider: 'Ola',
        mode: 'cab',
        name: 'Ola Prime Sedan',
        vehicleType: 'Spacious Sedan (WiFi & AC)',
        estimatedFareMin: Math.max(130, Math.round((75 + distanceKm * 20.0 + durationMinutes * 2.2) * surge)),
        estimatedFareMax: Math.max(160, Math.round((95 + distanceKm * 24.0 + durationMinutes * 2.8) * surge)),
        durationMinutes: durationMinutes,
        distanceKm: distanceKm,
        availability: 'High',
        surgeMultiplier: surge,
        rating: 4.8,
        driverEtaMinutes: 5,
        driverInfo: { vehicleModel: 'Maruti Ciaz / Hyundai Aura', isAC: true, maskedReg: 'DL 2C ****' },
        bookingUrl: webBooking,
        appScheme: appScheme,
        badges: ['Free In-Cab WiFi', 'Extra Luggage'],
        tagline: 'Top-rated drivers with in-cab entertainment',
        convenienceScore: 95,
        ecoScore: 35
      }),

      // 3. Ola Auto
      new TransportationOption({
        id: 'ola_auto',
        category: 'private',
        provider: 'Ola',
        mode: 'auto',
        name: 'Ola Auto',
        vehicleType: 'Auto Rickshaw',
        estimatedFareMin: Math.max(38, Math.round((28 + distanceKm * 11.0 + durationMinutes * 0.7) * 1.0)),
        estimatedFareMax: Math.max(48, Math.round((34 + distanceKm * 13.0 + durationMinutes * 1.0) * 1.0)),
        durationMinutes: Math.round(durationMinutes * 1.1),
        distanceKm: distanceKm,
        availability: 'High',
        surgeMultiplier: 1.0,
        rating: 4.6,
        driverEtaMinutes: 3,
        driverInfo: { vehicleModel: 'Piaggio Ape / Bajaj Auto', isAC: false, maskedReg: 'DL 1R ****' },
        bookingUrl: webBooking,
        appScheme: appScheme,
        badges: ['Doorstep Pickup', 'Standard Meter Rates'],
        tagline: 'Quick auto rides with transparent pricing',
        convenienceScore: 83,
        ecoScore: 60
      }),

      // 4. Ola Bike
      new TransportationOption({
        id: 'ola_bike',
        category: 'private',
        provider: 'Ola',
        mode: 'moto',
        name: 'Ola Bike',
        vehicleType: 'Two-Wheeler Bike',
        estimatedFareMin: Math.max(22, Math.round((18 + distanceKm * 7.0 + durationMinutes * 0.5) * surge)),
        estimatedFareMax: Math.max(32, Math.round((22 + distanceKm * 9.0 + durationMinutes * 0.7) * surge)),
        durationMinutes: Math.max(4, Math.round(durationMinutes * 0.85)),
        distanceKm: distanceKm,
        availability: 'High',
        surgeMultiplier: surge,
        rating: 4.7,
        driverEtaMinutes: 2,
        driverInfo: { vehicleModel: 'TVS Jupiter / Honda Shine', isAC: false, maskedReg: 'DL 9B ****' },
        bookingUrl: webBooking,
        appScheme: appScheme,
        badges: ['Super Fast', 'Budget Choice'],
        tagline: 'Zip through heavy traffic effortlessly',
        convenienceScore: 79,
        ecoScore: 75
      })
    ];
  }
}
