# 🚗 GoCompare — Compare Every Way to Get There

> **A unified, multi-modal urban transit comparison platform and AI Travel Copilot for Indian cities.**  
> 100% Open-Source Geospatial Stack — Zero commercial mapping API fees.

[![Netlify Status](https://img.shields.io/badge/Deployed%20on-Netlify-00C7B7?style=flat&logo=netlify&logoColor=white)](https://gentle-bonbon-6f4d3b.netlify.app)
[![Vanilla JS](https://img.shields.io/badge/Built%20With-Vanilla%20JS%20(ES6)-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS3](https://img.shields.io/badge/Styling-Custom%20CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://www.w3.org/Style/CSS/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📌 Overview

Daily commuters in Indian metropolitan cities often face severe app fatigue—switching between Uber, Ola, Rapido, and various public transit apps to check surge pricing, wait times, and travel feasibility.

**GoCompare** solves this by consolidating all transit alternatives into a single responsive dashboard. By pairing real-time cab and auto fare estimation with mass transit (Metro & Buses) and an interactive **AI Travel Copilot**, GoCompare enables commuters to make optimal, cost-effective travel decisions in seconds.

---

## ✨ Key Features

- **🚖 Multi-Modal Ride Comparison**:
  - Compare real-time fare estimates and travel times across **Uber (Go, Premier)**, **Ola (Mini, Prime)**, **Rapido (Bike, Auto)**, and **Namma Yatri (ONDC)**.
  - Deep-link integration for instant 1-click booking with service providers.

- **🚇 Public Transit & Metro Routing**:
  - Complete Delhi Metro route planning with station sequences, line interchange guidance, journey durations, and exact DMRC ticket pricing.
  - Integration of AC City Bus alternatives for maximum commuter savings.

- **🔀 Smart Mixed-Mode Trips**:
  - Analyzes hybrid routes (e.g., *Metro line + Last-mile Auto-Rickshaw*) to uncover "best value" options that save up to 70–90% compared to direct cab rides.

- **🤖 AI Travel Copilot**:
  - Natural-language route assistant that understands queries like:
    - *"What is the cheapest option under ₹200?"*
    - *"Fastest way with minimum walking?"*
    - *"AC comfort only"*
  - Provides instant tradeoffs between cost, time, and convenience.

- **🗺️ 100% Free & Open Geospatial Stack**:
  - Powered entirely by **OpenStreetMap**, **OSRM (Open Source Routing Machine)**, and **Leaflet.js**.
  - Computes real road network distances, turn-by-turn routes, and interactive GeoJSON polylines with **zero commercial API billing**.

- **🏙️ Multi-City Architecture**:
  - Switch between major Indian metropolitan transit networks:
    - **Delhi NCR** (Delhi, Noida, Gurgaon, Faridabad, Ghaziabad)
    - **Mumbai**
    - **Bengaluru**
    - **Hyderabad**
    - **Pune**

- **🎨 Modern Vanilla UI/UX**:
  - Custom design system with glassmorphism, responsive mobile layouts, and seamless Light/Dark mode switching.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Architecture** | **Vanilla JavaScript (Modular ES6)** — Pure browser-native logic without framework overhead |
| **Styling & Design** | **Custom CSS3** (`:root` CSS variables, Flexbox, Grid, Glassmorphism) |
| **Mapping & Visuals** | **Leaflet.js** & **OpenStreetMap Carto Tiles** |
| **Routing & Geocoding** | **OSRM** (Driving routes) & **Nominatim** (Address resolution) |
| **Transit Solver** | Breadth-First Search (**BFS**) Graph Traversal on Metro network topologies |
| **Local Development** | **Python 3** (`http.server` with ES Module MIME handling) |
| **Hosting & Deployment** | **Netlify** |

---

## 📁 Project Structure

```text
GoCompare/
├── css/
│   └── styles.css          # Complete custom design system & dark/light theme
├── js/
│   ├── app.js              # Application entry point & state management
│   ├── components/
│   │   ├── aiAssistantModal.js  # Conversational AI Copilot UI
│   │   ├── bookingModal.js      # Provider handoff & deep link handler
│   │   ├── comparisonModal.js   # Side-by-side fare matrix
│   │   ├── mapComponent.js      # Leaflet map & OSRM route rendering
│   │   ├── resultsView.js       # Ride cards, sorting & filtering
│   │   ├── searchCard.js        # Origin/destination inputs & preset chips
│   │   └── settingsModal.js     # City network switcher & preferences
│   ├── data/
│   │   └── delhiMetro.json      # Metro station graph, lines & fare tables
│   ├── providers/
│   │   ├── uber.js              # Uber fare estimation models
│   │   ├── ola.js               # Ola fare models
│   │   ├── rapido.js            # Rapido bike/auto calculation
│   │   └── providerManager.js   # Aggregator orchestrator
│   └── services/
│       ├── aiAssistantService.js # NLP rule engine & query parser
│       ├── mixedModePlanner.js   # Hybrid Metro + Auto pathfinding
│       └── storageService.js     # LocalStorage for saved & recent places
├── index.html              # Main single-page application markup
├── package.json            # ES module metadata
└── serve.py                # Python local development server
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.x installed on your system (for running the local development server).
- Any modern web browser (Chrome, Firefox, Edge, Safari).

### Local Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/naman8258/GoCompare.git
   cd GoCompare
   ```

2. **Start the local server**:
   ```bash
   python serve.py
   ```

3. **Open in your browser**:
   Navigate to `http://localhost:8000`

---

## 🌐 Live Deployment

GoCompare is live and hosted on Netlify:  
👉 **[View Live App](https://gentle-bonbon-6f4d3b.netlify.app)**

---

## 💡 Future Roadmap

- [ ] Real-time ONDC live provider API sync
- [ ] Delhi DTC live GPS bus tracking integration
- [ ] Push notification alerts for metro line delays
- [ ] Offline PWA (Progressive Web App) support

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Naman Gupta**  
- GitHub: [@naman8258](https://github.com/naman8258)
