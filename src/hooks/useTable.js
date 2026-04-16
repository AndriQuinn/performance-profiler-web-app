import { DataContext } from '../context/DataContext'
import { useContext } from 'react';

export function useTable() {
  const { workerRef, datasetTable } = useContext(DataContext);

  const generateTable = () => {
    // Send worker
    workerRef.current.postMessage({type: 'GET_TABLE'})
  }

  return { datasetTable, generateTable }
}
