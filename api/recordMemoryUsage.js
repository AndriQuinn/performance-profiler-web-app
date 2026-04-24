import { interpolationBinarySearch, interpolationFibonacciSearch, interpolationExponentialSearch } from "../src/utils/search-algo.js";
import { generateUniformData, generateNonUniformData } from "../src/utils/generateData.js"
import { getRandomInt } from "../src/utils/getRandomInt.js"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(20, "1 m"), // 20 requests per minute per IP
})

export default async function performMemoryUsage(req, res) {

    if (req.method === "OPTIONS") return res.status(200).end()

    console.log("URL exists:", !!process.env.UPSTASH_REDIS_REST_URL)
    console.log("TOKEN exists:", !!process.env.UPSTASH_REDIS_REST_TOKEN)
    
    try {
      const ip = req.headers["x-forwarded-for"] || "anonymous"
      const { success } = await ratelimit.limit(ip)
      if (!success) {
        return res.status(429).json({ error: "Too many requests, slow down!" })
      }
    } catch (err) {
      // if Upstash is down, let requests through so app doesn't break
      console.error("Rate limiter error:", err)
    }

    const { attempts, type, size } = req.body
    const dataset = (type === 'uniform') ? generateUniformData(size) : generateNonUniformData(size)

    //  --- Config ---
    const DOWNSAMPLE_RATE = 30
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
         memory: 0
    }])
    )

    // --- Results ---
    const result = []

    // --- Benchmark Loop --- 
    for (let i = 0; i <= attempts; i++) {
      const target = getRandomInt(0,dataset.length) // Same target for both algorithms    

      for (const { key, fn } of algorithms) {
        recordMemoryUsage(target, dataset, noiseHandlers[key], fn)
      }

      // Handle noise / Down Sampling when iteration reached plotPoints
      if (i >= plotPoints * counter ) {
        recordDownSampling(result, plotPoints, counter, noiseHandlers, algorithms,TO_MEGABYTE)
        counter += 1
      }
    } 

    res.status(200).json({ result })

}

const recordDownSampling = (result,plotPoints, counter, noiseHandler, algorithms, TO_MEGABYTE) => {
// build point dynamically from algorithms array
  const memoryPoint = { x: counter }

  for (const { key } of algorithms) {
    
    memoryPoint[key] = (noiseHandler[key].memory / plotPoints) / TO_MEGABYTE

    // reset
    noiseHandler[key].memory = 0
  }

  result.push(memoryPoint)
}

const recordMemoryUsage = (target, arr, noiseHandler, search) => {
  // Test
  let memBefore = process.memoryUsage().heapUsed
  search(arr,target)
  let memAfter = process.memoryUsage().heapUsed
  
  noiseHandler.memory += memAfter - memBefore
}

const sumArray = (arr) => arr.reduce((acc, val) => acc + val, 0)
