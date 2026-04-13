import { DataContext } from '../context/DataContext'
import { useContext } from 'react';

export function useBenchmark() {
//   const navigate = useNavigate()
  const { workerRef, benchmarkResult } = useContext(DataContext);

  const runBenchmark = (attempts, hybridSearch ) => {
    workerRef.current.postMessage({type: 'RUN_BENCHMARK', payload: { attempts, hybridSearch }})
    // navigate("/viewResults")
  }

  return { runBenchmark,  benchmarkResult }
}