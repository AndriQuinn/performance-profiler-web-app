import { DataContext } from '../context/DataContext'
import { useContext } from 'react';

export function useGenerate() {
  const { workerRef, datasetArr, size } = useContext(DataContext);

  const generate = (size) => {
    // Send worker
    workerRef.current.postMessage({type: 'GENERATE', payload: {size}})
    sessionStorage.setItem("size",size)
  }

  return { datasetArr, generate }
}