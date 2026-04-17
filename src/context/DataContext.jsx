import { createContext, useState,useRef, useEffect } from 'react';
import { useGenerateTable } from '../hooks/useGenerateTable';


export const DataContext = createContext(null);

export function DataProvider({ children }) {

  const workerRef = useRef(null)
  const tableWorkerRef = useRef(null)
  const [ metrics, setMetrics ] = useState(null)
  const [ datasetTable, setDatasetTable ] = useState(null)
  const [ datasetArr, setDatasetArr ] = useState(null)
  const [ benchmarkResult, setBenchmarkResult ] = useState(null)
  let size = null

  useEffect(() => {
    workerRef.current = new Worker(new URL('../utils/worker.js', import.meta.url), { type: 'module' });
    tableWorkerRef.current = new Worker(new URL('../workers/tableWorker.js', import.meta.url), { type: 'module' });
    
    workerRef.current.onmessage = (e) => {
      const { type, newResult, newMetrics, newDatasetArr } = e.data;

        if (type === 'GENERATED') setDatasetArr(newDatasetArr);
        if (type === 'BENCHMARK_RESULT') {
          setBenchmarkResult(newResult)};
          setMetrics(newMetrics)
        }
      
    tableWorkerRef.current.onmessage = (e) => {
      const { type, newDatasetTable } = e.data
      if (type === 'NEW_TABLE') setDatasetTable(newDatasetTable)
    }

    return  () => {
      workerRef.current.terminate()
      tableWorkerRef.current.terminate()
    }

  },[])

  return (
    <DataContext.Provider value={{ 
      workerRef, tableWorkerRef,
      metrics, setMetrics,
      datasetArr, datasetTable,
      benchmarkResult, setBenchmarkResult
      }}>
      {children}
    </DataContext.Provider>
  );
}
