import { DataContext } from '../context/DataContext'
import { useContext } from 'react';

export function useGenerate() {
  const { workerRef, dataset, size } = useContext(DataContext);

  const generate = (size) => {
    workerRef.current.postMessage({type: 'GENERATE', payload: {size}})
    sessionStorage.setItem("size",size)
  }

  return { dataset, generate }
}