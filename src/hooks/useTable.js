import { DataContext } from '../context/DataContext'
import { useContext } from 'react';

export function useTable() {
  const { tableWorkerRef, datasetTable } = useContext(DataContext);

  const getTable = ( limiter ) => {
    // Send worker
    tableWorkerRef.current.postMessage({ type: 'GET_TABLE', payload: { limiter }})
  }

  return { datasetTable, getTable }
}
