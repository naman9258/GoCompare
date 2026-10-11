/**
 * Main Application Controller for GoCompare
 */

import { ProviderManager } from './providers/providerManager.js';
import { TradeoffEngine } from './services/tradeoffEngine.js';
import { StorageService } from './services/storageService.js';
import { CITIES_DATA } from './data/cities.js';
import { MapComponent } from './components/mapComponent.js';
import { SearchCard } from './components/searchCard.js';
import { ResultsView } from './components/resultsView.js';
import { ComparisonModal } from './components/comparisonModal.js';
import { DetailModal } from './components/detailModal.js';
import { AIAssistantModal } from './components/aiAssistantModal.js';
import { SettingsModal } from './components/settingsModal.js';
import { BookingModal } from './components/bookingModal.js';

class GoCompareApp {
  constructor() {
    this.providerManager = new ProviderManager();
    this.currentCityId = 'delhi_ncr';
    this.activeOrigin = null;
    this.activeDestination = null;
    this.currentResults = null;
    this.selectedOption = null;

    this.init();
  }

  async init() {
    // 1. Initialize user settings and theme
    const settings = StorageService.getSettings();
    this.currentCityId = settings.city || 'delhi_ncr';
    this.applyTheme(settings.theme || 'system');

    // 2. Initialize Modals
    this.comparisonModal = new ComparisonModal('comparisonModalRoot', {
      onBook: (opt) => this.handleBook(opt),
      onViewDetail: (opt) => this.handleViewDetail(opt)
    });

    this.detailModal = new DetailModal('detailModalRoot', {
      onBookProvider: (opt) => this.handleBook(opt)
    });

    this.aiModal = new AIAssistantModal('aiAssistantModalRoot', {
      onSelectOption: (opt) => this.handleSelectOption(opt)
    });

    this.bookingModal = new BookingModal('bookingModalRoot');

    this.settingsModal = new SettingsModal('settingsModalRoot', {
      onCityChange: (newCityId) => this.handleCityChange(newCityId),
      onThemeChange: (theme) => this.applyTheme(theme)
    });

    // 3. Initialize Map Component
    this.mapComponent = new MapComponent('mapContainer');

    // 4. Initialize Search Card Component
    this.searchCard = new SearchCard('searchCardContainer', (origin, destination, cityId) => {
      this.executeRouteComparison(origin, destination, cityId);
    });
    this.searchCard.setCity(this.currentCityId);

    // 5. Initialize Results View Component
    this.resultsView = new ResultsView('resultsContainer', {
      onSelectOption: (opt) => this.handleSelectOption(opt),
      onOpenDetail: (opt) => this.handleViewDetail(opt),
      onCompareSelected: (options) => this.handleLaunchCompare(options),
      onBookProvider: (opt) => this.handleBook(opt)
    });

    // 6. Header & Navigation interactions
    this.bindHeaderNav();

    // 7. Initial load comparison
    const city = CITIES_DATA[this.currentCityId];
    this.activeOrigin = city.landmarks[0];
    this.activeDestination = city.landmarks[1];
    this.executeRouteComparison(this.activeOrigin, this.activeDestination, this.currentCityId);
  }

  bindHeaderNav() {
    const btnOpenAI = document.getElementById('btnOpenAI');
    const btnOpenSettings = document.getElementById('btnOpenSettings');
    const citySelectorBtn = document.getElementById('headerCitySelector');
    const appLogoBtn = document.getElementById('appLogoBtn');

    if (btnOpenAI) {
      btnOpenAI.onclick = () => this.aiModal.show();
    }

    if (btnOpenSettings) {
      btnOpenSettings.onclick = () => this.settingsModal.show();
    }

    if (citySelectorBtn) {
      citySelectorBtn.onclick = () => this.settingsModal.show();
    }

    if (appLogoBtn) {
      appLogoBtn.onclick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      };
    }

    // Mobile Bottom Navigation tabs
    document.querySelectorAll('.bottom-nav-item').forEach(item => {
      item.onclick = () => {
        document.querySelectorAll('.bottom-nav-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        const action = item.dataset.nav;

        if (action === 'home') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (action === 'assistant') {
          this.aiModal.show();
        } else if (action === 'compare') {
          if (this.currentResults?.all?.length) {
            const top3 = this.currentResults.all.slice(0, 3);
            this.handleLaunchCompare(top3);
          }
        } else if (action === 'settings') {
          this.settingsModal.show();
        }
      };
    });
  }

  async executeRouteComparison(origin, destination, cityId) {
    this.activeOrigin = origin;
    this.activeDestination = destination;
    this.currentCityId = cityId;

    // Show loading state
    this.showLoading();

    try {
      // 1. Fetch normalized options from all providers
      const rawResults = await this.providerManager.getAllOptions(origin, destination, cityId);

      // 2. Enhance options with trade-off analysis metrics (Principle 36)
      const enrichedOptions = TradeoffEngine.analyzeTradeoffs(rawResults.all);
      
      this.currentResults = {
        ...rawResults,
        all: enrichedOptions
      };

      this.selectedOption = enrichedOptions[0];

      // 3. Update Results View
      this.resultsView.setResults(this.currentResults);

      // 4. Update Map View
      const cityData = CITIES_DATA[cityId] || CITIES_DATA['delhi_ncr'];
      this.mapComponent.render(cityData, origin, destination, enrichedOptions, this.selectedOption);

      // 5. Update AI Assistant Context
      this.aiModal.setContext(enrichedOptions, this.currentResults.metadata);

      // 6. Update header city label
      const cityLabel = document.getElementById('currentCityLabel');
      if (cityLabel) cityLabel.innerText = cityData.name;

    } catch (err) {
      console.error('Route comparison failed:', err);
      this.showError('Unable to calculate routes. Please check locations or select another city.');
    } finally {
      this.hideLoading();
    }
  }

  handleSelectOption(option) {
    this.selectedOption = option;
    this.mapComponent.selectOption(option);
    
    // On mobile, smoothly scroll map into view if clicked from results
    if (window.innerWidth < 768) {
      const mapEl = document.getElementById('mapWrapper');
      if (mapEl) {
        mapEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }

  handleViewDetail(option) {
    this.detailModal.show(option);
  }

  handleLaunchCompare(options) {
    this.comparisonModal.show(options);
  }

  handleBook(option) {
    this.bookingModal.show(option, this.activeOrigin, this.activeDestination);
  }

  handleCityChange(newCityId) {
    this.currentCityId = newCityId;
    this.searchCard.setCity(newCityId);
    const city = CITIES_DATA[newCityId];
    if (city && city.landmarks.length >= 2) {
      this.activeOrigin = city.landmarks[0];
      this.activeDestination = city.landmarks[1];
      this.executeRouteComparison(this.activeOrigin, this.activeDestination, newCityId);
    }
  }

  applyTheme(theme) {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
    } else {
      // System
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }
  }

  showLoading() {
    const overlay = document.getElementById('appLoadingOverlay');
    if (overlay) overlay.classList.add('active');
  }

  hideLoading() {
    const overlay = document.getElementById('appLoadingOverlay');
    if (overlay) overlay.classList.remove('active');
  }

  showError(message) {
    const resultsContainer = document.getElementById('resultsContainer');
    if (resultsContainer) {
      resultsContainer.innerHTML = `
        <div class="error-banner">
          <span class="error-icon">⚠️</span>
          <div class="error-text">
            <h4>Route Calculation Error</h4>
            <p>${message}</p>
          </div>
          <button class="btn-retry" onclick="location.reload()">Retry</button>
        </div>
      `;
    }
  }
}

// Bootstrap application on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new GoCompareApp();
});
