import { createContext, useContext, useState,useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";


const DataContext = createContext(null);

export function DataProvider({ children }) {

  const workerRef = useRef(null)
  const [ dataset, setDataset ] = useState(null)
  const [ benchmarkResult, setBenchmarkResult ] = useState(null)
  let size = null

  useEffect(() => {
    workerRef.current = new Worker(new URL('../utils/worker.js', import.meta.url), { type: 'module' });

    workerRef.current.onmessage = (e) => {
      const { type, dataset, result } = e.data;

        if (type === 'GENERATED') setDataset(dataset);
        if (type === 'BENCHMARK_RESULT') setBenchmarkResult(result);
    }
    return  () => workerRef.current.terminate()

  },[])

  return (
    <DataContext.Provider value={{ 
      workerRef,
      dataset, setDataset,
      benchmarkResult, setBenchmarkResult
      }}>
      {children}
    </DataContext.Provider>
  );
}

export function useGenerate() {
  const navigate = useNavigate()
  const { workerRef, dataset, size } = useContext(DataContext);

  const generate = (size) => {
    workerRef.current.postMessage({type: 'GENERATE', payload: {size}})
    sessionStorage.setItem("size",size)
  }

  return { dataset, generate }
}

export function runBenchmark() {
  const { workerRef, benchmarkResult } = useContext(DataContext);

  const runTimeBenchmark = (attempts, hybridSearch ) => {
    workerRef.current.postMessage({type: 'RUN_BENCHMARK', payload: { attempts, hybridSearch }})
  }

  return { runTimeBenchmark,  benchmarkResult }
}

export function useData() {
  return useContext(DataContext);
}