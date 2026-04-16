import { createContext, useState,useRef, useEffect } from 'react';


export const DataContext = createContext(null);

export function DataProvider({ children }) {

  const workerRef = useRef(null)
  const [ metrics, setMetrics ] = useState(null)
  const [ datasetTable, setDatasetTable ] = useState(null)
  const [ datasetArr, setDatasetArr ] = useState(null)
  const [ benchmarkResult, setBenchmarkResult ] = useState(null)
  let size = null

  useEffect(() => {
    workerRef.current = new Worker(new URL('../utils/worker.js', import.meta.url), { type: 'module' });
    
    workerRef.current.onmessage = (e) => {
      const { type, newResult, newMetrics, newDatasetArr, newDatasetTable } = e.data;

        if (type === 'GENERATED') setDatasetArr(newDatasetArr);
        if (type === 'TABLE_GENERATED') setDatasetTable(newDatasetTable)
        if (type === 'BENCHMARK_RESULT') {
          setBenchmarkResult(newResult)};
          setMetrics(newMetrics)
        }
        
    return  () => workerRef.current.terminate()

  },[])

  return (
    <DataContext.Provider value={{ 
      workerRef,
      metrics, setMetrics,
      datasetArr, datasetTable,
      benchmarkResult, setBenchmarkResult
      }}>
      {children}
    </DataContext.Provider>
  );
}
