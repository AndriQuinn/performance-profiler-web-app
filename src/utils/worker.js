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

    const sumArray = (arr) => arr.reduce((acc, val) => acc + val, 0) // For getting the sum of array

    // Get the total of 4 collected data eg. Interpolation => Uniform, NonU niform - Hybrid => Uniform, NonU niform
    const total = 
      sumArray(downSamplingPlots.interpolation.uniform) +
      sumArray(downSamplingPlots.interpolation.nonUniform) +
      sumArray(downSamplingPlots.hybridSearch.uniform) +
      sumArray(downSamplingPlots.hybridSearch.nonUniform)

    self.postMessage({ downSamplingPlots, min: min.value, total }) // Sends back the result
}