/**
 * Results View Component
 * Uses vector SVG icons and modern UI/UX design patterns.
 */

import { Icons } from './icons.js';

export class ResultsView {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.onSelectOption = options.onSelectOption;
    this.onOpenDetail = options.onOpenDetail;
    this.onCompareSelected = options.onCompareSelected;
    this.onBookProvider = options.onBookProvider;

    this.allOptions = [];
    this.filteredOptions = [];
    this.selectedOption = null;
    this.selectedForCompare = new Set();
    this.activeCategory = 'all';
    this.activeSort = 'convenient';
    this.onlyAC = false;
    this.maxPrice = 1000;
    this.metadata = null;
  }

  setResults(resultsData) {
    this.metadata = resultsData.metadata;
    this.allOptions = resultsData.all;
    this.selectedOption = this.allOptions[0] || null;
    this.selectedForCompare.clear();
    this.applyFiltersAndSort();
  }

  applyFiltersAndSort() {
    let list = [...this.allOptions];

    if (this.activeCategory === 'private') {
      list = list.filter(o => o.category === 'private');
    } else if (this.activeCategory === 'public') {
      list = list.filter(o => o.category === 'public');
    } else if (this.activeCategory === 'mixed') {
      list = list.filter(o => o.category === 'mixed');
    } else if (this.activeCategory === 'moto_auto') {
      list = list.filter(o => o.mode === 'moto' || o.mode === 'auto');
    }

    if (this.onlyAC) {
      list = list.filter(o => o.isAC);
    }

    if (this.maxPrice < 1000) {
      list = list.filter(o => o.estimatedFareMin <= this.maxPrice);
    }

    if (this.activeSort === 'cheapest') {
      list.sort((a, b) => a.averageFare - b.averageFare);
    } else if (this.activeSort === 'fastest') {
      list.sort((a, b) => a.durationMinutes - b.durationMinutes);
    } else if (this.activeSort === 'least_walk') {
      list.sort((a, b) => a.walkingMinutes - b.walkingMinutes);
    } else if (this.activeSort === 'fewest_transfers') {
      list.sort((a, b) => a.transfers - b.transfers);
    } else {
      list.sort((a, b) => b.convenienceScore - a.convenienceScore);
    }

    this.filteredOptions = list;
    this.render();
  }

  render() {
    if (!this.container) return;

    if (!this.allOptions || !this.allOptions.length) {
      this.renderEmptyState();
      return;
    }

    const fastest = [...this.allOptions].sort((a, b) => a.durationMinutes - b.durationMinutes)[0];
    const cheapest = [...this.allOptions].sort((a, b) => a.averageFare - b.averageFare)[0];
    const bestMixed = this.allOptions.find(o => o.mode === 'mixed');

    this.container.innerHTML = `
      <div class="results-root">
        <!-- Results Summary Banner -->
        <div class="results-summary-header">
          <div class="summary-text-block">
            <div class="summary-route-title">
              ${this.metadata?.origin?.name?.split('(')[0]?.trim()} <span class="route-arrow-sep">${Icons.arrowRight(16)}</span> ${this.metadata?.destination?.name?.split('(')[0]?.trim()}
            </div>
            <div class="summary-subline">
              <span class="count-badge">${this.filteredOptions.length} of ${this.allOptions.length} options</span>
              <span class="dist-badge">${this.metadata?.roadDistanceKm} km road route</span>
              ${this.metadata?.isPeakHour ? '<span class="peak-badge">Peak Traffic (1.3x)</span>' : '<span class="normal-traffic-badge">Normal Traffic Flow</span>'}
            </div>
          </div>
          <div class="demo-data-badge" title="Fares & availability are realistic demo estimates">
            Sample Data
          </div>
        </div>

        <!-- Trade-off Sweet-Spot Matrix Card (Principle 36) -->
        <div class="tradeoff-matrix-banner">
          <div class="matrix-card fastest" data-id="${fastest?.id}">
            <div class="matrix-header">
              <span class="matrix-icon-svg text-blue">${Icons.bolt(14)}</span>
              <span class="matrix-label">FASTEST ARRIVAL</span>
            </div>
            <div class="matrix-name">${fastest?.name}</div>
            <div class="matrix-metrics"><b>${fastest?.durationDisplay}</b> · ${fastest?.fareDisplay}</div>
          </div>

          <div class="matrix-card cheapest" data-id="${cheapest?.id}">
            <div class="matrix-header">
              <span class="matrix-icon-svg text-green">${Icons.tag(14)}</span>
              <span class="matrix-label">CHEAPEST FARE</span>
            </div>
            <div class="matrix-name">${cheapest?.name}</div>
            <div class="matrix-metrics"><b>${cheapest?.fareDisplay}</b> · ${cheapest?.durationDisplay}</div>
          </div>

          ${bestMixed ? `
          <div class="matrix-card smart-saver" data-id="${bestMixed?.id}">
            <div class="matrix-header">
              <span class="matrix-icon-svg text-teal">${Icons.mixed(14)}</span>
              <span class="matrix-label">BEST VALUE HYBRID</span>
            </div>
            <div class="matrix-name">${bestMixed?.name}</div>
            <div class="matrix-metrics"><b>${bestMixed?.fareDisplay}</b> · ${bestMixed?.durationDisplay}</div>
          </div>
          ` : ''}
        </div>

        <!-- Filter & Sort Control Bar -->
        <div class="filter-sort-bar">
          <!-- Category Tabs -->
          <div class="category-tabs">
            <button class="cat-tab ${this.activeCategory === 'all' ? 'active' : ''}" data-cat="all">
              All (${this.allOptions.length})
            </button>
            <button class="cat-tab ${this.activeCategory === 'private' ? 'active' : ''}" data-cat="private">
              <span class="tab-svg">${Icons.cab(15)}</span> Cabs (${this.allOptions.filter(o => o.category === 'private').length})
            </button>
            <button class="cat-tab ${this.activeCategory === 'public' ? 'active' : ''}" data-cat="public">
              <span class="tab-svg">${Icons.metro(15)}</span> Metro & Bus (${this.allOptions.filter(o => o.category === 'public').length})
            </button>
            <button class="cat-tab ${this.activeCategory === 'mixed' ? 'active' : ''}" data-cat="mixed">
              <span class="tab-svg">${Icons.mixed(15)}</span> Mixed-Mode (${this.allOptions.filter(o => o.category === 'mixed').length})
            </button>
            <button class="cat-tab ${this.activeCategory === 'moto_auto' ? 'active' : ''}" data-cat="moto_auto">
              <span class="tab-svg">${Icons.auto(15)}</span> Auto & Moto
            </button>
          </div>

          <!-- Sort Chips & Quick Filters -->
          <div class="sort-chips-row">
            <span class="sort-label">Sort:</span>
            <button class="sort-chip ${this.activeSort === 'convenient' ? 'active' : ''}" data-sort="convenient">
              <span class="chip-svg">${Icons.armchair(13)}</span> Convenient
            </button>
            <button class="sort-chip ${this.activeSort === 'cheapest' ? 'active' : ''}" data-sort="cheapest">
              <span class="chip-svg">${Icons.tag(13)}</span> Cheapest
            </button>
            <button class="sort-chip ${this.activeSort === 'fastest' ? 'active' : ''}" data-sort="fastest">
              <span class="chip-svg">${Icons.bolt(13)}</span> Fastest
            </button>
            <button class="sort-chip ${this.activeSort === 'least_walk' ? 'active' : ''}" data-sort="least_walk">
              <span class="chip-svg">${Icons.walk(13)}</span> Least Walk
            </button>
            <button class="sort-chip ${this.activeSort === 'fewest_transfers' ? 'active' : ''}" data-sort="fewest_transfers">
              <span class="chip-svg">${Icons.transfer(13)}</span> Direct / Low Transfers
            </button>

            <!-- AC Toggle -->
            <button class="toggle-chip ${this.onlyAC ? 'active' : ''}" id="btnToggleAC">
              <span class="chip-svg">${Icons.ac(13)}</span> AC Only
            </button>
          </div>
        </div>

        <!-- Options Card List -->
        <div class="options-list-grid" id="optionsListGrid">
          ${this.renderOptionCards()}
        </div>

        <!-- Floating Compare Tray -->
        <div class="floating-compare-tray ${this.selectedForCompare.size >= 2 ? 'visible' : ''}" id="floatingCompareTray">
          <div class="compare-tray-left">
            <span class="compare-count-icon-svg">${Icons.scale(20)}</span>
            <span class="compare-count-text">
              <b>${this.selectedForCompare.size} options</b> selected for comparison
            </span>
          </div>
          <button type="button" class="btn-launch-compare" id="btnLaunchCompare">
            Compare Side-by-Side ${Icons.arrowRight(14)}
          </button>
        </div>
      </div>
    `;

    this.bindInteractions();
  }

  renderOptionCards() {
    if (!this.filteredOptions.length) {
      return `
        <div class="no-filter-results">
          <div class="empty-icon-svg">${Icons.search(36)}</div>
          <h3>No options match current filters</h3>
          <p>Try resetting the AC filter or selecting "All" categories.</p>
          <button class="btn-reset-filters" id="btnResetFilters">Reset Filters</button>
        </div>
      `;
    }

    return this.filteredOptions.map(opt => {
      const isSelected = this.selectedOption?.id === opt.id;
      const isChecked = this.selectedForCompare.has(opt.id);
      
      const modeColor = opt.mode === 'moto' ? '#DC2626' : 
                        opt.mode === 'auto' ? '#EA580C' : 
                        opt.mode === 'metro' ? '#9333EA' : 
                        opt.mode === 'bus' ? '#16A34A' : 
                        opt.mode === 'mixed' ? '#0D9488' : '#2563EB';

      let ctaLabel = 'Book on ' + opt.provider;
      if (opt.category === 'public' || opt.category === 'mixed') {
        ctaLabel = 'View Route Details';
      }

      return `
        <div class="option-card ${isSelected ? 'selected' : ''} ${opt.category}" 
             data-id="${opt.id}" 
             tabindex="0" 
             role="article">
          
          <!-- Card Top Bar -->
          <div class="card-top-bar">
            <div class="badge-group">
              ${opt.badges.map(b => `<span class="badge ${b.toLowerCase().replace(/\s+/g, '-')}">${b}</span>`).join('')}
              ${opt.hasSurge ? `<span class="badge surge">Surge ${opt.surgeMultiplier}x</span>` : ''}
              ${opt.isAC ? `<span class="badge ac"><span class="badge-icon-svg">${Icons.ac(11)}</span> AC</span>` : ''}
            </div>

            <!-- Compare Checkbox -->
            <label class="compare-checkbox-label" title="Select to compare side-by-side" onclick="event.stopPropagation()">
              <input type="checkbox" class="compare-checkbox" data-id="${opt.id}" ${isChecked ? 'checked' : ''} />
              <span class="compare-checkbox-text">Compare</span>
            </label>
          </div>

          <!-- Main Card Content Row -->
          <div class="card-main-content">
            <!-- Left: Icon & Provider Info -->
            <div class="card-left-col">
              <div class="mode-avatar" style="background-color: ${modeColor}15; color: ${modeColor}">
                ${Icons.forMode(opt.mode, 24)}
              </div>
              <div class="provider-details">
                <div class="provider-title-row">
                  <h3 class="provider-name">${opt.name}</h3>
                  ${opt.rating ? `<span class="rating-pill">${Icons.star(12)} ${opt.rating}</span>` : ''}
                </div>
                <div class="vehicle-subtitle">${opt.vehicleType}</div>
                <div class="availability-indicator">
                  <span class="status-dot ${opt.availability.toLowerCase()}"></span>
                  <span class="status-text">${opt.availability} availability</span>
                  ${opt.driverEtaMinutes ? `<span class="eta-text">· Driver in ${opt.driverEtaMinutes}m</span>` : ''}
                </div>
              </div>
            </div>

            <!-- Right: Pricing & Duration -->
            <div class="card-right-col">
              <div class="fare-amount">${opt.fareDisplay}</div>
              <div class="duration-highlight">
                <span class="time-bold">${opt.durationDisplay}</span>
                <span class="dist-sub">(${opt.distanceKm} km)</span>
              </div>
            </div>
          </div>

          <!-- Card Transit Specs -->
          <div class="card-specs-bar">
            <div class="specs-item">
              <span class="specs-svg">${Icons.walk(14)}</span>
              <span>${opt.walkingMinutes > 0 ? `${opt.walkingMinutes} min walk (${opt.walkingDistanceMeters > 1000 ? (opt.walkingDistanceMeters/1000).toFixed(1) + 'km' : opt.walkingDistanceMeters + 'm'})` : 'Doorstep (0 walk)'}</span>
            </div>
            <div class="specs-divider">•</div>
            <div class="specs-item">
              <span class="specs-svg">${Icons.transfer(14)}</span>
              <span>${opt.transfers === 0 ? 'Direct ride' : `${opt.transfers} interchange`}</span>
            </div>
            ${opt.tagline ? `
              <div class="specs-divider">•</div>
              <div class="specs-tagline">${opt.tagline}</div>
            ` : ''}
          </div>

          <!-- Trade-off Insight Banner -->
          ${opt.tradeoffMetrics?.insight ? `
            <div class="tradeoff-insight-pill">
              <span class="insight-icon-svg">${Icons.sparkle(13)}</span>
              <span>${opt.tradeoffMetrics.insight.replace(/^[^\w]+/, '')}</span>
            </div>
          ` : ''}

          <!-- Action Button Row -->
          <div class="card-cta-row">
            <button type="button" class="btn-view-steps" data-action="details" data-id="${opt.id}">
              Navigation Steps
            </button>
            <button type="button" class="btn-book-action ${opt.provider.toLowerCase().replace(/\s+/g, '-')}" data-action="book" data-id="${opt.id}">
              <span>${ctaLabel}</span>
              <span class="cta-arrow">${Icons.arrowRight(14)}</span>
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  bindInteractions() {
    this.container.querySelectorAll('.cat-tab').forEach(tab => {
      tab.onclick = () => {
        this.activeCategory = tab.dataset.cat;
        this.applyFiltersAndSort();
      };
    });

    this.container.querySelectorAll('.sort-chip').forEach(chip => {
      chip.onclick = () => {
        this.activeSort = chip.dataset.sort;
        this.applyFiltersAndSort();
      };
    });

    const acBtn = document.getElementById('btnToggleAC');
    if (acBtn) {
      acBtn.onclick = () => {
        this.onlyAC = !this.onlyAC;
        this.applyFiltersAndSort();
      };
    }

    const resetBtn = document.getElementById('btnResetFilters');
    if (resetBtn) {
      resetBtn.onclick = () => {
        this.activeCategory = 'all';
        this.onlyAC = false;
        this.applyFiltersAndSort();
      };
    }

    this.container.querySelectorAll('.matrix-card').forEach(card => {
      card.onclick = () => {
        const id = card.dataset.id;
        const target = this.allOptions.find(o => o.id === id);
        if (target) this.selectOption(target);
      };
    });

    this.container.querySelectorAll('.option-card').forEach(card => {
      card.onclick = (e) => {
        if (e.target.closest('.compare-checkbox-label') || e.target.closest('button')) return;
        const id = card.dataset.id;
        const opt = this.allOptions.find(o => o.id === id);
        if (opt) this.selectOption(opt);
      };
    });

    this.container.querySelectorAll('.compare-checkbox').forEach(cb => {
      cb.onchange = (e) => {
        const id = e.target.dataset.id;
        if (e.target.checked) {
          if (this.selectedForCompare.size >= 4) {
            e.target.checked = false;
            alert('You can compare up to 4 options side-by-side.');
            return;
          }
          this.selectedForCompare.add(id);
        } else {
          this.selectedForCompare.delete(id);
        }
        this.updateCompareTray();
      };
    });

    const launchBtn = document.getElementById('btnLaunchCompare');
    if (launchBtn) {
      launchBtn.onclick = () => {
        const selected = this.allOptions.filter(o => this.selectedForCompare.has(o.id));
        if (this.onCompareSelected) this.onCompareSelected(selected);
      };
    }

    this.container.querySelectorAll('button[data-action]').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const action = btn.dataset.action;
        const id = btn.dataset.id;
        const opt = this.allOptions.find(o => o.id === id);
        if (!opt) return;

        if (action === 'details') {
          if (this.onOpenDetail) this.onOpenDetail(opt);
        } else if (action === 'book') {
          if (opt.category === 'public' || opt.category === 'mixed') {
            if (this.onOpenDetail) this.onOpenDetail(opt);
          } else {
            if (this.onBookProvider) this.onBookProvider(opt);
          }
        }
      };
    });
  }

  selectOption(opt) {
    this.selectedOption = opt;
    this.container.querySelectorAll('.option-card').forEach(c => {
      c.classList.toggle('selected', c.dataset.id === opt.id);
    });
    if (this.onSelectOption) this.onSelectOption(opt);
  }

  updateCompareTray() {
    const tray = document.getElementById('floatingCompareTray');
    if (!tray) return;

    if (this.selectedForCompare.size >= 2) {
      tray.classList.add('visible');
      tray.querySelector('.compare-count-text').innerHTML = `<b>${this.selectedForCompare.size} options</b> selected for comparison`;
    } else {
      tray.classList.remove('visible');
    }
  }

  renderEmptyState() {
    this.container.innerHTML = `
      <div class="empty-state-card">
        <div class="empty-icon-svg text-blue">${Icons.pin(40)}</div>
        <h2>Enter pickup and destination to compare</h2>
        <p>Compare real fares and travel times across Uber, Ola, Rapido, Metro, Bus, and smart mixed routes in one tap.</p>
      </div>
    `;
  }
}
