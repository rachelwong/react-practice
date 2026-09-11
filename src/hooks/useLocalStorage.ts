const useLocalStorage = <T>({ key, value }: { key?: string; value?: T }) => {
  const storedLocalStorage = (): T | undefined => {
    if (!!key && !!localStorage.getItem(key)) {
      const item = JSON.parse(localStorage.getItem(key) || "{}");
      return item;
    }
  };

  const updateLocalStorage = () => {
    if (!key || !localStorage.getItem(key)) {
      return null; // TODO should it?
    }
    localStorage.setItem(key, JSON.stringify(value));
  };

  const removeLocalStorage = () => {
    if (!key || !localStorage.getItem(key)) {
      return null; // TODO should it?
    }
    localStorage.removeItem(key);
  };

  const clearLocalStorage = () => {
    localStorage.clear();
  };

  return {
    storedLocalStorage,
    updateLocalStorage,
    removeLocalStorage,
    clearLocalStorage,
  };
};

export default useLocalStorage;
