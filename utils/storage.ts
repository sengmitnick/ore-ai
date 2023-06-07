export const storage = {
  setItem(key: string, value: string) {
    if (typeof window === 'undefined') return;
    if (window.self !== window.top) return;
    if (!window.navigator.cookieEnabled) return;
    return window.localStorage.setItem(key, value);
  },
  getItem(key: string) {
    if (typeof window === 'undefined') return null;
    if (window.self !== window.top) return null;
    if (!window.navigator.cookieEnabled) return null;
    return window.localStorage.getItem(key);
  },
  removeItem(key: string) {
    if (typeof window === 'undefined') return;
    if (window.self !== window.top) return;
    if (!window.navigator.cookieEnabled) return;
    return window.localStorage.removeItem(key);
  },
};
