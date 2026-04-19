import { interpolationSearch } from "./search-algo"
import { getRandomInt } from "./getRandomInt"
import { interpolationBinarySearch, interpolationFibonacciSearch, interpolationExponentialSearch } from "../utils/search-algo";

export const performBenchmark = (attempts, dataset ) => {

    //  --- Config ---
    const DOWNSAMPLE_RATE = 30
    let plotPoints = Math.floor(attempts / DOWNSAMPLE_RATE)  // For noise handling, attempts has minumum of 10k hence the lowest range is 200 to handle noise
    const NUM_SERIES = 6 // Interpolation - Uniform / Non Uniform - Hybrid - Uniform / Non Uniform
    const algorithms = [
      { key: 'interpolationBinary',      fn: interpolationBinarySearch },
      { key: 'interpolationFibonacci',   fn: interpolationFibonacciSearch },
      { key: 'interpolationExponential', fn: interpolationExponentialSearch }
    ]

    // --- State ---     
    // Incrementation for multiplying the plotPoints when attempts reached plotPoints 
    // eg. i >= plotPoints * counter => increment counter for the next threshold 
    let counter = 1 
    let total = []
    let max = Infinity

    // Noise Handlers 
    const noiseHandlers = Object.fromEntries(
      algorithms.map(({ key }) => [key, { uniform: 0, nonUniform: 0 }])
    )

    // --- Results ---
    const result = {
      uniform: { executionTime: [] },
      nonUniform: { executionTime: [] }
    }

    const metrics = {
      totalExecutionTime: Infinity,
      averageTime: Infinity,
      fastestOperation: Infinity
    }

    // --- Benchmark Loop --- 
    for (let i = 0; i <= attempts; i++) {
      const target = getRandomInt(0,dataset.uniformArr.length) // Same target for both algorithms    

      for (const { key, fn } of algorithms) {
        recordExecutionTime(target, dataset.uniformArr, noiseHandlers[key], "uniform", fn)
        recordExecutionTime(target, dataset.nonUniformArr, noiseHandlers[key], "nonUniform", fn)
      }

      // Handle noise / Down Sampling when iteration reached plotPoints
      if (i >= plotPoints * counter ) {
        recordDownSampling(result, plotPoints, noiseHandlers, metrics,counter,algorithms)
        counter += 1
      }
    } 

    metrics.averageTime = metrics.totalExecutionTime / NUM_SERIES

    return { result, metrics }
}

const recordDownSampling = (result,plotPoints, noiseHandler, metrics,counter, algorithms) => {
// build point dynamically from algorithms array
  const uniformPoint = { x: counter }
  const nonUniformPoint = { x: counter }
  const allValues = []

  for (const { key } of algorithms) {
    uniformPoint[key] = noiseHandler[key].uniform / plotPoints
    nonUniformPoint[key] = noiseHandler[key].nonUniform / plotPoints

    allValues.push(uniformPoint[key], nonUniformPoint[key])

    // reset
    noiseHandler[key].uniform = 0
    noiseHandler[key].nonUniform = 0
  }

  result.uniform.executionTime.push(uniformPoint)
  result.nonUniform.executionTime.push(nonUniformPoint)

  metrics.fastestOperation = Math.min(metrics.fastestOperation, ...allValues)
  metrics.totalExecutionTime = sumArray(allValues)
}

const recordExecutionTime = (target, arr, noiseHandler, noiseHandlerKey, search) => {
  // Test
  let start = performance.now()
  search(arr,target)
  let end = performance.now()
  noiseHandler[noiseHandlerKey] += (end - start)
}

const sumArray = (arr) => arr.reduce((acc, val) => acc + val, 0)
