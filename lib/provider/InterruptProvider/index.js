import React, { createContext, useContext, useState } from "react";

const InterruptContext = createContext();

export function InterruptProvider({ children }) {
  const [isPaused, setIsPaused] = useState(false);
  const [resolveCallback, setResolveCallback] = useState(null);
  const [missingFields, setMissingFields] = useState({});
  const [data, setData] = useState(null)
  
  const requestData = (missingFields, data) => {
    setIsPaused(true);
    setMissingFields(missingFields);
    setData(data)

    return new Promise((resolve) => {
      setResolveCallback(() => resolve);
    });
  };

  const resumeAction = (userInput) => {
    setIsPaused(false);
    setResolveCallback(null);
    setMissingFields({});
    setData(null)
    if (resolveCallback) {
      resolveCallback(userInput);
    }
  };

  const cancelAction = () => {
    setIsPaused(false);
    setResolveCallback(null);
    setMissingFields({});
    setData(null)
    if (resolveCallback) {
      resolveCallback(null); 
    }
  };

  return (
    <InterruptContext.Provider value={{ isPaused, missingFields, requestData, resumeAction, cancelAction, data }}>
      {children}
    </InterruptContext.Provider>
  );
}

export function useInterrupt() {
  return useContext(InterruptContext);
}
