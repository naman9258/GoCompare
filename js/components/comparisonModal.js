/**
 * Side-by-Side Option Comparison Modal
 * Uses vector SVG icons and clean comparison layout.
 */

import { Icons } from './icons.js';

export class ComparisonModal {
  constructor(modalId, options = {}) {
    this.modal = document.getElementById(modalId);
    this.onBook = options.onBook;
    this.onViewDetail = options.onViewDetail;
    this.init();
  }

  init() {
    if (!this.modal) return;
    this.modal.innerHTML = `
      <div class="modal-backdrop" id="compareBackdrop"></div>
      <div class="modal-dialog compare-dialog" role="dialog" aria-modal="true">
        <div class="modal-header">
          <div class="modal-title-group">
            <h2 class="modal-title">
              <span class="modal-title-svg text-blue">${Icons.scale(20)}</span>
              <span>Side-by-Side Comparison</span>
            </h2>
            <p class="modal-subtitle">Evaluate price, duration, and convenience trade-offs directly</p>
          </div>
          <button type="button" class="btn-close-modal" id="btnCloseCompare" aria-label="Close modal">
            ${Icons.close(16)}
          </button>
        </div>
        <div class="modal-body" id="compareTableContainer"></div>
      </div>
    `;

    document.getElementById('btnCloseCompare').onclick = () => this.hide();
    document.getElementById('compareBackdrop').onclick = () => this.hide();
  }

  show(optionsList) {
    if (!this.modal || !optionsList || !optionsList.length) return;
    const container = document.getElementById('compareTableContainer');

    const minFare = Math.min(...optionsList.map(o => o.averageFare));
    const minTime = Math.min(...optionsList.map(o => o.durationMinutes));

    container.innerHTML = `
      <div class="comparison-table-wrapper">
        <table class="compare-table">
          <thead>
            <tr>
              <th class="feature-col">Feature</th>
              ${optionsList.map(opt => `
                <th class="option-header-col">
                  <div class="compare-col-header">
                    <span class="compare-col-badge ${opt.mode}">
                      <span class="col-badge-svg">${Icons.forMode(opt.mode, 13)}</span>
                      ${opt.mode.toUpperCase()}
                    </span>
                    <h4 class="compare-col-title">${opt.name}</h4>
                    <span class="compare-col-provider">${opt.provider}</span>
                  </div>
                </th>
              `).join('')}
            </tr>
          </thead>
          <tbody>
            <tr class="highlight-row">
              <td class="feature-cell font-bold">Estimated Fare</td>
              ${optionsList.map(opt => `
                <td class="data-cell ${opt.averageFare === minFare ? 'winner' : ''}">
                  <div class="val-bold ${opt.averageFare === minFare ? 'text-green' : ''}">
                    ${opt.fareDisplay}
                  </div>
                  ${opt.averageFare === minFare ? '<span class="winner-tag">Lowest Fare</span>' : ''}
                </td>
              `).join('')}
            </tr>

            <tr class="highlight-row">
              <td class="feature-cell font-bold">Travel Time</td>
              ${optionsList.map(opt => `
                <td class="data-cell ${opt.durationMinutes === minTime ? 'winner' : ''}">
                  <div class="val-bold ${opt.durationMinutes === minTime ? 'text-blue' : ''}">
                    ${opt.durationDisplay}
                  </div>
                  ${opt.durationMinutes === minTime ? '<span class="winner-tag blue">Fastest</span>' : ''}
                </td>
              `).join('')}
            </tr>

            <tr>
              <td class="feature-cell">Total Distance</td>
              ${optionsList.map(opt => `
                <td class="data-cell">${opt.distanceKm} km</td>
              `).join('')}
            </tr>

            <tr>
              <td class="feature-cell">Walking Distance</td>
              ${optionsList.map(opt => `
                <td class="data-cell">
                  ${opt.walkingMinutes === 0 ? '<b>0 m (Doorstep)</b>' : `${opt.walkingMinutes} min (${opt.walkingDistanceMeters > 1000 ? (opt.walkingDistanceMeters/1000).toFixed(1) + ' km' : opt.walkingDistanceMeters + ' m'})`}
                </td>
              `).join('')}
            </tr>

            <tr>
              <td class="feature-cell">Transfers</td>
              ${optionsList.map(opt => `
                <td class="data-cell">
                  ${opt.transfers === 0 ? '<span class="badge-direct">Direct (0)</span>' : `<span class="badge-transfers">${opt.transfers} interchange</span>`}
                </td>
              `).join('')}
            </tr>

            <tr>
              <td class="feature-cell">Vehicle Comfort</td>
              ${optionsList.map(opt => `
                <td class="data-cell">${opt.vehicleType}</td>
              `).join('')}
            </tr>

            <tr>
              <td class="feature-cell">Air-Conditioned</td>
              ${optionsList.map(opt => `
                <td class="data-cell">${opt.isAC ? 'Yes (AC)' : 'Non-AC'}</td>
              `).join('')}
            </tr>

            <tr>
              <td class="feature-cell">Rating & Quality</td>
              ${optionsList.map(opt => `
                <td class="data-cell">
                  ${opt.rating ? `<span class="rating-inline">${Icons.star(12)} ${opt.rating}</span> · ${opt.availability}` : `${opt.availability} availability`}
                </td>
              `).join('')}
            </tr>

            <tr class="tradeoff-verdict-row">
              <td class="feature-cell font-bold">Key Trade-off</td>
              ${optionsList.map(opt => `
                <td class="data-cell verdict-text">
                  <small>${opt.tradeoffMetrics?.insight ? opt.tradeoffMetrics.insight.replace(/^[^\w]+/, '') : opt.tagline}</small>
                </td>
              `).join('')}
            </tr>

            <tr class="action-row">
              <td class="feature-cell">Action</td>
              ${optionsList.map(opt => `
                <td class="data-cell">
                  <button type="button" class="btn-compare-action" data-id="${opt.id}">
                    ${opt.category === 'private' ? 'Book ' + opt.provider : 'View Steps'}
                  </button>
                </td>
              `).join('')}
            </tr>
          </tbody>
        </table>
      </div>
    `;

    container.querySelectorAll('.btn-compare-action').forEach(btn => {
      btn.onclick = () => {
        const id = btn.dataset.id;
        const target = optionsList.find(o => o.id === id);
        this.hide();
        if (target) {
          if (target.category === 'private' && this.onBook) {
            this.onBook(target);
          } else if (this.onViewDetail) {
            this.onViewDetail(target);
          }
        }
      };
    });

    this.modal.classList.add('active');
  }

  hide() {
    if (this.modal) this.modal.classList.remove('active');
  }
}
