import { interpolationSearch } from "./search-algo"
import { getRandomInt } from "./getRandomInt"

export const performBenchmark = (attempts,hybridSearch,results, downSamplingPlots, uniformArr,nonUniformArr) => {

    var counter = 1 // Multiplier
    var plotPoints = Math.floor(attempts / 50) // For noise handling

    // Noise Handlers 
    var noiseHandlerInterpolation = {
      uniform: 0,
      nonUniform: 0
    }

    var noiseHandlerHybridSearch  = {
      uniform: 0,
      nonUniform: 0
    }
    
    var min = Infinity // Fastest Operation

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
        min = recordDownSampling(downSamplingPlots.interpolation, plotPoints, noiseHandlerInterpolation, min)
        min = recordDownSampling(downSamplingPlots.hybridSearch, plotPoints, noiseHandlerHybridSearch, min)
        counter += 1
      }

    } 

    // Get the overall total execution time
    const total = downSamplingPlots.interpolation.uniform.reduce((acc, val) => acc + val, 0) + downSamplingPlots.hybridSearch.uniform.reduce((acc, val) => acc + val, 0) + downSamplingPlots.interpolation.nonUniform.reduce((acc, val) => acc + val, 0) + downSamplingPlots.hybridSearch.nonUniform.reduce((acc, val) => acc + val, 0)
    sessionStorage.setItem("downSampling", JSON.stringify(downSamplingPlots)) // Set the final recorded data
    sessionStorage.setItem("min", min) // Fastest execution time
    sessionStorage.setItem("total",total) // Total execution time
    sessionStorage.setItem("average", total / 4) // Average time

    console.log(downSamplingPlots) // For debugging
}

const recordDownSampling = (downSamplingPlots,plotPoints, noiseHandler, min) => {
  // Record the final time after handling the noise
  downSamplingPlots.uniform.push(noiseHandler.uniform / plotPoints) 
  downSamplingPlots.nonUniform.push(noiseHandler.nonUniform / plotPoints)

  min = Math.min(min, noiseHandler.uniform / plotPoints, noiseHandler.nonUniform / plotPoints)
  
  // Reset total
  noiseHandler.uniform = 0 
  noiseHandler.nonUniform = 0 

  return min
}

const recordExecutionTime = (target, arr, noiseHandler, noiseHandlerKey, search) => {
  // Test
  let start = performance.now()
  search(arr,target)
  let end = performance.now()
  noiseHandler[noiseHandlerKey] += (end - start)
}