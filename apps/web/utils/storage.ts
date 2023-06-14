const map = new Map<string, string>();

export const storage = {
  setItem(key: string, value: string) {
    if (typeof window === "undefined") return;
    if (!window.navigator.cookieEnabled) {
      map.set(key, value);
      return;
    }
    return window.localStorage.setItem(key, value);
  },
  getItem(key: string) {
    if (typeof window === "undefined") return null;
    if (!window.navigator.cookieEnabled) {
      return map.get(key) || null;
    }
    return window.localStorage.getItem(key);
  },
  removeItem(key: string) {
    if (typeof window === "undefined") return;
    if (!window.navigator.cookieEnabled) {
      map.delete(key);
      return;
    }
    return window.localStorage.removeItem(key);
  },
};
