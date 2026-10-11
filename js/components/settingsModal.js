/**
 * Settings and Preferences Modal
 * Uses vector SVG icons for actions and controls.
 */

import { StorageService } from '../services/storageService.js';
import { CITIES_DATA } from '../data/cities.js';
import { Icons } from './icons.js';

export class SettingsModal {
  constructor(modalId, options = {}) {
    this.modal = document.getElementById(modalId);
    this.onCityChange = options.onCityChange;
    this.onThemeChange = options.onThemeChange;
    this.init();
  }

  init() {
    if (!this.modal) return;
    const settings = StorageService.getSettings();

    this.modal.innerHTML = `
      <div class="modal-backdrop" id="settingsBackdrop"></div>
      <div class="modal-dialog settings-dialog" role="dialog" aria-modal="true">
        <div class="modal-header">
          <div class="modal-title-group">
            <h2 class="modal-title">
              <span class="modal-title-svg text-blue">${Icons.settings(20)}</span>
              <span>Settings & Preferences</span>
            </h2>
            <p class="modal-subtitle">Customize city, theme, currency, and stored data</p>
          </div>
          <button type="button" class="btn-close-modal" id="btnCloseSettings" aria-label="Close modal">
            ${Icons.close(16)}
          </button>
        </div>

        <div class="modal-body settings-body">
          <!-- City Selection -->
          <div class="setting-group">
            <label class="setting-label" for="settingCity">Active Metro Area</label>
            <select id="settingCity" class="setting-select">
              ${Object.values(CITIES_DATA).map(c => `
                <option value="${c.id}" ${c.id === settings.city ? 'selected' : ''}>
                  ${c.name} (${c.state})
                </option>
              `).join('')}
            </select>
            <small class="setting-hint">Configures local metro stations, bus routes, and key transit hubs.</small>
          </div>

          <!-- Theme -->
          <div class="setting-group">
            <label class="setting-label">Appearance Theme</label>
            <div class="theme-options-row">
              <button type="button" class="theme-btn ${settings.theme === 'light' ? 'active' : ''}" data-theme="light">Light</button>
              <button type="button" class="theme-btn ${settings.theme === 'dark' ? 'active' : ''}" data-theme="dark">Dark</button>
              <button type="button" class="theme-btn ${settings.theme === 'system' ? 'active' : ''}" data-theme="system">System</button>
            </div>
          </div>

          <!-- Currency & Language -->
          <div class="setting-grid-2">
            <div class="setting-group">
              <label class="setting-label" for="settingCurrency">Currency</label>
              <select id="settingCurrency" class="setting-select">
                <option value="₹" selected>₹ INR (Indian Rupee)</option>
              </select>
            </div>
            <div class="setting-group">
              <label class="setting-label" for="settingLanguage">Language</label>
              <select id="settingLanguage" class="setting-select">
                <option value="en" selected>English</option>
                <option value="hi">हिन्दी (Hindi)</option>
              </select>
            </div>
          </div>

          <!-- Location & Permissions -->
          <div class="setting-group">
            <label class="setting-label">Location Permissions</label>
            <div class="toggle-row">
              <span>Enable GPS High-Accuracy Geolocation</span>
              <input type="checkbox" id="settingGps" checked class="setting-checkbox" />
            </div>
            <small class="setting-hint">Used strictly for calculating origin coordinates. Never logged or shared.</small>
          </div>

          <!-- Data & Privacy -->
          <div class="setting-group">
            <label class="setting-label">Data & Privacy</label>
            <div class="btn-data-actions">
              <button type="button" class="btn-danger-outline" id="btnClearAllHistory">
                Clear Search History
              </button>
              <button type="button" class="btn-danger-outline" id="btnResetDefaults">
                Reset App Defaults
              </button>
            </div>
          </div>

          <!-- About Section -->
          <div class="about-card">
            <h4>About GoCompare</h4>
            <p>Unified multi-modal transportation comparison platform for India. Compare private ride-hailing (Uber, Ola, Rapido), public transit (Metro, Bus), and hybrid journeys in one place.</p>
            <div class="version-tag">Version 2.5.0 · Production Quality</div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btnCloseSettings').onclick = () => this.hide();
    document.getElementById('settingsBackdrop').onclick = () => this.hide();

    const citySelect = document.getElementById('settingCity');
    citySelect.onchange = (e) => {
      const cityId = e.target.value;
      StorageService.updateSettings({ city: cityId });
      if (this.onCityChange) this.onCityChange(cityId);
    };

    this.modal.querySelectorAll('.theme-btn').forEach(btn => {
      btn.onclick = () => {
        this.modal.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const theme = btn.dataset.theme;
        StorageService.updateSettings({ theme });
        if (this.onThemeChange) this.onThemeChange(theme);
      };
    });

    document.getElementById('btnClearAllHistory').onclick = () => {
      if (confirm('Clear all stored search history?')) {
        StorageService.clearRecentSearches();
        alert('Search history cleared.');
      }
    };

    document.getElementById('btnResetDefaults').onclick = () => {
      if (confirm('Reset all saved preferences?')) {
        localStorage.clear();
        location.reload();
      }
    };
  }

  show() {
    if (this.modal) this.modal.classList.add('active');
  }

  hide() {
    if (this.modal) this.modal.classList.remove('active');
  }
}
