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
            const { datasetArr } = payload // Extract the key from the arr
            uniformTable = generateTable(datasetArr.uniformArr)  
            nonUniformTable = generateTable(datasetArr.nonUniformArr)
            break

        case 'GET_TABLE':
            const { limiter } = payload
            const newDatasetTable = {
                uniformTable: uniformTable.slice((limiter*ROW_NUM)-OFFSET,limiter * ROW_NUM),
                nonUniformTable: nonUniformTable.slice((limiter*ROW_NUM)-OFFSET,limiter * ROW_NUM)
            }
            
            self.postMessage({ type: 'NEW_TABLE',  newDatasetTable })        
            break
    }
}
