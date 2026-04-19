// Gets the data
import { performBenchmark } from "../utils/performBenchmark";
import { generateUniformData, generateNonUniformData, generateTable } from "../utils/generateData";
import { interpolationBinarySearch, interpolationFibonacciSearch, interpolationExponentialSearch } from "../utils/search-algo";

let newDatasetArr = {}

// Define worker job: Perform the benchmark
self.onmessage = (e) => {
  // Get the passed data
  const { type, payload } = e.data
  
  switch(type) {

    // Generate syntetic data
    case 'GENERATE':
      newDatasetArr = generateDataArr(payload.size)
      self.postMessage(
        { type: 'GENERATED', 
          newDatasetArr: {
            uniformArr: Array.from(newDatasetArr.uniformArr),
            nonUniformArr: Array.from(newDatasetArr.nonUniformArr)
          }
        },
      );
      break;
      
    // Run benchmark for selected algorithm
    case 'RUN_BENCHMARK':
      let newResult = null 
      let newMetrics = null
      if (!newDatasetArr) return;

      const { result, metrics } = performBenchmark(payload.attempts, newDatasetArr);
      newResult = result
      newMetrics = metrics

      self.postMessage({ type: 'BENCHMARK_RESULT', newResult, newMetrics }); // Return the results
      break;
  }
}

// Generate data for both uniform and nonUniform data
const generateDataArr = (size) => {
  let uniformArr = generateUniformData(size)
  let nonUniformArr = generateNonUniformData(size)

  return { uniformArr, nonUniformArr }
}
