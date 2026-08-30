import { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [history, setHistory] = useState([]); // { id, timestamp, input, inputType, success, result, error }

  const logDecode = useCallback((entry) => {
    setHistory((prev) => [
      { id: prev.length + 1, timestamp: Date.now(), ...entry },
      ...prev,
    ]);
  }, []);

  const clearHistory = useCallback(() => setHistory([]), []);

  const value = { history, logDecode, clearHistory };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
