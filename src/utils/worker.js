// Gets the data
import { performBenchmark } from "./performBenchmark";
import { generateUniformData, generateNonUniformData } from "./generateData";
import { interpolationBinarySearch, interpolationFibonacciSearch, interpolationExponentialSearch } from "./search-algo";

let dataset = {
  uniformArr: [],
  nonUniformArr: []
}

// Define worker job: Perform the benchmark
self.onmessage = (e) => {
  // Get the passed data
  const { type, payload } = e.data
  
  switch(type) {
    // Generate syntetic data
    case 'GENERATE':
      dataset = generateDataset(payload.size);
      self.postMessage({ type: 'GENERATED', dataset });
      break;

    // Run benchmark for selected algorithm
    case 'RUN_BENCHMARK':
      let result = null 
      if (!dataset) return;

      switch(payload.hybridSearch) {
        case 'Interpolation-Binary':
          result = performBenchmark(payload.attempts, interpolationBinarySearch, dataset);
          break

        case 'Interpolation-Fibonacci':
          result = performBenchmark(payload.attempts, interpolationFibonacciSearch, dataset);
          break

        case 'Interpolation-Exponential':
          result = performBenchmark(payload.attempts, interpolationExponentialSearch, dataset);
          break

        default:
          console.log('Algorithm not found')
      }

      self.postMessage({ type: 'BENCHMARK_RESULT', result }); // Return the results
      break;
  }
}

const generateDataset = (size) => {
  let uniformArr = generateUniformData(size);
  let nonUniformArr = generateNonUniformData(size)

  return { uniformArr, nonUniformArr }
}