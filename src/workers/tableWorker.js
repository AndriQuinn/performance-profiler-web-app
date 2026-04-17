import { generateTable } from '../utils/generateData'

// -- Table --
let uniformTable = []
let nonUniformTable = []

// -- Config -- 
const ROW_NUM = 100
const OFFSET = 100

self.onmessage = (e) => {
    const { type, payload } = e.data

    switch(type) {
        case 'GENERATE_TABLE':            
            const { datasetArr } = payload // Extract the datasetArr
            uniformTable = generateTable(datasetArr.uniformArr)
            nonUniformTable = generateTable(datasetArr.nonUniformArr)
            break

        case 'GET_TABLE':
            const { limiter } = payload // Extract the datasetArr
            const newUniformTable = uniformTable.slice((limiter*ROW_NUM)-OFFSET,limiter * ROW_NUM)
            const newNonUniformTable = nonUniformTable.slice((limiter*ROW_NUM)-OFFSET,limiter * ROW_NUM)
            const newDatasetTable = {
                uniformTable: newUniformTable,
                nonUniformTable: newNonUniformTable
            }

            self.postMessage({ type: 'NEW_TABLE',  newDatasetTable }) // Return the new table
            break
    }
}
