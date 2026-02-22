export const setLocalStorage = <T>(key: string, value: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error setting localStorage item:", error);
  }
};

export const getLocalStorage = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : null;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error getting localStorage item:", error);
    return null;
  }
};

export const removeLocalStorage = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error removing localStorage item:", error);
  }
};
