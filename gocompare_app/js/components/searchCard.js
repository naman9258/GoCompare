/**
 * Search Card Component
 * Uses SVG Icon system for crisp, modern, professional UI/UX.
 */

import { StorageService } from '../services/storageService.js';
import { CITIES_DATA } from '../data/cities.js';
import { Icons } from './icons.js';

export class SearchCard {
  constructor(containerId, onSearchCallback) {
    this.container = document.getElementById(containerId);
    this.onSearch = onSearchCallback;
    this.currentCityId = 'delhi_ncr';
    
    this.origin = { name: 'Connaught Place (Rajiv Chowk)', lat: 28.6328, lng: 77.2197 };
    this.destination = { name: 'Gurugram Cyber Hub', lat: 28.4950, lng: 77.0895 };
    
    this.activeInputType = null;
    this.init();
  }

  setCity(cityId) {
    this.currentCityId = cityId;
    const city = CITIES_DATA[cityId];
    if (city && city.landmarks.length >= 2) {
      this.origin = city.landmarks[0];
      this.destination = city.landmarks[1];
      this.updateInputFields();
    }
  }

  init() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="search-card-root">
        <div class="search-inputs-container">
          <!-- Route Connector Line -->
          <div class="inputs-left-indicator">
            <span class="indicator-dot pickup-dot"></span>
            <span class="indicator-line"></span>
            <span class="indicator-dot dropoff-dot"></span>
          </div>

          <!-- Input Fields -->
          <div class="inputs-fields-wrapper">
            <!-- Pickup Input -->
            <div class="search-field-row">
              <label for="pickupInput" class="visually-hidden">Pickup Location</label>
              <input 
                type="text" 
                id="pickupInput" 
                class="search-input" 
                placeholder="Enter pickup location" 
                autocomplete="off"
                value="${this.origin.name}" 
              />
              <button type="button" class="btn-input-action" id="btnCurrentLocation" title="Use current location" aria-label="Use current location">
                <span class="icon-inline">${Icons.target(16)}</span>
                <span class="btn-action-label">Locate</span>
              </button>
            </div>

            <div class="input-divider"></div>

            <!-- Destination Input -->
            <div class="search-field-row">
              <label for="destInput" class="visually-hidden">Destination Location</label>
              <input 
                type="text" 
                id="destInput" 
                class="search-input" 
                placeholder="Where do you want to go?" 
                autocomplete="off"
                value="${this.destination.name}" 
              />
            </div>
          </div>

          <!-- Swap Button -->
          <button type="button" class="btn-swap-locations" id="btnSwapLocations" title="Swap pickup and destination" aria-label="Swap pickup and destination">
            ${Icons.swap(18)}
          </button>
        </div>

        <!-- Autocomplete Suggestions Dropdown -->
        <div class="autocomplete-dropdown hidden" id="autocompleteDropdown" role="listbox"></div>

        <!-- Quick Chips with Vector Icons -->
        <div class="quick-chips-scrollable" id="quickChipsContainer">
          <button type="button" class="quick-chip" data-quick="home">
            <span class="chip-svg">${Icons.home(15)}</span> Home
          </button>
          <button type="button" class="quick-chip" data-quick="work">
            <span class="chip-svg">${Icons.work(15)}</span> Work
          </button>
          <button type="button" class="quick-chip" data-quick="airport">
            <span class="chip-svg">${Icons.airport(15)}</span> Airport
          </button>
          <button type="button" class="quick-chip" data-quick="railway">
            <span class="chip-svg">${Icons.railway(15)}</span> Railway
          </button>
          <button type="button" class="quick-chip" data-quick="popular">
            <span class="chip-svg">${Icons.flame(15)}</span> Popular
          </button>
        </div>

        <!-- Primary CTA: Compare Options -->
        <button type="button" class="btn-primary-compare" id="btnCompareRoutes">
          <span class="btn-icon-svg">${Icons.bolt(18)}</span> Compare All Options
        </button>

        <!-- Recent Searches List -->
        <div class="recent-searches-preview" id="recentSearchesPreview"></div>
      </div>
    `;

    this.pickupInput = document.getElementById('pickupInput');
    this.destInput = document.getElementById('destInput');
    this.dropdown = document.getElementById('autocompleteDropdown');

    this.bindEvents();
    this.renderRecentSearches();
  }

  updateInputFields() {
    if (this.pickupInput) this.pickupInput.value = this.origin.name;
    if (this.destInput) this.destInput.value = this.destination.name;
  }

  bindEvents() {
    const swapBtn = document.getElementById('btnSwapLocations');
    const currentLocBtn = document.getElementById('btnCurrentLocation');
    const compareBtn = document.getElementById('btnCompareRoutes');
    const chipsContainer = document.getElementById('quickChipsContainer');

    if (swapBtn) {
      swapBtn.onclick = () => {
        const temp = { ...this.origin };
        this.origin = { ...this.destination };
        this.destination = temp;
        this.updateInputFields();
        this.triggerSearch();
      };
    }

    if (currentLocBtn) {
      currentLocBtn.onclick = () => this.useCurrentLocation();
    }

    if (compareBtn) {
      compareBtn.onclick = () => this.triggerSearch();
    }

    this.pickupInput.onfocus = () => this.showSuggestions('origin', this.pickupInput.value);
    this.pickupInput.oninput = (e) => this.showSuggestions('origin', e.target.value);

    this.destInput.onfocus = () => this.showSuggestions('destination', this.destInput.value);
    this.destInput.oninput = (e) => this.showSuggestions('destination', e.target.value);

    document.addEventListener('click', (e) => {
      if (!this.container.contains(e.target)) {
        this.closeSuggestions();
      }
    });

    if (chipsContainer) {
      chipsContainer.onclick = (e) => {
        const chip = e.target.closest('.quick-chip');
        if (!chip) return;
        const type = chip.dataset.quick;
        this.applyQuickChip(type);
      };
    }
  }

  useCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          this.origin = {
            name: 'Current Location (GPS)',
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          };
          this.pickupInput.value = this.origin.name;
          this.triggerSearch();
        },
        () => {
          const city = CITIES_DATA[this.currentCityId] || CITIES_DATA['delhi_ncr'];
          const hub = city.landmarks[0];
          this.origin = { ...hub, name: `Current Location (${hub.name})` };
          this.pickupInput.value = this.origin.name;
          this.triggerSearch();
        },
        { timeout: 5000 }
      );
    } else {
      const city = CITIES_DATA[this.currentCityId] || CITIES_DATA['delhi_ncr'];
      const hub = city.landmarks[0];
      this.origin = { ...hub, name: `Current Location (${hub.name})` };
      this.pickupInput.value = this.origin.name;
      this.triggerSearch();
    }
  }

  showSuggestions(type, query) {
    this.activeInputType = type;
    const city = CITIES_DATA[this.currentCityId] || CITIES_DATA['delhi_ncr'];
    const q = (query || '').toLowerCase().trim();

    let matches = city.landmarks;
    if (q) {
      matches = city.landmarks.filter(lm => 
        lm.name.toLowerCase().includes(q) || 
        lm.category.toLowerCase().includes(q) ||
        (lm.metroNearby && lm.metroNearby.toLowerCase().includes(q))
      );
    }

    if (!matches.length) {
      this.dropdown.innerHTML = `
        <div class="autocomplete-empty">
          <div class="empty-svg-icon">${Icons.search(22)}</div>
          <span>No matching locations found in ${city.name}</span>
          <small>Try landmarks, metro stations, or airports</small>
        </div>
      `;
      this.dropdown.classList.remove('hidden');
      return;
    }

    this.dropdown.innerHTML = matches.map(lm => {
      let icon = Icons.pin(18);
      if (lm.category.includes('Airport')) icon = Icons.airport(18);
      else if (lm.category.includes('Railway')) icon = Icons.railway(18);
      else if (lm.category.includes('Metro')) icon = Icons.metro(18);

      return `
        <div class="autocomplete-item" data-id="${lm.id}" data-name="${lm.name}" data-lat="${lm.lat}" data-lng="${lm.lng}">
          <div class="item-icon">${icon}</div>
          <div class="item-info">
            <div class="item-title">${lm.name}</div>
            <div class="item-sub">${lm.category} · Metro: ${lm.metroNearby || 'Nearby'}</div>
          </div>
        </div>
      `;
    }).join('');

    this.dropdown.querySelectorAll('.autocomplete-item').forEach(el => {
      el.onclick = () => {
        const item = {
          id: el.dataset.id,
          name: el.dataset.name,
          lat: parseFloat(el.dataset.lat),
          lng: parseFloat(el.dataset.lng)
        };
        if (this.activeInputType === 'origin') {
          this.origin = item;
          this.pickupInput.value = item.name;
        } else {
          this.destination = item;
          this.destInput.value = item.name;
        }
        this.closeSuggestions();
        this.triggerSearch();
      };
    });

    this.dropdown.classList.remove('hidden');
  }

  closeSuggestions() {
    if (this.dropdown) {
      this.dropdown.classList.add('hidden');
    }
  }

  applyQuickChip(type) {
    const city = CITIES_DATA[this.currentCityId] || CITIES_DATA['delhi_ncr'];
    const saved = StorageService.getSavedPlaces();

    if (type === 'home') {
      const home = saved.find(s => s.title === 'Home');
      if (home) {
        this.destination = { name: home.subtitle, lat: home.lat, lng: home.lng };
        this.destInput.value = this.destination.name;
        this.triggerSearch();
      }
    } else if (type === 'work') {
      const work = saved.find(s => s.title === 'Work');
      if (work) {
        this.destination = { name: work.subtitle, lat: work.lat, lng: work.lng };
        this.destInput.value = this.destination.name;
        this.triggerSearch();
      }
    } else if (type === 'airport') {
      const airport = city.landmarks.find(l => l.category.includes('Airport')) || city.landmarks[2];
      this.destination = airport;
      this.destInput.value = airport.name;
      this.triggerSearch();
    } else if (type === 'railway') {
      const railway = city.landmarks.find(l => l.category.includes('Railway')) || city.landmarks[3];
      this.destination = railway;
      this.destInput.value = railway.name;
      this.triggerSearch();
    } else if (type === 'popular') {
      const pop = city.landmarks.find(l => l.popular && l.id !== this.origin.id) || city.landmarks[1];
      this.destination = pop;
      this.destInput.value = pop.name;
      this.triggerSearch();
    }
  }

  renderRecentSearches() {
    const container = document.getElementById('recentSearchesPreview');
    if (!container) return;

    const recents = StorageService.getRecentSearches();
    if (!recents.length) {
      container.innerHTML = '';
      return;
    }

    container.innerHTML = `
      <div class="recent-searches-header">
        <span class="recent-title">Recent Searches</span>
        <button type="button" class="btn-clear-history" id="btnClearHistory">Clear</button>
      </div>
      <div class="recent-searches-list">
        ${recents.slice(0, 3).map(r => `
          <div class="recent-search-pill" data-origin='${JSON.stringify(r.from)}' data-dest='${JSON.stringify(r.to)}'>
            <span class="pill-svg">${Icons.clock(13)}</span>
            <span class="pill-text">${r.from.name.split('(')[0].trim()} → ${r.to.name.split('(')[0].trim()}</span>
          </div>
        `).join('')}
      </div>
    `;

    container.querySelectorAll('.recent-search-pill').forEach(pill => {
      pill.onclick = () => {
        this.origin = JSON.parse(pill.dataset.origin);
        this.destination = JSON.parse(pill.dataset.dest);
        this.updateInputFields();
        this.triggerSearch();
      };
    });

    const clearBtn = document.getElementById('btnClearHistory');
    if (clearBtn) {
      clearBtn.onclick = () => {
        StorageService.clearRecentSearches();
        this.renderRecentSearches();
      };
    }
  }

  triggerSearch() {
    this.closeSuggestions();
    if (this.origin && this.destination) {
      StorageService.saveRecentSearch(this.origin, this.destination, this.currentCityId);
      this.renderRecentSearches();
      if (this.onSearch) {
        this.onSearch(this.origin, this.destination, this.currentCityId);
      }
    }
  }
}
