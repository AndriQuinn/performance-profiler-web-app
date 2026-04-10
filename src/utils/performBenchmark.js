import { interpolationSearch } from "./search-algo"
import { getRandomInt } from "./getRandomInt"

export const performBenchmark = (attempts,hybridSearch, downSamplingPlots, uniformArr,nonUniformArr, min) => {

    // Incrementation for multiplying the plotPoints when attempts reached plotPoints 
    // eg. i >= plotPoints * counter => increment counter for the next threshold 
    let counter = 1 

    const DOWNSAMPLE_RATE = 50

    // For noise handling, attempts has minumum of 10k hence the lowest range is 200 to handle noise
    let plotPoints = Math.floor(attempts / DOWNSAMPLE_RATE) 

    // Noise Handlers 
    const noiseHandlerInterpolation = {
      uniform: 0,
      nonUniform: 0
    }

    const noiseHandlerHybridSearch  = {
      uniform: 0,
      nonUniform: 0
    }

    // Reset plot value each new benchmark
    downSamplingPlots.interpolation.uniform = [] 
    downSamplingPlots.interpolation.nonUniform = []
    downSamplingPlots.hybridSearch.uniform = []
    downSamplingPlots.hybridSearch.nonUniform = []

    for (let i = 0; i <= attempts; i++) {
      const target = getRandomInt(0,uniformArr.length) // Same target for both algorithms    

      // Baseline (Interpolation)
      recordExecutionTime(target, uniformArr, noiseHandlerInterpolation, "uniform", interpolationSearch)
      recordExecutionTime(target, nonUniformArr, noiseHandlerInterpolation, "nonUniform", interpolationSearch)

      // Baseline (Hybrid)
      recordExecutionTime(target, uniformArr, noiseHandlerHybridSearch, "uniform", hybridSearch)
      recordExecutionTime(target, nonUniformArr, noiseHandlerHybridSearch, "nonUniform", hybridSearch)

      // Handle noise / Down Sampling when iteration reached plotPoints
      if (i >= plotPoints * counter ) {
        recordDownSampling(downSamplingPlots.interpolation, plotPoints, noiseHandlerInterpolation, min)
        recordDownSampling(downSamplingPlots.hybridSearch, plotPoints, noiseHandlerHybridSearch, min)
        counter += 1
      }
    } 
}

const recordDownSampling = (downSamplingPlots,plotPoints, noiseHandler, min) => {
  // Record the final time after handling the noise
  downSamplingPlots.uniform.push(noiseHandler.uniform / plotPoints) 
  downSamplingPlots.nonUniform.push(noiseHandler.nonUniform / plotPoints)

  // Set fastest execution time after noise handling
  min.value = Math.min(min.value, noiseHandler.uniform / plotPoints, noiseHandler.nonUniform / plotPoints)
  
  // Reset total
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