import { interpolationSearch } from "./search-algo"
import { getRandomInt } from "./getRandomInt"

export const performBenchmark = (attempts, hybridSearch, dataset ) => {

    //  --- Config ---
    const DOWNSAMPLE_RATE = 50
    let plotPoints = Math.floor(attempts / DOWNSAMPLE_RATE)  // For noise handling, attempts has minumum of 10k hence the lowest range is 200 to handle noise

    // --- State --- 
    
    // Incrementation for multiplying the plotPoints when attempts reached plotPoints 
    // eg. i >= plotPoints * counter => increment counter for the next threshold 
    let counter = 1 
    let min = Infinity // Fastest operation after handling noise

    // Noise Handlers 
    const noiseHandlers = {
      interpolation: {uniform: 0, nonUniform: 0 },
      hybridSearch: {uniform: 0, nonUniform: 0 }
    }

    // --- Results ---
    const result = {
      interpolation: { uniform: [], nonUniform: [] },
      hybridSearch: { uniform: [], nonUniform: [] }
    }

    // --- Benchmark Loop --- 
    for (let i = 0; i <= attempts; i++) {
      const target = getRandomInt(0,dataset.uniformArr.length) // Same target for both algorithms    

      // Baseline (Interpolation)
      recordExecutionTime(target, dataset.uniformArr, noiseHandlers.interpolation, "uniform", interpolationSearch)
      recordExecutionTime(target, dataset.nonUniformArr, noiseHandlers.interpolation, "nonUniform", interpolationSearch)

      // Baseline (Hybrid)
      recordExecutionTime(target, dataset.uniformArr, noiseHandlers.hybridSearch, "uniform", hybridSearch)
      recordExecutionTime(target, dataset.nonUniformArr, noiseHandlers.hybridSearch, "nonUniform", hybridSearch)

      // Handle noise / Down Sampling when iteration reached plotPoints
      if (i >= plotPoints * counter ) {
        recordDownSampling(result.interpolation, plotPoints, noiseHandlers.interpolation, min)
        recordDownSampling(result.hybridSearch, plotPoints, noiseHandlers.hybridSearch, min)
        counter += 1
      }
    } 

    return result
}

const recordDownSampling = (result,plotPoints, noiseHandler, min) => {
  // Record the final time after handling the noise
  result.uniform.push(noiseHandler.uniform / plotPoints) 
  result.nonUniform.push(noiseHandler.nonUniform / plotPoints)

  // Set fastest execution time after noise handling
  min = Math.min(min.value, noiseHandler.uniform / plotPoints, noiseHandler.nonUniform / plotPoints)
  
  // Reset noise handler
  noiseHandler.uniform = 0 
  noiseHandler.nonUniform = 0 
}

const recordExecutionTime = (target, arr, noiseHandler, noiseHandlerKey, search) => {
  // Test
  let start = performance.now()
  search(arr,target)
  let end = performance.now()
  noiseHandler[noiseHandlerKey] += (end - start)
}