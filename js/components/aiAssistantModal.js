/**
 * AI Travel Assistant Modal
 * Uses vector SVG icons for conversational advisor.
 */

import { AIAssistantService } from '../services/aiAssistantService.js';
import { Icons } from './icons.js';

export class AIAssistantModal {
  constructor(modalId, options = {}) {
    this.modal = document.getElementById(modalId);
    this.onSelectOption = options.onSelectOption;
    this.activeOptions = [];
    this.metadata = null;
    this.history = [];
    this.init();
  }

  init() {
    if (!this.modal) return;
    this.modal.innerHTML = `
      <div class="modal-backdrop" id="aiBackdrop"></div>
      <div class="modal-dialog ai-dialog" role="dialog" aria-modal="true">
        <div class="modal-header">
          <div class="modal-title-group">
            <h2 class="modal-title">
              <span class="modal-title-svg text-purple">${Icons.sparkle(20)}</span>
              <span>AI Travel Assistant</span>
            </h2>
            <p class="modal-subtitle">Instant recommendations grounded in your live route options</p>
          </div>
          <button type="button" class="btn-close-modal" id="btnCloseAI" aria-label="Close modal">
            ${Icons.close(16)}
          </button>
        </div>

        <!-- Chat History Window -->
        <div class="ai-chat-window" id="aiChatWindow">
          <div class="ai-msg bot">
            <div class="ai-avatar-svg">
              ${Icons.bot(20)}
            </div>
            <div class="ai-bubble">
              <p>Hello! I can analyze your active route comparison to help you balance price, speed, and comfort.</p>
              <p>Tap a suggested query below or ask any question about fares, travel times, or walking distances.</p>
            </div>
          </div>
        </div>

        <!-- Quick Question Prompts -->
        <div class="ai-suggestions-row" id="aiSuggestionsRow">
          <button type="button" class="ai-prompt-chip">
            <span class="chip-svg">${Icons.tag(13)}</span> What's the cheapest way?
          </button>
          <button type="button" class="ai-prompt-chip">
            <span class="chip-svg">${Icons.bolt(13)}</span> What is the fastest route?
          </button>
          <button type="button" class="ai-prompt-chip">
            <span class="chip-svg">${Icons.walk(13)}</span> Walk less than 500m
          </button>
          <button type="button" class="ai-prompt-chip">
            <span class="chip-svg">${Icons.tag(13)}</span> Options under ₹200
          </button>
          <button type="button" class="ai-prompt-chip">
            <span class="chip-svg">${Icons.transfer(13)}</span> Fewest changes
          </button>
          <button type="button" class="ai-prompt-chip">
            <span class="chip-svg">${Icons.ac(13)}</span> Best AC ride
          </button>
        </div>

        <!-- Chat Input Bar -->
        <div class="ai-input-bar">
          <input type="text" id="aiTextInput" class="ai-input" placeholder="Ask about routes, price, time, or walking..." />
          <button type="button" class="btn-ai-send" id="btnAiSend" aria-label="Send query">
            ${Icons.send(16)}
          </button>
        </div>
      </div>
    `;

    document.getElementById('btnCloseAI').onclick = () => this.hide();
    document.getElementById('aiBackdrop').onclick = () => this.hide();

    const sendBtn = document.getElementById('btnAiSend');
    const input = document.getElementById('aiTextInput');

    sendBtn.onclick = () => this.submitQuery();
    input.onkeydown = (e) => {
      if (e.key === 'Enter') this.submitQuery();
    };

    this.modal.querySelectorAll('.ai-prompt-chip').forEach(chip => {
      chip.onclick = () => {
        const text = chip.innerText.trim();
        this.processQuery(text);
      };
    });
  }

  setContext(options, metadata) {
    this.activeOptions = options;
    this.metadata = metadata;
  }

  show() {
    if (this.modal) {
      this.modal.classList.add('active');
      document.getElementById('aiTextInput')?.focus();
    }
  }

  hide() {
    if (this.modal) {
      this.modal.classList.remove('active');
    }
  }

  submitQuery() {
    const input = document.getElementById('aiTextInput');
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    this.processQuery(text);
  }

  processQuery(queryText) {
    const chatWindow = document.getElementById('aiChatWindow');

    const userMsg = document.createElement('div');
    userMsg.className = 'ai-msg user';
    userMsg.innerHTML = `
      <div class="ai-bubble user-bubble">${queryText}</div>
    `;
    chatWindow.appendChild(userMsg);
    chatWindow.scrollTop = chatWindow.scrollHeight;

    setTimeout(() => {
      const response = AIAssistantService.answerQuery(queryText, this.activeOptions, this.metadata);
      
      const botMsg = document.createElement('div');
      botMsg.className = 'ai-msg bot';
      
      let cardsHtml = '';
      if (response.matchingOptions && response.matchingOptions.length > 0) {
        cardsHtml = `
          <div class="ai-recommendation-cards">
            ${response.matchingOptions.map(opt => `
              <div class="ai-mini-card" data-id="${opt.id}">
                <div class="ai-card-title">${opt.name}</div>
                <div class="ai-card-stats">
                  <span class="text-green font-bold">${opt.fareDisplay}</span> · 
                  <span class="text-blue font-bold">${opt.durationDisplay}</span> · 
                  <span>${opt.walkingMinutes > 0 ? opt.walkingMinutes + 'm walk' : '0 walk'}</span>
                </div>
                <button type="button" class="btn-ai-select-opt" data-id="${opt.id}">
                  <span>Select on Map</span>
                  <span class="mini-arrow">${Icons.arrowRight(12)}</span>
                </button>
              </div>
            `).join('')}
          </div>
        `;
      }

      botMsg.innerHTML = `
        <div class="ai-avatar-svg">
          ${Icons.bot(20)}
        </div>
        <div class="ai-bubble">
          <div class="bot-text">${response.answer.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br/>')}</div>
          ${cardsHtml}
        </div>
      `;

      chatWindow.appendChild(botMsg);
      chatWindow.scrollTop = chatWindow.scrollHeight;

      botMsg.querySelectorAll('.btn-ai-select-opt').forEach(btn => {
        btn.onclick = () => {
          const optId = btn.dataset.id;
          const opt = this.activeOptions.find(o => o.id === optId);
          if (opt && this.onSelectOption) {
            this.hide();
            this.onSelectOption(opt);
          }
        };
      });
    }, 300);
  }
}
