import { createContext, useContext, useState } from 'react';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [generatedData, setGeneratedData] = useState({
    uniformArr: [],
    nonUniformArr: []
  });

  return (
    <DataContext.Provider value={{ generatedData, setGeneratedData }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}