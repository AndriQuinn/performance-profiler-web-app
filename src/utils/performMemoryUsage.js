import { interpolationSearch } from "./search-algo"
import { getRandomInt } from "./getRandomInt"

export const performMemoryUsage = (attempts,hybridSearch,results, downSamplingPlots, uniformArr,nonUniformArr) => {

    var counter = [1,1] // Multiplier
    var plotPoints = Math.floor(attempts / 50)
    var totalUni = [0,0] // Gets avereagen for each plot points 0 - interpolation, 1 - inter-bin , 1 - inter-fibo , 1 - inter-exp
    var totalNonUni = [0,0] // Gets avereagen for each plot points 0 - interpolation, 1 - inter-bin , 1 - inter-fibo , 1 - inter-exp
    var min = 1
    
    downSamplingPlots.uniform.interpolation = []
    downSamplingPlots.uniform.hybridSearch = []
    downSamplingPlots.nonUniform.interpolation = []
    downSamplingPlots.nonUniform.hybridSearch = []
    
    for (var i = 0; i <= attempts; i++) {
      var target = getRandomInt(0,uniformArr.length)
      var beforeMem = process.memoryUsage().heapUsed; // beforeMem Time
      var afterMem = process.memoryUsage().heapUsed; // afterMem Time

      // Baseline
      beforeMem = process.memoryUsage().heapUsed;
      interpolationSearch(uniformArr,target)
      afterMem = process.memoryUsage().heapUsed;
      results.uniform.interpolation.executionTime.push(afterMem - beforeMem)
      totalUni[0] += (afterMem - beforeMem)

      beforeMem = process.memoryUsage().heapUsed;
      interpolationSearch(nonUniformArr,target)
      afterMem = process.memoryUsage().heapUsed;
      results.nonUniform.interpolation.executionTime.push(afterMem - beforeMem)
      totalNonUni[0] += (afterMem-beforeMem)

      if (i >= plotPoints * counter[0]) {
        downSamplingPlots.uniform.interpolation.push(totalUni[0] / plotPoints)
        min = Math.min(min, totalUni[0] / plotPoints)
        downSamplingPlots.nonUniform.interpolation.push(totalNonUni[0] / plotPoints)
        min = Math.min(min, totalNonUni[0] / plotPoints) 
        counter[0] += 1
        totalUni[0] = 0
        totalNonUni[0] = 0
      }
      
      // Hybrid Algo
      beforeMem = process.memoryUsage().heapUsed;
      hybridSearch(uniformArr,getRandomInt(0,target))
      afterMem = process.memoryUsage().heapUsed;
      results.uniform.hybridSearch.executionTime.push(afterMem - beforeMem)
      totalUni[1] += (afterMem - beforeMem)

      beforeMem = process.memoryUsage().heapUsed;
      hybridSearch(nonUniformArr,target)
      afterMem = process.memoryUsage().heapUsed;
      results.nonUniform.hybridSearch.executionTime.push(afterMem - beforeMem)
      totalNonUni[1] += (afterMem - beforeMem)

      if (i >= plotPoints * counter[1] ) {
        downSamplingPlots.uniform.hybridSearch.push(totalUni[1] / plotPoints)
        min = Math.min(min, totalUni[1] / plotPoints)
        downSamplingPlots.nonUniform.hybridSearch.push(totalNonUni[1] / plotPoints)
        min = Math.min(min, totalNonUni[1] / plotPoints)
        counter[1] += 1
        totalUni[1] = 0
        totalNonUni[1] = 0
      }
    } 

    const total = downSamplingPlots.uniform.interpolation.reduce((acc, val) => acc + val, 0) + downSamplingPlots.uniform.hybridSearch.reduce((acc, val) => acc + val, 0) + downSamplingPlots.nonUniform.interpolation.reduce((acc, val) => acc + val, 0) + downSamplingPlots.nonUniform.hybridSearch.reduce((acc, val) => acc + val, 0)
    sessionStorage.setItem("downSampling", JSON.stringify(downSamplingPlots))
    sessionStorage.setItem("min", min)
    sessionStorage.setItem("total",total)
    sessionStorage.setItem("average", total / 4)

    console.log(downSamplingPlots)
}