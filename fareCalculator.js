/**
 * GoCompare - Fare Estimation Engine
 * Calculates live estimated fares across aggregators (Rapido, Namma Yatri, Ola, Uber)
 */
function calculateFare(distance, time) {
  const dist = Math.max(0.5, parseFloat(distance) || 1);
  const dur = Math.max(1, parseFloat(time) || 5);

  return {
    rapido: Math.round(25 + dist * 9 + dur * 0.5),
    nammaYatri: Math.round(30 + dist * 15),
    olaAuto: Math.round(35 + dist * 16 + dur * 1.0),
    uberAuto: Math.round(40 + dist * 18 + dur * 1.2),
    olaMini: Math.round(50 + dist * 20 + dur * 1.4),
    uberGo: Math.round(55 + dist * 21 + dur * 1.5)
  };
}

module.exports = { calculateFare };
