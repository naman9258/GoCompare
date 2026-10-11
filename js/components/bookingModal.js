/**
 * Booking / Provider Deep-Link Modal
 * Uses vector SVG icons and modern UI styling.
 */

import { Icons } from './icons.js';

export class BookingModal {
  constructor(modalId) {
    this.modal = document.getElementById(modalId);
    this.currentOption = null;
    this.init();
  }

  init() {
    if (!this.modal) return;
    this.modal.innerHTML = `
      <div class="modal-backdrop" id="bookingBackdrop"></div>
      <div class="modal-dialog booking-dialog" role="dialog" aria-modal="true">
        <div class="modal-header">
          <div class="modal-title-group">
            <h2 class="modal-title" id="bookingModalTitle">Book Ride</h2>
            <p class="modal-subtitle" id="bookingModalSubtitle">Redirecting to official provider</p>
          </div>
          <button type="button" class="btn-close-modal" id="btnCloseBooking" aria-label="Close modal">
            ${Icons.close(16)}
          </button>
        </div>

        <div class="modal-body booking-body" id="bookingModalContent"></div>
      </div>
    `;

    document.getElementById('btnCloseBooking').onclick = () => this.hide();
    document.getElementById('bookingBackdrop').onclick = () => this.hide();
  }

  show(option, origin, destination) {
    if (!this.modal || !option) return;
    this.currentOption = option;

    const title = document.getElementById('bookingModalTitle');
    const subtitle = document.getElementById('bookingModalSubtitle');
    const content = document.getElementById('bookingModalContent');

    title.innerText = `Connect to ${option.provider}`;
    subtitle.innerText = `${option.name} · ${option.fareDisplay} · ${option.durationDisplay}`;

    content.innerHTML = `
      <div class="booking-flow-card">
        <div class="provider-banner-logo ${option.provider.toLowerCase().replace(/\s+/g, '-')}">
          <span class="banner-icon-svg">${Icons.forMode(option.mode, 20)}</span>
          <span class="banner-text">${option.provider} Direct Booking</span>
        </div>

        <div class="booking-ride-summary">
          <div class="summary-line">
            <span class="line-label">Vehicle Selected:</span>
            <span class="line-val"><b>${option.name}</b> (${option.vehicleType})</span>
          </div>
          <div class="summary-line">
            <span class="line-label">Estimated Fare:</span>
            <span class="line-val text-green font-bold">${option.fareDisplay}</span>
          </div>
          <div class="summary-line">
            <span class="line-label">Estimated Arrival:</span>
            <span class="line-val">${option.durationDisplay} (~${option.distanceKm} km)</span>
          </div>
          <div class="summary-line">
            <span class="line-label">Pickup:</span>
            <span class="line-val">${origin?.name || 'Current Location'}</span>
          </div>
          <div class="summary-line">
            <span class="line-label">Destination:</span>
            <span class="line-val">${destination?.name}</span>
          </div>
        </div>

        <div class="deeplink-action-box">
          <a href="${option.bookingUrl}" target="_blank" rel="noopener noreferrer" class="btn-launch-app ${option.provider.toLowerCase().replace(/\s+/g, '-')}">
            <span>Open ${option.provider} App</span>
            <span class="launch-arrow">${Icons.arrowRight(16)}</span>
          </a>
          <div class="deeplink-scheme-info">
            <code>Scheme: ${option.appScheme ? option.appScheme.substring(0, 48) + '...' : 'Direct Universal Link'}</code>
          </div>
        </div>

        <div class="booking-notice">
          <small>
            GoCompare automatically populates your pickup and destination inside ${option.provider}. 
            Payment, driver allocation, and ride tracking are completed directly in the official ${option.provider} app.
          </small>
        </div>
      </div>
    `;

    this.modal.classList.add('active');
  }

  hide() {
    if (this.modal) this.modal.classList.remove('active');
  }
}
