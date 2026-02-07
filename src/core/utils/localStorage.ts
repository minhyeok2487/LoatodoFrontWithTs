export const setLocalStorage = <T>(key: string, value: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore localStorage errors
  }
};

export const getLocalStorage = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : null;
  } catch {
    return null;
  }
};

export const removeLocalStorage = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore localStorage errors
  }
};
