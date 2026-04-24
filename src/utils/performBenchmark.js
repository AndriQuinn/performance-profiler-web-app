import { interpolationSearch } from "./search-algo"
import { getRandomInt } from "./getRandomInt"
import { interpolationBinarySearch, interpolationFibonacciSearch, interpolationExponentialSearch } from "../utils/search-algo";

export const performBenchmark =  (attempts, dataset ) => {

    //  --- Config ---
    const DOWNSAMPLE_RATE = 30
    const TO_NANOSECONDS = 1e6
    const TO_MEGABYTE = 1e6
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

    // Noise Handlers 
    const noiseHandlers = Object.fromEntries(
      algorithms.map(({ key }) => [key, {
         uniform: { time: 0, memory: 0 }, 
         nonUniform: { time: 0, memory: 0 }
    }])
    )

    // --- Results ---
    const result = {
      uniform: { executionTime: [], memoryUsage: [] },
      nonUniform: { executionTime: [], memoryUsage: [] }
    }

    const metrics = {
      byAlgorithms: [
        { name: "Interpolation-Binary", total: 0 , average: 0 }, // Interpolation-Binary
        { name: "Interpolation-Fibonacci", total: 0 , average: 0 }, // Interpolation-Fibonacci
        { name: "Interpolation-Exponential", total: 0 , average: 0 }, // Interpolation-Exponential
      ],
      totalExecutionTime: 0,
      averageTime: 0,
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
        recordDownSampling(result, plotPoints, noiseHandlers, metrics,counter,algorithms, TO_NANOSECONDS, TO_MEGABYTE)
        counter += 1
      }
    } 

    metrics.averageTime = metrics.totalExecutionTime / DOWNSAMPLE_RATE / NUM_SERIES
    
    return { result, metrics }
}

const recordDownSampling = (result,plotPoints, noiseHandler, metrics,counter, algorithms, TO_NANOSECONDS, TO_MEGABYTE) => {
// build point dynamically from algorithms array
  const uniformTimePoint = { x: counter }
  const nonUniformTimePoint = { x: counter }
  const uniformMemPoint = { x: counter }
  const nonUniformMemPoint = { x: counter }

  const allValues = []
  let metricIteration = 0

  for (const { key } of algorithms) {
    metrics.byAlgorithms[metricIteration].total += ((noiseHandler[key].uniform.time / plotPoints) * TO_NANOSECONDS) +  ((noiseHandler[key].nonUniform.time / plotPoints) * TO_NANOSECONDS)
    metricIteration+= 1
    uniformTimePoint[key] = ((noiseHandler[key].uniform.time / plotPoints) * TO_NANOSECONDS)
    nonUniformTimePoint[key] = ((noiseHandler[key].nonUniform.time / plotPoints) * TO_NANOSECONDS)

    uniformMemPoint[key] = ((noiseHandler[key].uniform.memory / plotPoints) / TO_MEGABYTE)
    nonUniformMemPoint[key] = ((noiseHandler[key].nonUniform.memory / plotPoints) / TO_MEGABYTE)

    allValues.push(uniformTimePoint[key], nonUniformTimePoint[key])

    // reset
    noiseHandler[key].uniform.time = 0
    noiseHandler[key].nonUniform.time = 0
    noiseHandler[key].uniform.memory = 0
    noiseHandler[key].nonUniform.memory = 0
  }

  result.uniform.executionTime.push(uniformTimePoint)
  result.nonUniform.executionTime.push(nonUniformTimePoint)
  result.uniform.memoryUsage.push(uniformMemPoint)
  result.nonUniform.memoryUsage.push(nonUniformMemPoint)

  metrics.fastestOperation = Math.min(metrics.fastestOperation, ...allValues)
  metrics.totalExecutionTime += sumArray(allValues)
}

const recordExecutionTime = (target, arr, noiseHandler, noiseHandlerKey, search) => {
  const memBefore = performance.memory?.usedJSHeapSize ?? 0
  
  // Test
  let start = performance.now()
  search(arr,target)
  let end = performance.now()
  

  const memAfter = performance.memory?.usedJSHeapSize ?? 0
  noiseHandler[noiseHandlerKey].time += (end - start)
  noiseHandler[noiseHandlerKey].memory += memAfter - memBefore
}

const sumArray = (arr) => arr.reduce((acc, val) => acc + val, 0)
