import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Home from "./pages/Home";
import RunBenchamark from "./pages/RunBenchmark";
import ViewResults from "./pages/ViewResults";
import { interpolationBinarySearch, interpolationFibonacciSearch, interpolationExponentialSearch } from "../src/utils/search-algo";
import { performBenchmark } from "./utils/performBenchmark";
import { ProtectedRoute } from "./utils/ProtectedRouter";
// import { performMemoryUsage } from "./utils/performMemoryUsage";


function App() {

  const results =  {
    interpolation: {
      uniform: { executionTime: [], memoryUsage: [] },
      nonUniform: { executionTime: [], memoryUsage: [] }
    },
    hybridSearch: {
      uniform: { executionTime: [], memoryUsage: [] },
      nonUniform: { executionTime: [], memoryUsage: [] }
    }
  }

  const downSamplingPlots = {
    interpolation: {
      uniform: [],
      nonUniform: []
    },
    hybridSearch: {
      uniform: [],
      nonUniform: []
    }
  }

  const benchMarkHandler = (attempts, hybridSearch,selectedMetric,generatedData) => {

    // Temporarily Removed - Memory Usage Feature
    // switch(selectedMetric) {

    //   case 'Execution Time':
    //     switch (hybridSearch) {
    //       case 'Interpolation-Binary':
    //           performBenchmark(attempts, interpolationBinarySearch, results, downSamplingPlots,generatedData.uniformArr, generatedData.nonUniformArr)
    //           break
    //       case 'Interpolation-Fibonacci':
    //           performBenchmark(attempts, interpolationFibonacciSearch, results, downSamplingPlots,generatedData.uniformArr, generatedData.nonUniformArr)
    //           break
    //         case 'Interpolation-Exponential':
    //           performBenchmark(attempts, interpolationExponentialSearch, results, downSamplingPlots,generatedData.uniformArr, generatedData.nonUniformArr)
    //           break
    //         default:
    //           console.log("Error no hybrid found!")
    //           break          
    //       }
        
    //     console.log(hybridSearch);
    //     break

    //   case 'Memory Usage':
    //     switch (hybridSearch) {
    //       case 'Interpolation-Binary':
    //           performMemoryUsage(attempts, interpolationBinarySearch, results, downSamplingPlots,generatedData.uniformArr, generatedData.nonUniformArr)
    //           break
    //       case 'Interpolation-Fibonacci':
    //           performMemoryUsage(attempts, interpolationFibonacciSearch, results, downSamplingPlots,generatedData.uniformArr, generatedData.nonUniformArr)
    //           break
    //         case 'Interpolation-Exponential':
    //           performMemoryUsage(attempts, interpolationExponentialSearch, results, downSamplingPlots,generatedData.uniformArr, generatedData.nonUniformArr)
    //           break
    //         default:
    //           console.log("Error no hybrid found!")
    //           break          
    //     }
    //     break
    //   default:
    //     console.log("Metric Not found!")
    // }
    // sessionStorage.setItem("selectedAlgo", hybridSearch)
    // sessionStorage.setItem("Metric", selectedMetric)

    switch(hybridSearch) {
      case 'Interpolation-Binary':
        performBenchmark(attempts, interpolationBinarySearch, results, downSamplingPlots,generatedData.uniformArr, generatedData.nonUniformArr)
        console.log("interpolation-binary used");
        sessionStorage.setItem("selectedAlgo", hybridSearch)
        break

      case 'Interpolation-Fibonacci':
        performBenchmark(attempts, interpolationFibonacciSearch, results, downSamplingPlots,generatedData.uniformArr, generatedData.nonUniformArr)
        console.log("interpolation-fibonacci used");
        sessionStorage.setItem("selectedAlgo", hybridSearch)
        break

      case 'Interpolation-Exponential':
        performBenchmark(attempts, interpolationExponentialSearch, results, downSamplingPlots,generatedData.uniformArr, generatedData.nonUniformArr)
        console.log("interpolation-exponential used");
        sessionStorage.setItem("selectedAlgo", hybridSearch)
        break
      default:
        console.log("Error no hybrid found!")
        break
    }

    sessionStorage.setItem("downSampling", JSON.stringify(downSamplingPlots))
    console.log(downSamplingPlots)
  }
  

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={
            <Home />
          } />
        <Route 
          path="/runBenchmark" 
          element={
            <ProtectedRoute storageKey={"generatedData"}>
              <RunBenchamark performBenchmark={benchMarkHandler} />
            </ProtectedRoute>  
          } />
        <Route 
          path="/viewResults" 
          element={
            <ProtectedRoute storageKey={"downSampling"}>
              <ViewResults/>
            </ProtectedRoute>
          } />
      </Routes>
    </BrowserRouter>
  )
}

export default App

