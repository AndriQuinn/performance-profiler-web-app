import { DataContext } from '../context/DataContext'
import { useContext } from 'react';

export function useGenerateTable() {
  const { tableWorkerRef } = useContext(DataContext);

  const generateTable = ( datasetArr ) => {
    // Send worker
    tableWorkerRef.current.postMessage({ type: 'GENERATE_TABLE', payload: { datasetArr }})
  }

  return { generateTable }
}
