import { useState, useEffect } from "react";

function useLocalStorage(key, initialValue) {
  const [state, setState] = useState(() => {
    try {
      const storedValue = localStorage.getItem(key);
      if (storedValue !== null) {
        return JSON.parse(storedValue);
      }
      return initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      console.error("Error guardao en LocalStorage");
    }
  }, [key, state]);
  return [state, setState];
}
export default useLocalStorage;
