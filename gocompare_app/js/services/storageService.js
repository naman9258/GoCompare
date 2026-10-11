/**
 * Storage Service
 * Persists recent searches, favorites, saved places, and user settings using LocalStorage.
 */

const STORAGE_KEYS = {
  RECENT_SEARCHES: 'gocompare_recent_searches',
  SAVED_PLACES: 'gocompare_saved_places',
  USER_SETTINGS: 'gocompare_user_settings'
};

const DEFAULT_SAVED_PLACES = [
  { id: 'fav_home', title: 'Home', subtitle: 'Sector 62, Noida', lat: 28.6250, lng: 77.3650, icon: '🏠' },
  { id: 'fav_work', title: 'Work', subtitle: 'Cyber Hub, DLF Cyber City, Gurugram', lat: 28.4950, lng: 77.0895, icon: '💼' },
  { id: 'fav_college', title: 'College', subtitle: 'KCC ITM, Knowledge Park III, Greater Noida', lat: 28.4680, lng: 77.5020, icon: '🎓' },
  { id: 'fav_airport', title: 'Airport', subtitle: 'IGI Airport Terminal 3, New Delhi', lat: 28.5562, lng: 77.1000, icon: '✈️' }
];

const DEFAULT_SETTINGS = {
  theme: 'system', // 'light' | 'dark' | 'system'
  city: 'delhi_ncr',
  currency: '₹',
  language: 'en',
  notifications: true,
  demoMode: true
};

export class StorageService {
  static getRecentSearches() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RECENT_SEARCHES);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Storage read error:', e);
    }
    // Default initial recent searches for demonstration
    return [
      {
        id: 'rec_1',
        from: { name: 'Connaught Place (Rajiv Chowk)', lat: 28.6328, lng: 77.2197 },
        to: { name: 'Gurugram Cyber Hub', lat: 28.4950, lng: 77.0895 },
        cityId: 'delhi_ncr',
        timestamp: Date.now() - 3600000
      },
      {
        id: 'rec_2',
        from: { name: 'IGI Delhi Airport Terminal 3', lat: 28.5562, lng: 77.1000 },
        to: { name: 'Connaught Place (Rajiv Chowk)', lat: 28.6328, lng: 77.2197 },
        cityId: 'delhi_ncr',
        timestamp: Date.now() - 86400000
      },
      {
        id: 'rec_3',
        from: { name: 'Noida Sector 18 (Atta Market)', lat: 28.5708, lng: 77.3260 },
        to: { name: 'Gurugram Cyber Hub', lat: 28.4950, lng: 77.0895 },
        cityId: 'delhi_ncr',
        timestamp: Date.now() - 172800000
      }
    ];
  }

  static saveRecentSearch(from, to, cityId) {
    try {
      const recents = this.getRecentSearches().filter(
        r => !(r.from.name === from.name && r.to.name === to.name)
      );
      recents.unshift({
        id: `rec_${Date.now()}`,
        from: { name: from.name, lat: from.lat, lng: from.lng },
        to: { name: to.name, lat: to.lat, lng: to.lng },
        cityId,
        timestamp: Date.now()
      });
      // Cap at 10 items
      const trimmed = recents.slice(0, 10);
      localStorage.setItem(STORAGE_KEYS.RECENT_SEARCHES, JSON.stringify(trimmed));
      return trimmed;
    } catch (e) {
      console.warn('Storage write error:', e);
      return [];
    }
  }

  static clearRecentSearches() {
    try {
      localStorage.removeItem(STORAGE_KEYS.RECENT_SEARCHES);
    } catch (e) {}
  }

  static getSavedPlaces() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SAVED_PLACES);
      if (data) return JSON.parse(data);
    } catch (e) {}
    return DEFAULT_SAVED_PLACES;
  }

  static savePlace(place) {
    try {
      const list = this.getSavedPlaces();
      list.push({ ...place, id: `fav_${Date.now()}` });
      localStorage.setItem(STORAGE_KEYS.SAVED_PLACES, JSON.stringify(list));
      return list;
    } catch (e) {
      return [];
    }
  }

  static removePlace(id) {
    try {
      const list = this.getSavedPlaces().filter(p => p.id !== id);
      localStorage.setItem(STORAGE_KEYS.SAVED_PLACES, JSON.stringify(list));
      return list;
    } catch (e) {
      return [];
    }
  }

  static getSettings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_SETTINGS);
      if (data) return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    } catch (e) {}
    return DEFAULT_SETTINGS;
  }

  static updateSettings(partial) {
    try {
      const current = this.getSettings();
      const updated = { ...current, ...partial };
      localStorage.setItem(STORAGE_KEYS.USER_SETTINGS, JSON.stringify(updated));
      return updated;
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  }
}
