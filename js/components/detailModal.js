/**
 * Detailed Route & Navigation Timeline Modal
 * Uses vector SVG icons for timeline nodes and driver metrics.
 */

import { Icons } from './icons.js';

export class DetailModal {
  constructor(modalId, options = {}) {
    this.modal = document.getElementById(modalId);
    this.onBookProvider = options.onBookProvider;
    this.init();
  }

  init() {
    if (!this.modal) return;
    this.modal.innerHTML = `
      <div class="modal-backdrop" id="detailBackdrop"></div>
      <div class="modal-dialog detail-dialog" role="dialog" aria-modal="true">
        <div class="modal-header">
          <div class="modal-title-group">
            <h2 class="modal-title" id="detailModalTitle">Journey Details</h2>
            <p class="modal-subtitle" id="detailModalSubtitle">Step-by-step navigation & fare breakdown</p>
          </div>
          <button type="button" class="btn-close-modal" id="btnCloseDetail" aria-label="Close modal">
            ${Icons.close(16)}
          </button>
        </div>
        <div class="modal-body" id="detailModalContent"></div>
      </div>
    `;

    document.getElementById('btnCloseDetail').onclick = () => this.hide();
    document.getElementById('detailBackdrop').onclick = () => this.hide();
  }

  show(option) {
    if (!this.modal || !option) return;
    const title = document.getElementById('detailModalTitle');
    const subtitle = document.getElementById('detailModalSubtitle');
    const content = document.getElementById('detailModalContent');

    title.innerText = `${option.name}`;
    subtitle.innerText = `${option.provider} · ${option.fareDisplay} · ${option.durationDisplay}`;

    if (option.category === 'private') {
      content.innerHTML = this.renderPrivateDetail(option);
    } else {
      content.innerHTML = this.renderPublicOrMixedDetail(option);
    }

    const bookBtn = content.querySelector('.btn-detail-book');
    if (bookBtn) {
      bookBtn.onclick = () => {
        if (this.onBookProvider) {
          this.onBookProvider(option);
        }
      };
    }

    this.modal.classList.add('active');
  }

  renderPrivateDetail(opt) {
    return `
      <div class="detail-container">
        <!-- Quick Stat Cards -->
        <div class="stat-cards-grid">
          <div class="stat-box">
            <div class="stat-label">ESTIMATED FARE</div>
            <div class="stat-value text-green">${opt.fareDisplay}</div>
            <div class="stat-sub">${opt.hasSurge ? `Includes ${opt.surgeMultiplier}x Surge` : 'Standard Fare Rate'}</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">TRAVEL TIME</div>
            <div class="stat-value text-blue">${opt.durationDisplay}</div>
            <div class="stat-sub">Road dist: ${opt.distanceKm} km</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">DRIVER ETA</div>
            <div class="stat-value">${opt.driverEtaMinutes || 3} min away</div>
            <div class="stat-sub">Rating: ${Icons.star(12)} ${opt.rating || 4.8}</div>
          </div>
        </div>

        <!-- Vehicle & Driver Card -->
        <div class="detail-section-card">
          <div class="section-card-title-row">
            <span class="section-svg text-blue">${Icons.cab(18)}</span>
            <h3 class="section-card-title">Vehicle & Driver Details</h3>
          </div>
          <div class="driver-info-row">
            <div class="driver-avatar-svg">
              ${Icons.driver(28)}
            </div>
            <div class="driver-specs">
              <div class="driver-model">${opt.driverInfo?.vehicleModel || opt.vehicleType}</div>
              <div class="driver-reg">Registration: <b>${opt.driverInfo?.maskedReg || 'DL 1Z ****'}</b></div>
              <div class="driver-badges">
                <span class="pill-badge">${opt.isAC ? `${Icons.ac(12)} AC` : 'Non-AC'}</span>
                <span class="pill-badge">Top-Rated Driver</span>
                <span class="pill-badge">${opt.availability} Availability</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Fare Breakdown -->
        <div class="detail-section-card">
          <div class="section-card-title-row">
            <span class="section-svg text-green">${Icons.tag(18)}</span>
            <h3 class="section-card-title">Fare Structure</h3>
          </div>
          <div class="fare-line-item">
            <span>Base Fare (First 2.0 km)</span>
            <span>₹50</span>
          </div>
          <div class="fare-line-item">
            <span>Distance Fare (~${opt.distanceKm} km)</span>
            <span>₹${Math.round(opt.distanceKm * 14)}</span>
          </div>
          <div class="fare-line-item">
            <span>Estimated Ride Time (~${opt.durationMinutes} min)</span>
            <span>₹${Math.round(opt.durationMinutes * 1.5)}</span>
          </div>
          ${opt.hasSurge ? `
          <div class="fare-line-item surge-item">
            <span>Peak Surge Multiplier (${opt.surgeMultiplier}x)</span>
            <span>+₹${Math.round((opt.averageFare * (opt.surgeMultiplier - 1)))}</span>
          </div>
          ` : ''}
          <div class="fare-line-divider"></div>
          <div class="fare-line-item total-item">
            <span>Total Estimated Fare</span>
            <span class="total-price">${opt.fareDisplay}</span>
          </div>
          <p class="fare-disclaimer">
            *Final fare may vary depending on actual waiting time, traffic detours, and tolls.
          </p>
        </div>

        <!-- Deep Link CTA -->
        <div class="detail-cta-box">
          <button type="button" class="btn-detail-book ${opt.provider.toLowerCase().replace(/\s+/g, '-')}" data-id="${opt.id}">
            <span>Open & Book in ${opt.provider} App</span>
            <span class="cta-arrow">${Icons.arrowRight(16)}</span>
          </button>
          <p class="cta-note">Seamlessly opens your pickup & drop location inside ${opt.provider}.</p>
        </div>
      </div>
    `;
  }

  renderPublicOrMixedDetail(opt) {
    const steps = opt.routeSteps || [];

    return `
      <div class="detail-container">
        <!-- Quick Stats -->
        <div class="stat-cards-grid">
          <div class="stat-box">
            <div class="stat-label">TOTAL FARE</div>
            <div class="stat-value text-green">${opt.fareDisplay}</div>
            <div class="stat-sub">Fixed transit tariff</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">TOTAL TIME</div>
            <div class="stat-value text-blue">${opt.durationDisplay}</div>
            <div class="stat-sub">Zero road jam variance</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">WALKING REQUIRED</div>
            <div class="stat-value">${opt.walkingMinutes} min</div>
            <div class="stat-sub">${opt.walkingDistanceMeters > 1000 ? (opt.walkingDistanceMeters/1000).toFixed(1) + ' km' : opt.walkingDistanceMeters + ' meters'}</div>
          </div>
        </div>

        <!-- Step by Step Timeline -->
        <div class="detail-section-card">
          <div class="section-card-title-row">
            <span class="section-svg text-blue">${Icons.pin(18)}</span>
            <h3 class="section-card-title">Step-by-Step Navigation Instructions</h3>
          </div>
          
          <div class="timeline-container">
            ${steps.map((step, idx) => {
              const stepColor = step.mode === 'metro' ? '#9333EA' : 
                                step.mode === 'bus' ? '#16A34A' : 
                                step.mode === 'auto' ? '#EA580C' : 
                                step.mode === 'moto' ? '#DC2626' : '#64748B';

              return `
                <div class="timeline-step">
                  <div class="timeline-left">
                    <div class="step-node" style="background:${stepColor}">
                      ${Icons.forMode(step.mode, 15)}
                    </div>
                    ${idx < steps.length - 1 ? '<div class="timeline-connector"></div>' : ''}
                  </div>
                  <div class="timeline-right">
                    <div class="step-header">
                      <span class="step-num">Step ${step.stepNumber || (idx + 1)}</span>
                      <span class="step-duration">${step.durationMinutes} min</span>
                    </div>
                    <div class="step-instruction">${step.instruction}</div>
                    ${step.subtext ? `<div class="step-subtext">${step.subtext}</div>` : ''}
                    ${step.lineName ? `<div class="step-tag" style="border-left: 3px solid ${stepColor}">${step.lineName}</div>` : ''}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Smart Travel Tips -->
        <div class="detail-section-card tips-card">
          <div class="section-card-title-row">
            <span class="section-svg text-amber">${Icons.sparkle(18)}</span>
            <h3 class="section-card-title">Smart Commute Advice</h3>
          </div>
          <ul class="commute-tips-list">
            <li>Use a Metro Smart Card, Paytm / DMRC Travel app QR ticket to skip station queues and save 10% on fares.</li>
            <li>Last-mile auto rickshaws are available 24/7 directly outside metro exit gates 1 and 2.</li>
            <li>Trains run every 3-4 minutes during morning (8-11 AM) and evening (5-9 PM) peak windows.</li>
          </ul>
        </div>
      </div>
    `;
  }

  hide() {
    if (this.modal) {
      this.modal.classList.remove('active');
    }
  }
}
