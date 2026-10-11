/**
 * GoCompare - Transportation Data Models
 * Normalized schema decoupling the UI from underlying provider APIs.
 */

export class TransportationOption {
  constructor(data) {
    this.id = data.id || `opt_${Math.random().toString(36).substr(2, 9)}`;
    this.category = data.category; // 'private' | 'public' | 'mixed'
    this.provider = data.provider; // 'Uber' | 'Ola' | 'Rapido' | 'Delhi Metro' | 'DTC Bus' | 'Mixed'
    this.mode = data.mode; // 'cab' | 'auto' | 'moto' | 'metro' | 'bus' | 'mixed'
    this.name = data.name; // e.g., 'Uber Go', 'Ola Mini', 'Delhi Metro Yellow Line'
    this.vehicleType = data.vehicleType || 'Standard'; // 'Sedan' | 'Hatchback' | 'Auto' | 'Bike' | 'Metro Train' | 'AC Bus'
    
    // Pricing
    this.estimatedFareMin = Math.round(data.estimatedFareMin ?? data.fare ?? 0);
    this.estimatedFareMax = Math.round(data.estimatedFareMax ?? data.estimatedFareMin ?? data.fare ?? 0);
    this.currency = data.currency || '₹';
    this.surgeMultiplier = data.surgeMultiplier || 1.0;
    this.hasSurge = this.surgeMultiplier > 1.0;
    
    // Time & Distance
    this.durationMinutes = Math.round(data.durationMinutes || 0);
    this.distanceKm = parseFloat((data.distanceKm || 0).toFixed(1));
    this.walkingMinutes = Math.round(data.walkingMinutes || 0);
    this.walkingDistanceMeters = Math.round(data.walkingDistanceMeters || (this.walkingMinutes * 75));
    this.transfers = data.transfers || 0;
    
    // Availability & Quality
    this.availability = data.availability || 'High'; // 'High' | 'Moderate' | 'Limited' | 'Unavailable'
    this.rating = data.rating ? parseFloat(data.rating.toFixed(1)) : null;
    this.driverEtaMinutes = data.driverEtaMinutes || null;
    this.driverInfo = data.driverInfo || null; // { vehicleModel, isAC, maskedReg }
    
    // Features & Badges
    this.isAC = data.isAC !== undefined ? data.isAC : true;
    this.badges = data.badges || []; // ['Cheapest', 'Fastest', 'Best Value', 'Eco Friendly', 'Fewest Transfers']
    this.tagline = data.tagline || '';
    
    // Route & Navigation steps
    this.route = data.route || []; // LatLng waypoints for map rendering
    this.routeSteps = data.routeSteps || []; // Detailed step-by-step instructions
    this.intermediateStops = data.intermediateStops || [];
    
    // Booking Action
    this.bookingUrl = data.bookingUrl || '';
    this.appScheme = data.appScheme || '';
    
    // Trade-off Scores (0 - 100)
    this.convenienceScore = data.convenienceScore || 80;
    this.ecoScore = data.ecoScore || 50; // Higher is greener
  }

  get fareDisplay() {
    if (this.estimatedFareMin === this.estimatedFareMax) {
      return `${this.currency}${this.estimatedFareMin}`;
    }
    return `${this.currency}${this.estimatedFareMin}–${this.currency}${this.estimatedFareMax}`;
  }

  get averageFare() {
    return (this.estimatedFareMin + this.estimatedFareMax) / 2;
  }

  get durationDisplay() {
    if (this.durationMinutes < 60) {
      return `${this.durationMinutes} min`;
    }
    const hrs = Math.floor(this.durationMinutes / 60);
    const mins = this.durationMinutes % 60;
    return mins > 0 ? `${hrs} hr ${mins} min` : `${hrs} hr`;
  }
}
