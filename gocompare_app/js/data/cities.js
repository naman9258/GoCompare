/**
 * Cities, Key Landmarks, Transit Networks and Corridors for India
 */

export const CITIES_DATA = {
  delhi_ncr: {
    id: 'delhi_ncr',
    name: 'Delhi NCR',
    state: 'Delhi / Haryana / UP',
    center: { lat: 28.6139, lng: 77.2090 },
    bounds: {
      minLat: 28.35, maxLat: 28.85,
      minLng: 76.90, maxLng: 77.55
    },
    landmarks: [
      { id: 'cp', name: 'Connaught Place (Rajiv Chowk)', category: 'Commercial / Hub', lat: 28.6328, lng: 77.2197, popular: true, metroNearby: 'Rajiv Chowk' },
      { id: 'cyber_hub', name: 'Gurugram Cyber Hub', category: 'Tech / Business', lat: 28.4950, lng: 77.0895, popular: true, metroNearby: 'IndusInd Bank Cyber City' },
      { id: 'igi_t3', name: 'IGI Delhi Airport Terminal 3', category: 'Airport', lat: 28.5562, lng: 77.1000, popular: true, metroNearby: 'IGI Airport T3' },
      { id: 'ndls', name: 'New Delhi Railway Station (Paharganj / Ajmeri Gate)', category: 'Railway Station', lat: 28.6429, lng: 77.2201, popular: true, metroNearby: 'New Delhi' },
      { id: 'noida_18', name: 'Noida Sector 18 (Atta Market / Mall of India)', category: 'Shopping / Hub', lat: 28.5708, lng: 77.3260, popular: true, metroNearby: 'Noida Sector 18' },
      { id: 'hauz_khas', name: 'Hauz Khas Village & Metro', category: 'Culture / Nightlife', lat: 28.5494, lng: 77.2001, popular: true, metroNearby: 'Hauz Khas' },
      { id: 'saket', name: 'Saket District Centre (Select Citywalk)', category: 'Shopping', lat: 28.5284, lng: 77.2185, popular: false, metroNearby: 'Malviya Nagar / Saket' },
      { id: 'nehru_place', name: 'Nehru Place IT Market', category: 'Commercial', lat: 28.5493, lng: 77.2530, popular: true, metroNearby: 'Nehru Place' },
      { id: 'chandni_chowk', name: 'Chandni Chowk / Red Fort', category: 'Heritage / Market', lat: 28.6506, lng: 77.2303, popular: true, metroNearby: 'Chandni Chowk' },
      { id: 'dwarka_21', name: 'Dwarka Sector 21', category: 'Suburban / Interchange', lat: 28.5523, lng: 77.0583, popular: false, metroNearby: 'Dwarka Sector 21' },
      { id: 'millennium_city', name: 'Millennium City Centre Gurugram', category: 'Transit Hub', lat: 28.4593, lng: 77.0725, popular: true, metroNearby: 'Millennium City Centre' },
      { id: 'indiarapuram', name: 'Indirapuram (Shipra Mall), Ghaziabad', category: 'Residential', lat: 28.6410, lng: 77.3750, popular: false, metroNearby: 'Vaishali' },
      { id: 'kcc_itm', name: 'KCC Institute of Technology & Management, Knowledge Park III, Greater Noida', category: 'College / Education', lat: 28.4680, lng: 77.5020, popular: true, metroNearby: 'Knowledge Park II (Aqua Line)' },
      { id: 'pari_chowk', name: 'Pari Chowk, Greater Noida', category: 'Transit Hub', lat: 28.4731, lng: 77.5106, popular: true, metroNearby: 'Pari Chowk' }
    ],
    metroLines: [
      {
        id: 'yellow',
        name: 'Yellow Line',
        color: '#EAB308',
        textColor: '#000000',
        stations: [
          { name: 'Samaypur Badli', lat: 28.7450, lng: 77.1350 },
          { name: 'Vishwa Vidyalaya (Delhi University)', lat: 28.6970, lng: 77.2080 },
          { name: 'Kashmere Gate', lat: 28.6675, lng: 77.2285, interchange: ['Red Line', 'Violet Line'] },
          { name: 'Chandni Chowk', lat: 28.6506, lng: 77.2303 },
          { name: 'New Delhi', lat: 28.6429, lng: 77.2201, interchange: ['Airport Express'] },
          { name: 'Rajiv Chowk (CP)', lat: 28.6328, lng: 77.2197, interchange: ['Blue Line'] },
          { name: 'Central Secretariat', lat: 28.6146, lng: 77.2119, interchange: ['Violet Line'] },
          { name: 'AIIMS', lat: 28.5685, lng: 77.2078 },
          { name: 'Hauz Khas', lat: 28.5494, lng: 77.2001, interchange: ['Magenta Line'] },
          { name: 'Malviya Nagar', lat: 28.5284, lng: 77.2060 },
          { name: 'Qutab Minar', lat: 28.5130, lng: 77.1850 },
          { name: 'Sikanderpur', lat: 28.4818, lng: 77.0927, interchange: ['Rapid Metro Gurugram'] },
          { name: 'Millennium City Centre Gurugram', lat: 28.4593, lng: 77.0725 }
        ]
      },
      {
        id: 'blue',
        name: 'Blue Line',
        color: '#2563EB',
        textColor: '#FFFFFF',
        stations: [
          { name: 'Dwarka Sector 21', lat: 28.5523, lng: 77.0583, interchange: ['Airport Express'] },
          { name: 'Janakpuri West', lat: 28.6293, lng: 77.0778, interchange: ['Magenta Line'] },
          { name: 'Kirti Nagar', lat: 28.6558, lng: 77.1517, interchange: ['Green Line'] },
          { name: 'Rajiv Chowk (CP)', lat: 28.6328, lng: 77.2197, interchange: ['Yellow Line'] },
          { name: 'Mandi House', lat: 28.6258, lng: 77.2344, interchange: ['Violet Line'] },
          { name: 'Yamuna Bank', lat: 28.6234, lng: 77.2667 },
          { name: 'Mayur Vihar-I', lat: 28.6047, lng: 77.2947, interchange: ['Pink Line'] },
          { name: 'Noida Sector 18', lat: 28.5708, lng: 77.3260 },
          { name: 'Botanical Garden', lat: 28.5645, lng: 77.3344, interchange: ['Magenta Line'] },
          { name: 'Noida Electronic City', lat: 28.6280, lng: 77.3750 }
        ]
      },
      {
        id: 'airport_express',
        name: 'Airport Express (Orange Line)',
        color: '#EA580C',
        textColor: '#FFFFFF',
        stations: [
          { name: 'New Delhi', lat: 28.6429, lng: 77.2201, interchange: ['Yellow Line'] },
          { name: 'Shivaji Stadium', lat: 28.6280, lng: 77.2110 },
          { name: 'Dhaula Kuan', lat: 28.5925, lng: 77.1610, interchange: ['Pink Line'] },
          { name: 'Delhi Aerocity', lat: 28.5490, lng: 77.1210 },
          { name: 'IGI Airport T3', lat: 28.5562, lng: 77.1000 },
          { name: 'Dwarka Sector 21', lat: 28.5523, lng: 77.0583, interchange: ['Blue Line'] },
          { name: 'Yashobhoomi Dwarka Sector 25', lat: 28.5450, lng: 77.0350 }
        ]
      },
      {
        id: 'magenta',
        name: 'Magenta Line',
        color: '#C026D3',
        textColor: '#FFFFFF',
        stations: [
          { name: 'Janakpuri West', lat: 28.6293, lng: 77.0778, interchange: ['Blue Line'] },
          { name: 'Terminal 1 IGI Airport', lat: 28.5580, lng: 77.1180 },
          { name: 'Hauz Khas', lat: 28.5494, lng: 77.2001, interchange: ['Yellow Line'] },
          { name: 'IIT Delhi', lat: 28.5450, lng: 77.1930 },
          { name: 'Panchsheel Park', lat: 28.5430, lng: 77.2140 },
          { name: 'Nehru Enclave', lat: 28.5480, lng: 77.2500 },
          { name: 'Botanical Garden', lat: 28.5645, lng: 77.3344, interchange: ['Blue Line'] }
        ]
      },
      {
        id: 'aqua',
        name: 'Aqua Line (Noida-Gr Noida)',
        color: '#06B6D4',
        textColor: '#000000',
        stations: [
          { name: 'Noida Sector 51', lat: 28.5770, lng: 77.3710, interchange: ['Blue Line Sector 52'] },
          { name: 'Noida Sector 76', lat: 28.5650, lng: 77.3820 },
          { name: 'Knowledge Park II', lat: 28.4590, lng: 77.4980 },
          { name: 'Pari Chowk', lat: 28.4731, lng: 77.5106 },
          { name: 'Depot Station', lat: 28.4830, lng: 77.5300 }
        ]
      },
      {
        id: 'rapid_metro',
        name: 'Rapid Metro Gurugram',
        color: '#4F46E5',
        textColor: '#FFFFFF',
        stations: [
          { name: 'Sikanderpur', lat: 28.4818, lng: 77.0927, interchange: ['Yellow Line'] },
          { name: 'IndusInd Bank Cyber City', lat: 28.4950, lng: 77.0895 },
          { name: 'Vodafone Belvedere Towers', lat: 28.4910, lng: 77.0850 },
          { name: 'DLF Phase 2', lat: 28.4860, lng: 77.0870 },
          { name: 'Sector 55-56', lat: 28.4280, lng: 77.1060 }
        ]
      }
    ],
    busCorridors: [
      {
        routeNumber: 'DTC 534',
        name: 'Anand Vihar ISBT ↔ Mehrauli Terminal via Nehru Place',
        isAC: true,
        frequencyMinutes: 10,
        fareMin: 15,
        fareMax: 25,
        keyStops: ['Anand Vihar', 'Laxmi Nagar', 'Sarai Kale Khan', 'Lajpat Nagar', 'Nehru Place', 'Saket', 'Mehrauli']
      },
      {
        routeNumber: 'DTC 720',
        name: 'Shahdara ↔ Janakpuri B-Block via CP & Dhaula Kuan',
        isAC: false,
        frequencyMinutes: 12,
        fareMin: 10,
        fareMax: 20,
        keyStops: ['Shahdara', 'Kashmere Gate', 'Connaught Place', 'RML Hospital', 'Dhaula Kuan', 'Mayapuri', 'Janakpuri']
      },
      {
        routeNumber: 'Airport Exp 4',
        name: 'ISBT Kashmere Gate ↔ IGI Airport T3 via CP',
        isAC: true,
        frequencyMinutes: 20,
        fareMin: 50,
        fareMax: 100,
        keyStops: ['Kashmere Gate', 'New Delhi Station', 'Connaught Place', 'Dhaula Kuan', 'Aerocity', 'Airport T3']
      }
    ]
  },

  mumbai: {
    id: 'mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    center: { lat: 18.9878, lng: 72.8358 },
    bounds: {
      minLat: 18.88, maxLat: 19.30,
      minLng: 72.75, maxLng: 73.10
    },
    landmarks: [
      { id: 'bkc', name: 'Bandra Kurla Complex (BKC)', category: 'Business / Finance', lat: 19.0657, lng: 72.8682, popular: true, metroNearby: 'BKC Metro' },
      { id: 'csmt', name: 'Chhatrapati Shivaji Maharaj Terminus (CSMT)', category: 'Railway / Heritage', lat: 18.9401, lng: 72.8347, popular: true, metroNearby: 'CSMT' },
      { id: 'bom_t2', name: 'Chhatrapati Shivaji Maharaj Intl Airport (T2)', category: 'Airport', lat: 19.0886, lng: 72.8679, popular: true, metroNearby: 'Airport Road' },
      { id: 'colaba', name: 'Colaba / Gateway of India', category: 'Tourism', lat: 18.9220, lng: 72.8347, popular: true, metroNearby: 'Churchgate' },
      { id: 'andheri_e', name: 'Andheri East (MIDC / SEEPZ)', category: 'IT / Commercial', lat: 19.1136, lng: 72.8697, popular: true, metroNearby: 'Andheri Metro' },
      { id: 'powai', name: 'Powai (Hiranandani / IIT Bombay)', category: 'Tech / Residential', lat: 19.1176, lng: 72.9060, popular: true, metroNearby: 'Kanjurmarg' },
      { id: 'lower_parel', name: 'Lower Parel (High Street Phoenix)', category: 'Commercial / Mall', lat: 18.9950, lng: 72.8250, popular: true, metroNearby: 'Lower Parel' },
      { id: 'vashi', name: 'Vashi, Navi Mumbai', category: 'Suburban Hub', lat: 19.0771, lng: 72.9986, popular: false, metroNearby: 'Vashi Station' }
    ],
    metroLines: [
      {
        id: 'line1',
        name: 'Metro Line 1 (Versova ↔ Ghatkopar)',
        color: '#0284C7',
        textColor: '#FFFFFF',
        stations: [
          { name: 'Versova', lat: 19.1310, lng: 72.8170 },
          { name: 'Andheri', lat: 19.1197, lng: 72.8464, interchange: ['Western Railway'] },
          { name: 'Western Express Highway (WEH)', lat: 19.1160, lng: 72.8550 },
          { name: 'Airport Road', lat: 19.1110, lng: 72.8750 },
          { name: 'Saki Naka', lat: 19.1020, lng: 72.8870 },
          { name: 'Ghatkopar', lat: 19.0860, lng: 72.9080, interchange: ['Central Railway'] }
        ]
      },
      {
        id: 'line3',
        name: 'Metro Line 3 Aqua (Aarey ↔ BKC ↔ Cuffe Parade)',
        color: '#0D9488',
        textColor: '#FFFFFF',
        stations: [
          { name: 'Aarey JVLR', lat: 19.1410, lng: 72.8800 },
          { name: 'MIDC Andheri', lat: 19.1190, lng: 72.8680 },
          { name: 'CSMIA T2 (Airport)', lat: 19.0886, lng: 72.8679 },
          { name: 'Santacruz', lat: 19.0810, lng: 72.8530 },
          { name: 'Bandra Kurla Complex (BKC)', lat: 19.0657, lng: 72.8682 },
          { name: 'Dadar', lat: 19.0180, lng: 72.8420 },
          { name: 'CSMT', lat: 18.9401, lng: 72.8347 }
        ]
      }
    ],
    busCorridors: [
      {
        routeNumber: 'BEST AC-C40',
        name: 'Borivali ↔ Colaba Express',
        isAC: true,
        frequencyMinutes: 15,
        fareMin: 20,
        fareMax: 45,
        keyStops: ['Borivali', 'Andheri WEH', 'Bandra', 'Worli', 'Nariman Point', 'Colaba']
      },
      {
        routeNumber: 'BEST 332',
        name: 'Andheri Station ↔ Kurla Station via Saki Naka',
        isAC: false,
        frequencyMinutes: 8,
        fareMin: 6,
        fareMax: 15,
        keyStops: ['Andheri East', 'Chakala', 'Saki Naka', 'Kurla Depot']
      }
    ]
  },

  bengaluru: {
    id: 'bengaluru',
    name: 'Bengaluru',
    state: 'Karnataka',
    center: { lat: 12.9716, lng: 77.5946 },
    bounds: {
      minLat: 12.80, maxLat: 13.25,
      minLng: 77.45, maxLng: 77.80
    },
    landmarks: [
      { id: 'mg_road', name: 'MG Road / Brigade Road', category: 'City Centre / Shopping', lat: 12.9756, lng: 77.6066, popular: true, metroNearby: 'MG Road' },
      { id: 'indiranagar', name: 'Indiranagar 100ft Road', category: 'Dining / Shopping', lat: 12.9784, lng: 77.6408, popular: true, metroNearby: 'Indiranagar' },
      { id: 'koramangala', name: 'Koramangala 5th Block', category: 'Tech / Startup Hub', lat: 12.9352, lng: 77.6245, popular: true, metroNearby: 'South End Circle (Feeder)' },
      { id: 'whitefield', name: 'Whitefield (ITPL / Forum Mall)', category: 'Tech Park', lat: 12.9866, lng: 77.7380, popular: true, metroNearby: 'ITPL / Whitefield' },
      { id: 'blr_airport', name: 'Kempegowda Intl Airport (BLR)', category: 'Airport', lat: 13.1986, lng: 77.7066, popular: true, metroNearby: 'Airport Feeder' },
      { id: 'majestic', name: 'KSR Bengaluru City / Majestic Bus Stand', category: 'Railway / Transit Hub', lat: 12.9780, lng: 77.5724, popular: true, metroNearby: 'Nadaprabhu Kempegowda Majestic' },
      { id: 'electronic_city', name: 'Electronic City Phase 1', category: 'IT Hub', lat: 12.8399, lng: 77.6770, popular: true, metroNearby: 'Electronic City' },
      { id: 'hsr_layout', name: 'HSR Layout Sector 1', category: 'Startup / Residential', lat: 12.9121, lng: 77.6446, popular: true, metroNearby: 'Silk Board' }
    ],
    metroLines: [
      {
        id: 'purple',
        name: 'Namma Metro Purple Line (Challaghatta ↔ Whitefield)',
        color: '#9333EA',
        textColor: '#FFFFFF',
        stations: [
          { name: 'Kengeri', lat: 12.9080, lng: 77.4850 },
          { name: 'Majestic', lat: 12.9780, lng: 77.5724, interchange: ['Green Line'] },
          { name: 'Central College', lat: 12.9760, lng: 77.5850 },
          { name: 'Vidhana Soudha', lat: 12.9790, lng: 77.5920 },
          { name: 'MG Road', lat: 12.9756, lng: 77.6066 },
          { name: 'Indiranagar', lat: 12.9784, lng: 77.6408 },
          { name: 'Baiyappanahalli', lat: 12.9910, lng: 77.6520 },
          { name: 'KR Puram', lat: 13.0010, lng: 77.6970 },
          { name: 'Garudachar Palya', lat: 12.9930, lng: 77.7120 },
          { name: 'ITPL / Whitefield', lat: 12.9866, lng: 77.7380 }
        ]
      },
      {
        id: 'green',
        name: 'Namma Metro Green Line (Nagasandra ↔ Silk Institute)',
        color: '#16A34A',
        textColor: '#FFFFFF',
        stations: [
          { name: 'Nagasandra', lat: 13.0480, lng: 77.5000 },
          { name: 'Yeshwanthpur', lat: 13.0230, lng: 77.5500 },
          { name: 'Majestic', lat: 12.9780, lng: 77.5724, interchange: ['Purple Line'] },
          { name: 'Jayanagar', lat: 12.9300, lng: 77.5800 },
          { name: 'Banashankari', lat: 12.9150, lng: 77.5730 },
          { name: 'Silk Institute', lat: 12.8620, lng: 77.5250 }
        ]
      }
    ],
    busCorridors: [
      {
        routeNumber: 'KIA-9 (Vayu Vajra)',
        name: 'Majestic ↔ Kempegowda Intl Airport BLR',
        isAC: true,
        frequencyMinutes: 15,
        fareMin: 220,
        fareMax: 260,
        keyStops: ['Majestic', 'Hebbal', 'Yelahanka', 'Airport BLR']
      },
      {
        routeNumber: 'BMTC 500-D',
        name: 'Silk Board ↔ Hebbal via Outer Ring Road (ORR)',
        isAC: true,
        frequencyMinutes: 7,
        fareMin: 25,
        fareMax: 45,
        keyStops: ['Central Silk Board', 'HSR Layout', 'Bellandur', 'Marathahalli', 'KR Puram', 'Hebbal']
      }
    ]
  },

  hyderabad: {
    id: 'hyderabad',
    name: 'Hyderabad',
    state: 'Telangana',
    center: { lat: 17.3850, lng: 78.4867 },
    bounds: {
      minLat: 17.20, maxLat: 17.60,
      minLng: 78.20, maxLng: 78.65
    },
    landmarks: [
      { id: 'hitec_city', name: 'Hitec City (Cyber Towers)', category: 'IT Hub', lat: 17.4504, lng: 78.3808, popular: true, metroNearby: 'Hitec City' },
      { id: 'gachibowli', name: 'Gachibowli Stadium & Tech Parks', category: 'Tech Hub', lat: 17.4401, lng: 78.3489, popular: true, metroNearby: 'Raidurg' },
      { id: 'charminar', name: 'Charminar & Old City', category: 'Heritage / Tourism', lat: 17.3616, lng: 78.4747, popular: true, metroNearby: 'MGBS' },
      { id: 'secunderabad', name: 'Secunderabad Junction Railway Station', category: 'Transit / Railway', lat: 17.4334, lng: 78.5045, popular: true, metroNearby: 'Secunderabad East' },
      { id: 'hyd_airport', name: 'Rajiv Gandhi Intl Airport (HYD)', category: 'Airport', lat: 17.2403, lng: 78.4294, popular: true, metroNearby: 'Airport Pushpak Bus' }
    ],
    metroLines: [
      {
        id: 'blue_hyd',
        name: 'Blue Line (Nagole ↔ Raidurg)',
        color: '#2563EB',
        textColor: '#FFFFFF',
        stations: [
          { name: 'Nagole', lat: 17.3800, lng: 78.5600 },
          { name: 'Secunderabad East', lat: 17.4334, lng: 78.5045, interchange: ['Green Line'] },
          { name: 'Ameerpet', lat: 17.4370, lng: 78.4480, interchange: ['Red Line'] },
          { name: 'Madhapur', lat: 17.4420, lng: 78.3960 },
          { name: 'Hitec City', lat: 17.4504, lng: 78.3808 },
          { name: 'Raidurg', lat: 17.4401, lng: 78.3750 }
        ]
      }
    ],
    busCorridors: [
      {
        routeNumber: 'Pushpak AC',
        name: 'Secunderabad ↔ RGIA Airport via AC Corridors',
        isAC: true,
        frequencyMinutes: 20,
        fareMin: 150,
        fareMax: 250,
        keyStops: ['Secunderabad', 'Begumpet', 'Mehdipatnam', 'RGIA Airport']
      }
    ]
  },

  pune: {
    id: 'pune',
    name: 'Pune',
    state: 'Maharashtra',
    center: { lat: 18.5204, lng: 73.8567 },
    bounds: {
      minLat: 18.40, maxLat: 18.65,
      minLng: 73.70, maxLng: 74.00
    },
    landmarks: [
      { id: 'hinjawadi', name: 'Hinjawadi Phase 1 (Infotech Park)', category: 'IT / Tech Hub', lat: 18.5913, lng: 73.7389, popular: true, metroNearby: 'Hinjawadi Feeder' },
      { id: 'shivajinagar', name: 'Shivajinagar Station & Bus Stand', category: 'Transit Hub', lat: 18.5314, lng: 73.8446, popular: true, metroNearby: 'Shivajinagar Metro' },
      { id: 'koregaon_park', name: 'Koregaon Park (North Main Road)', category: 'Dining / Lifestyle', lat: 18.5362, lng: 73.8940, popular: true, metroNearby: 'Bund Garden' },
      { id: 'pune_airport', name: 'Pune Lohegaon Airport (PNQ)', category: 'Airport', lat: 18.5822, lng: 73.9197, popular: true, metroNearby: 'Ramwadi Metro + Auto' }
    ],
    metroLines: [
      {
        id: 'purple_pune',
        name: 'Purple Line (PCMC ↔ Swargate)',
        color: '#9333EA',
        textColor: '#FFFFFF',
        stations: [
          { name: 'PCMC', lat: 18.6280, lng: 73.8050 },
          { name: 'Shivajinagar', lat: 18.5314, lng: 73.8446 },
          { name: 'Civil Court', lat: 18.5250, lng: 73.8550, interchange: ['Aqua Line'] },
          { name: 'Swargate', lat: 18.5000, lng: 73.8580 }
        ]
      }
    ],
    busCorridors: [
      {
        routeNumber: 'PMPML Rainbow 100',
        name: 'Hinjawadi Maan Phase 3 ↔ Pune Station',
        isAC: true,
        frequencyMinutes: 12,
        fareMin: 15,
        fareMax: 40,
        keyStops: ['Hinjawadi', 'Wakad', 'Aundh', 'Shivajinagar', 'Pune Station']
      }
    ]
  }
};
