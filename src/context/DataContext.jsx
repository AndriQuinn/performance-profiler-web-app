import { createContext, useState,useRef, useEffect } from 'react';


export const DataContext = createContext(null);

export function DataProvider({ children }) {

  const workerRef = useRef(null)
  const [ metrics, setMetrics ] = useState(null)
  const [ dataset, setDataset ] = useState(null)
  const [ benchmarkResult, setBenchmarkResult ] = useState(null)
  let size = null

  useEffect(() => {
    workerRef.current = new Worker(new URL('../utils/worker.js', import.meta.url), { type: 'module' });
    
    workerRef.current.onmessage = (e) => {
      const { type, dataset , result } = e.data;

        if (type === 'GENERATED') setDataset(dataset);
        if (type === 'BENCHMARK_RESULT') setBenchmarkResult(result);
    }
    return  () => workerRef.current.terminate()

  },[])

  return (
    <DataContext.Provider value={{ 
      workerRef,
      metrics, setMetrics,
      dataset, setDataset,
      benchmarkResult, setBenchmarkResult
      }}>
      {children}
    </DataContext.Provider>
  );
}