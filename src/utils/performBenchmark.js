import { interpolationSearch } from "./search-algo"
import { getRandomInt } from "./getRandomInt"

export const performBenchmark = (attempts,hybridSearch,results, downSamplingPlots, uniformArr,nonUniformArr) => {

    var counter = [1,1] // Multiplier
    var plotPoints = Math.floor(attempts / 50)

    // Noise Handlers 
    var noiseHandlerInterpolation = {
      uniform: 0,
      nonUniform: 0
    }

    var noiseHandlerHybridSearch  = {
      uniform: 0,
      nonUniform: 0
    }
    
    var min = 1 // Fastest Operation

    // Reset plot value each new benchmark
    downSamplingPlots.interpolation.uniform = [] 
    downSamplingPlots.interpolation.nonUniform = []
    downSamplingPlots.hybridSearch.uniform = []
    downSamplingPlots.hybridSearch.nonUniform = []
    
    for (var i = 0; i <= attempts; i++) {
      var target = getRandomInt(0,uniformArr.length) // Same target for both algorithms
      var start = performance.now() // Start Time
      var end = performance.now() // End Time

      // Baseline

      // Uniform
      start = performance.now()
      interpolationSearch(uniformArr,target)
      end = performance.now()
      results.interpolation.uniform.executionTime.push(end - start)
      noiseHandlerInterpolation.uniform += (end - start) // Record the total for noise handling for interpolation

      // Non - Uniform
      start = performance.now()
      interpolationSearch(nonUniformArr,target)
      end = performance.now()
      results.interpolation.nonUniform.executionTime.push(end - start)
      noiseHandlerInterpolation.nonUniform += (end - start) // Record the total for noise handling  for interpolation

      // Noise Handling
      if (i >= plotPoints * counter[0]) {
        downSamplingPlots.interpolation.uniform.push(noiseHandlerInterpolation.uniform / plotPoints)
        min = Math.min(min, noiseHandlerInterpolation.uniform / plotPoints)
        downSamplingPlots.interpolation.nonUniform.push(noiseHandlerInterpolation.nonUniform / plotPoints)
        min = Math.min(min, noiseHandlerInterpolation.nonUniform / plotPoints) 
        counter[0] += 1
        // Reset total
        noiseHandlerInterpolation.uniform = 0 
        noiseHandlerInterpolation.nonUniform = 0 
      }
      
      // Hybrid Algo

      // Uniform
      start = performance.now()
      hybridSearch(uniformArr,getRandomInt(0,target))
      end = performance.now()
      results.hybridSearch.uniform.executionTime.push(end - start)
      noiseHandlerHybridSearch.uniform += (end - start) // Reset total// Record the total for noise handling 

      // Non - Uniform
      start = performance.now()
      hybridSearch(nonUniformArr,target)
      end = performance.now()
      results.hybridSearch.nonUniform.executionTime.push(end - start)
      noiseHandlerHybridSearch.nonUniform += (end - start)

      // Noise Handling
      if (i >= plotPoints * counter[1] ) {
        downSamplingPlots.hybridSearch.uniform.push(noiseHandlerHybridSearch.uniform / plotPoints)
        min = Math.min(min, noiseHandlerHybridSearch.uniform / plotPoints)
        downSamplingPlots.hybridSearch.nonUniform.push(noiseHandlerHybridSearch.nonUniform / plotPoints)
        min = Math.min(min, noiseHandlerHybridSearch.nonUniform / plotPoints)
        counter[1] += 1
        // Reset total
        noiseHandlerHybridSearch.uniform = 0 
        noiseHandlerHybridSearch.nonUniform = 0 
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