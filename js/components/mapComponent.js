/**
 * Modern Interactive City & Transit Map Component
 * Supports Leaflet.js with CartoDB/OpenStreetMap live tiles,
 * real street network, metro line overlays, animated routes,
 * and a refined SVG fallback if offline.
 */

import { Icons } from './icons.js';

export class MapComponent {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.leafletMap = null;
    this.routeLayer = null;
    this.metroLayers = [];
    this.markerLayers = [];
    this.tileLayer = null;
    this.isExpanded = false;
    this.currentCity = null;
    this.currentOrigin = null;
    this.currentDestination = null;
    this.activeOption = null;
    this.allOptions = [];
    this.showMetroLines = true;
    this.init();
  }

  init() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="map-wrapper" id="mapWrapper">
        <!-- Floating Controls -->
        <div class="map-controls">
          <button class="map-btn" id="mapRecenter" title="Center on Route" aria-label="Center on Route">
            ${Icons.target(16)}
          </button>
          <button class="map-btn" id="mapToggleMetro" title="Toggle Metro Network Layer" aria-label="Toggle Metro Network Layer">
            ${Icons.metro(16)}
          </button>
          <button class="map-btn" id="mapToggleExpand" title="Expand Map" aria-label="Expand or collapse map">
            ${Icons.scale(16)}
          </button>
        </div>

        <!-- Mode Legend Bar -->
        <div class="map-legend">
          <span class="legend-item"><span class="legend-icon text-cab">${Icons.cab(13)}</span>Cab</span>
          <span class="legend-item"><span class="legend-icon text-auto">${Icons.auto(13)}</span>Auto</span>
          <span class="legend-item"><span class="legend-icon text-moto">${Icons.moto(13)}</span>Moto</span>
          <span class="legend-item"><span class="legend-icon text-metro">${Icons.metro(13)}</span>Metro</span>
          <span class="legend-item"><span class="legend-icon text-bus">${Icons.bus(13)}</span>Bus</span>
          <span class="legend-item"><span class="legend-icon text-walk">${Icons.walk(13)}</span>Walk</span>
        </div>

        <!-- Leaflet Container -->
        <div id="leafletMapContainer" class="leaflet-map-canvas"></div>

        <!-- SVG Fallback Container (used if Leaflet is unavailable) -->
        <div id="svgMapFallback" class="svg-map-canvas hidden">
          <svg id="vectorMapSvg" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet"></svg>
        </div>
      </div>
    `;

    this.wrapper = document.getElementById('mapWrapper');
    this.setupInteractions();
    this.initLeaflet();
  }

  setupInteractions() {
    const recenter = document.getElementById('mapRecenter');
    const toggleExpand = document.getElementById('mapToggleExpand');
    const toggleMetro = document.getElementById('mapToggleMetro');

    if (recenter) {
      recenter.onclick = () => this.fitToRoute();
    }

    if (toggleExpand) {
      toggleExpand.onclick = () => this.toggleMapExpansion();
    }

    if (toggleMetro) {
      toggleMetro.onclick = () => {
        this.showMetroLines = !this.showMetroLines;
        toggleMetro.classList.toggle('active', this.showMetroLines);
        this.updateMetroLayerVisibility();
      };
    }
  }

  initLeaflet() {
    if (typeof window.L === 'undefined') {
      console.info('Leaflet library not loaded via CDN, utilizing high-detail SVG vector engine.');
      document.getElementById('leafletMapContainer')?.classList.add('hidden');
      document.getElementById('svgMapFallback')?.classList.remove('hidden');
      return;
    }

    try {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const tileUrl = isDark 
        ? 'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

      this.leafletMap = window.L.map('leafletMapContainer', {
        zoomControl: false,
        attributionControl: false
      }).setView([28.6139, 77.2090], 11);

      // Custom Zoom Control placed at top-left
      window.L.control.zoom({ position: 'topleft' }).addTo(this.leafletMap);

      this.tileLayer = window.L.tileLayer(tileUrl, {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(this.leafletMap);

      this.routeLayer = window.L.layerGroup().addTo(this.leafletMap);

    } catch (e) {
      console.warn('Leaflet initialization error:', e);
      document.getElementById('leafletMapContainer')?.classList.add('hidden');
      document.getElementById('svgMapFallback')?.classList.remove('hidden');
    }
  }

  toggleMapExpansion() {
    this.isExpanded = !this.isExpanded;
    if (this.wrapper) {
      this.wrapper.classList.toggle('expanded', this.isExpanded);
    }
    setTimeout(() => {
      if (this.leafletMap) {
        this.leafletMap.invalidateSize();
        this.fitToRoute();
      }
    }, 250);
  }

  fitToRoute() {
    if (!this.leafletMap || !this.currentOrigin || !this.currentDestination) return;

    const bounds = window.L.latLngBounds([
      [this.currentOrigin.lat, this.currentOrigin.lng],
      [this.currentDestination.lat, this.currentDestination.lng]
    ]);

    this.leafletMap.fitBounds(bounds, {
      padding: [70, 70],
      maxZoom: 14,
      animate: true,
      duration: 0.8
    });
  }

  updateMetroLayerVisibility() {
    if (!this.leafletMap) return;
    this.metroLayers.forEach(layer => {
      if (this.showMetroLines) {
        this.leafletMap.addLayer(layer);
      } else {
        this.leafletMap.removeLayer(layer);
      }
    });
  }

  render(cityData, origin, destination, options = [], selectedOption = null) {
    this.currentCity = cityData;
    this.currentOrigin = origin;
    this.currentDestination = destination;
    this.allOptions = options;
    this.activeOption = selectedOption || options[0] || null;

    if (this.leafletMap) {
      this.renderLeafletMap();
    } else {
      this.renderSvgMap();
    }
  }

  renderLeafletMap() {
    if (!this.leafletMap || !this.currentOrigin || !this.currentDestination) return;

    // Clear previous route & markers
    this.routeLayer.clearLayers();
    this.metroLayers.forEach(l => this.leafletMap.removeLayer(l));
    this.metroLayers = [];

    const modeColors = {
      cab: '#2563EB',
      auto: '#EA580C',
      moto: '#DC2626',
      metro: '#9333EA',
      bus: '#16A34A',
      mixed: '#0D9488'
    };

    const routeColor = modeColors[this.activeOption?.mode] || '#2563EB';

    // 1. Draw Metro Network Lines
    if (this.currentCity.metroLines) {
      this.currentCity.metroLines.forEach(line => {
        const latLngs = line.stations.map(s => [s.lat, s.lng]);
        
        // Track line
        const metroPoly = window.L.polyline(latLngs, {
          color: line.color,
          weight: 4,
          opacity: 0.6,
          lineCap: 'round',
          lineJoin: 'round'
        });

        // Station circles
        const stationMarkers = line.stations.map(st => {
          const isInterchange = st.interchange && st.interchange.length > 0;
          const circle = window.L.circleMarker([st.lat, st.lng], {
            radius: isInterchange ? 5.5 : 3.5,
            fillColor: '#FFFFFF',
            color: line.color,
            weight: isInterchange ? 3 : 2,
            opacity: 0.9,
            fillOpacity: 1
          });
          circle.bindTooltip(`<b>${st.name}</b><br/><small>${line.name}</small>`, { direction: 'top', offset: [0, -6] });
          return circle;
        });

        const group = window.L.layerGroup([metroPoly, ...stationMarkers]);
        this.metroLayers.push(group);
        if (this.showMetroLines) {
          this.leafletMap.addLayer(group);
        }
      });
    }

    // 2. Draw Active Route Polyline
    let routeCoords = [];
    if (this.activeOption?.route && this.activeOption.route.length > 2) {
      routeCoords = this.activeOption.route.map(pt => [pt.lat, pt.lng]);
    } else {
      // Natural arc simulating realistic road curvature
      const o = this.currentOrigin;
      const d = this.currentDestination;
      const midLat = (o.lat + d.lat) / 2 + (d.lng - o.lng) * 0.12;
      const midLng = (o.lng + d.lng) / 2 - (d.lat - o.lat) * 0.12;
      routeCoords = [[o.lat, o.lng], [midLat, midLng], [d.lat, d.lng]];
    }

    // Outer Glow Polyline
    const glowLine = window.L.polyline(routeCoords, {
      color: routeColor,
      weight: 10,
      opacity: 0.25,
      lineCap: 'round'
    });

    // Core Route Polyline
    const coreLine = window.L.polyline(routeCoords, {
      color: routeColor,
      weight: 5,
      opacity: 0.9,
      lineCap: 'round'
    });

    // Animated dashed pulse polyline
    const pulseLine = window.L.polyline(routeCoords, {
      color: '#FFFFFF',
      weight: 2.5,
      dashArray: '8, 14',
      opacity: 0.9,
      className: 'leaflet-pulse-flow'
    });

    this.routeLayer.addLayer(glowLine);
    this.routeLayer.addLayer(coreLine);
    this.routeLayer.addLayer(pulseLine);

    // 3. Midpoint Info Badge
    const midIdx = Math.floor(routeCoords.length / 2);
    const midPoint = routeCoords[midIdx];
    const badgeIcon = window.L.divIcon({
      className: 'leaflet-midpoint-badge',
      html: `
        <div class="mid-badge-bubble">
          <b>${this.activeOption.durationDisplay}</b> · ${this.activeOption.fareDisplay}
        </div>
      `,
      iconSize: [110, 30],
      iconAnchor: [55, 15]
    });
    this.routeLayer.addLayer(window.L.marker(midPoint, { icon: badgeIcon }));

    // 4. Pickup and Dropoff Pins
    const pickupPin = window.L.divIcon({
      className: 'leaflet-custom-pin pickup',
      html: `
        <div class="pin-marker pickup">
          <div class="pin-ring"></div>
          <div class="pin-core"></div>
          <div class="pin-label">Pickup</div>
        </div>
      `,
      iconSize: [80, 40],
      iconAnchor: [40, 20]
    });

    const dropoffPin = window.L.divIcon({
      className: 'leaflet-custom-pin dropoff',
      html: `
        <div class="pin-marker dropoff">
          <div class="pin-ring"></div>
          <div class="pin-core"></div>
          <div class="pin-label">Dropoff</div>
        </div>
      `,
      iconSize: [80, 40],
      iconAnchor: [40, 20]
    });

    const markerOrig = window.L.marker([this.currentOrigin.lat, this.currentOrigin.lng], { icon: pickupPin })
      .bindPopup(`<b>Pickup Location</b><br/>${this.currentOrigin.name}`);
    const markerDest = window.L.marker([this.currentDestination.lat, this.currentDestination.lng], { icon: dropoffPin })
      .bindPopup(`<b>Destination Location</b><br/>${this.currentDestination.name}`);

    this.routeLayer.addLayer(markerOrig);
    this.routeLayer.addLayer(markerDest);

    // Fit view
    this.fitToRoute();
  }

  // Refined SVG Fallback with Collision-Free Staggered Labels
  renderSvgMap() {
    const svg = document.getElementById('vectorMapSvg');
    if (!svg || !this.currentCity) return;

    const bounds = this.currentCity.bounds;
    const originPt = this.projectSvg(this.currentOrigin.lat, this.currentOrigin.lng, bounds);
    const destPt = this.projectSvg(this.currentDestination.lat, this.currentDestination.lng, bounds);

    const modeColors = {
      cab: '#2563EB', auto: '#EA580C', moto: '#DC2626',
      metro: '#9333EA', bus: '#16A34A', mixed: '#0D9488'
    };
    const routeColor = modeColors[this.activeOption?.mode] || '#2563EB';

    const midX = (originPt.x + destPt.x) / 2 + (destPt.y - originPt.y) * 0.15;
    const midY = (originPt.y + destPt.y) / 2 - (destPt.x - originPt.x) * 0.15;
    const pathD = `M ${originPt.x} ${originPt.y} Q ${midX} ${midY} ${destPt.x} ${destPt.y}`;

    // Render Clean SVG with Staggered Non-Overlapping Labels
    svg.innerHTML = `
      <rect width="1000" height="600" fill="#F8FAFC" />
      <g id="svgRoads">
        <circle cx="500" cy="300" r="280" fill="none" stroke="#E2E8F0" stroke-width="2" stroke-dasharray="6,6" />
        <circle cx="500" cy="300" r="140" fill="none" stroke="#E2E8F0" stroke-width="2" />
      </g>
      <path d="${pathD}" fill="none" stroke="${routeColor}" stroke-width="8" opacity="0.3" stroke-linecap="round" />
      <path d="${pathD}" fill="none" stroke="${routeColor}" stroke-width="4.5" stroke-linecap="round" />
      <path d="${pathD}" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="8,14" class="animated-route-flow" />
      
      <!-- Staggered Landmarks to Prevent Overlap -->
      ${this.renderStaggeredLandmarks(this.currentCity, bounds)}

      <!-- Origin and Destination Pins -->
      <g transform="translate(${originPt.x}, ${originPt.y})">
        <circle r="12" fill="#16A34A" opacity="0.2" class="pin-pulse" />
        <circle r="7" fill="#16A34A" stroke="#FFFFFF" stroke-width="2.5" />
        <rect x="-35" y="-24" width="70" height="20" rx="10" fill="#15803D" />
        <text x="0" y="-10" text-anchor="middle" fill="#FFFFFF" font-size="10" font-weight="700">Pickup</text>
      </g>
      <g transform="translate(${destPt.x}, ${destPt.y})">
        <circle r="12" fill="#DC2626" opacity="0.2" class="pin-pulse" />
        <circle r="7" fill="#DC2626" stroke="#FFFFFF" stroke-width="2.5" />
        <rect x="-35" y="-24" width="70" height="20" rx="10" fill="#991B1B" />
        <text x="0" y="-10" text-anchor="middle" fill="#FFFFFF" font-size="10" font-weight="700">Dropoff</text>
      </g>
    `;
  }

  renderStaggeredLandmarks(city, bounds) {
    const lms = city.landmarks || [];
    return lms.slice(0, 8).map((lm, i) => {
      const pt = this.projectSvg(lm.lat, lm.lng, bounds);
      const dy = (i % 2 === 0) ? -8 : 14;
      return `
        <g transform="translate(${pt.x}, ${pt.y})">
          <circle r="3" fill="#64748B" />
          <text x="7" y="${dy}" font-size="9" fill="#475569" font-weight="600">${lm.name.split('(')[0].trim()}</text>
        </g>
      `;
    }).join('');
  }

  projectSvg(lat, lng, bounds) {
    const x = ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 880 + 60;
    const y = ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * 480 + 60;
    return { x: Math.round(x), y: Math.round(y) };
  }

  selectOption(option) {
    this.activeOption = option;
    this.render(this.currentCity, this.currentOrigin, this.currentDestination, this.allOptions, option);
  }
}
