// Mock minimal DOM to test app.js initialization
const elementIds = [
  'appLogoBtn', 'headerCitySelector', 'currentCityLabel', 'btnOpenAI', 'btnOpenSettings',
  'searchCardContainer', 'resultsContainer', 'mapContainer', 'mapWrapper',
  'comparisonModalRoot', 'detailModalRoot', 'aiAssistantModalRoot', 'settingsModalRoot', 'bookingModalRoot',
  'appLoadingOverlay'
];

global.document = {
  getElementById: (id) => {
    return {
      id,
      innerHTML: '',
      classList: { add: () => {}, remove: () => {}, toggle: () => {} },
      querySelectorAll: () => [],
      querySelector: () => null,
      addEventListener: () => {},
      onclick: null,
      setAttribute: () => {},
      getAttribute: () => null,
      style: {}
    };
  },
  querySelectorAll: () => [],
  addEventListener: () => {},
  documentElement: {
    setAttribute: () => {}
  }
};
global.window = {
  matchMedia: () => ({ matches: false }),
  addEventListener: () => {},
  scrollTo: () => {}
};
global.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {}
};

import('./js/app.js').then(() => {
  console.log('App imported successfully!');
}).catch(err => {
  console.error('ERROR IMPORTING APP:', err);
});
