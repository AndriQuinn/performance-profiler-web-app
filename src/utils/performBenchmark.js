import { interpolationSearch } from "./search-algo"
import { getRandomInt } from "./getRandomInt"

export const performBenchmark = (attempts,hybridSearch, downSamplingPlots, uniformArr,nonUniformArr, min) => {

    var counter = 1 // Multiplier
    // For noise handling, attempts has minumum of 10k hence the lowest range is 200 to handle noise
    var plotPoints = Math.floor(attempts / 50) 

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

    for (var i = 0; i <= attempts; i++) {
      var target = getRandomInt(0,uniformArr.length) // Same target for both algorithms    

      // Baseline (Interpolation)
      recordExecutionTime(target, uniformArr, noiseHandlerInterpolation, "uniform", interpolationSearch)
      recordExecutionTime(target, nonUniformArr, noiseHandlerInterpolation, "nonUniform", interpolationSearch)

      // Baseline (Hybrid)
      recordExecutionTime(target, uniformArr, noiseHandlerHybridSearch, "uniform", hybridSearch)
      recordExecutionTime(target, nonUniformArr, noiseHandlerHybridSearch, "nonUniform", hybridSearch)

      // Handle noise / Down Sampling
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