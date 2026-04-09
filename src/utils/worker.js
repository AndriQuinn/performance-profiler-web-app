// Gets the data
import { interpolationBinarySearch, interpolationFibonacciSearch, interpolationExponentialSearch } from "./search-algo";
import { performBenchmark } from "./performBenchmark";

// Define worker job: Perform the benchmark
self.onmessage = (e) => {
  const {attempts, hybridSearch,selectedMetric,generatedData, downSamplingPlots} = e.data

  console.log("Selected algorthm: ", hybridSearch)

    var min = { value: Infinity}

    // Match selected algorithm 
    switch(hybridSearch) {
        case 'Interpolation-Binary':
          performBenchmark(attempts, interpolationBinarySearch, downSamplingPlots,generatedData.uniformArr, generatedData.nonUniformArr, min)
          break
  
        case 'Interpolation-Fibonacci':
          performBenchmark(attempts, interpolationFibonacciSearch, downSamplingPlots,generatedData.uniformArr, generatedData.nonUniformArr, min)
          break
  
        case 'Interpolation-Exponential':
          performBenchmark(attempts, interpolationExponentialSearch, downSamplingPlots,generatedData.uniformArr, generatedData.nonUniformArr, min)
          break

        default:
          console.log("Error no hybrid found!")
          break
    }
  
    const total = downSamplingPlots.interpolation.uniform.reduce((acc, val) => acc + val, 0) + downSamplingPlots.hybridSearch.uniform.reduce((acc, val) => acc + val, 0) + downSamplingPlots.interpolation.nonUniform.reduce((acc, val) => acc + val, 0) + downSamplingPlots.hybridSearch.nonUniform.reduce((acc, val) => acc + val, 0)
    self.postMessage({ downSamplingPlots, min: min.value, total })
}