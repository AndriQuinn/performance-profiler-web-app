import { DataContext } from '../context/DataContext'
import { useContext } from 'react';

export function useBenchmark() {

  const { workerRef, benchmarkResult } = useContext(DataContext);

  // Send worker
  const runBenchmark = (attempts, hybridSearch ) => {
    workerRef.current.postMessage({type: 'RUN_BENCHMARK', payload: { attempts, hybridSearch }})
  }

  return { runBenchmark,  benchmarkResult }
}