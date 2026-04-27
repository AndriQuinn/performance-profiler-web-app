import { DataContext } from '../context/DataContext'
import { useContext } from 'react';

export function useBenchmark() {

  const { workerRef, benchmarkResult, pendingBenchmark } = useContext(DataContext);

  // Send worker
  const runBenchmark = (attempts) => {
    return new Promise((resolve) => {
      pendingBenchmark.current = resolve  // store resolve
      workerRef.current.postMessage({ 
        type: 'RUN_BENCHMARK', 
        payload: { attempts } 
      })
    })
  }

  return { runBenchmark,  benchmarkResult }
}
