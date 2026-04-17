// Gets the data
import { performBenchmark } from "./performBenchmark";
import { generateUniformData, generateNonUniformData, generateTable } from "./generateData";
import { interpolationBinarySearch, interpolationFibonacciSearch, interpolationExponentialSearch } from "./search-algo";

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

      switch(payload.hybridSearch) {
        case 'Interpolation-Binary': {
          const { result, metrics } = performBenchmark(payload.attempts, interpolationBinarySearch, newDatasetArr);
          newResult = result
          newMetrics = metrics
          break
        }

        case 'Interpolation-Fibonacci': {
          const { result,  metrics} = performBenchmark(payload.attempts, interpolationFibonacciSearch, newDatasetArr);
          newResult = result
          newMetrics = metrics
          break
        }

        case 'Interpolation-Exponential':{
          const { result, metrics } = performBenchmark(payload.attempts, interpolationExponentialSearch, newDatasetArr);
          newResult = result
          newMetrics = metrics
          break
        }

        default:
          console.log('Algorithm not found')
      }

      self.postMessage({ type: 'BENCHMARK_RESULT', newResult, newMetrics }); // Return the results
      break;
  }
}

const generateDataArr = (size) => {
  let uniformArr = generateUniformData(size)
  let nonUniformArr = generateNonUniformData(size)

  return { uniformArr, nonUniformArr }
}
