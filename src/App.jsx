import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Home from "./pages/Home";
import RunBenchamark from "./pages/RunBenchmark";
import ViewResults from "./pages/ViewResults";
import { interpolationBinarySearch, interpolationFibonacciSearch, interpolationExponentialSearch } from "../src/utils/search-algo";
import { generateData } from "./utils/generateData";
import { performBenchmark } from "./utils/performBenchmark";
import { generateRandomGapsArr } from "./utils/generateData";
import { ProtectedRoute } from "./utils/ProtectedRouter";

function App() {

  // Generated
  const generatedData = {
    uniformArr: [],
    nonUniformArr: []
  }

  for (var i = 0; i < 1e3; i++) {
    generatedData.uniformArr.push(i+1)
    
  }
  generatedData.nonUniformArr = generateRandomGapsArr(1e3,0, 1e3*2)

  console.log("Uniform: ", generatedData.uniformArr)
  console.log("Non Uni: ", generatedData.nonUniformArr)

  const generateDataHandler = (size) => {
    if (size > 1e5) {
      generateData(25e4 - 1e3, generatedData.uniformArr)
      generatedData.nonUniformArr = generateRandomGapsArr(25e4 - 1e3,1e3+1, 25e4 * 2)
    } else {
      generateData(size - 1e3, generatedData.uniformArr)
      generatedData.nonUniformArr = generateRandomGapsArr(size - 1e3,1e3+1, size  * 2)
    }
    
    sessionStorage.setItem("generatedData", JSON.stringify(generatedData))
    sessionStorage.setItem("size", size)
    console.log("Uniform arr: " + generatedData.uniformArr.length)
    console.log("Non Uniform arr: " + generatedData.nonUniformArr.length)
  }

  const results =  {
    uniform: {
      interpolation: { executionTime: [], memoryUsage: [] },
      hybridSearch: { executionTime: [], memoryUsage: [] }
    },
    nonUniform: {
      interpolation: { executionTime: [], memoryUsage: [] },
      hybridSearch: { executionTime: [], memoryUsage: [] }
    }
  }

  const downSamplingPlots = {
    uniform: {
      interpolation: [],
      hybridSearch: []
    },
    nonUniform: {
      interpolation: [],
      hybridSearch: []
    }
  }

  const benchMarkHandler = (attempts, hybridSearch) => {
    switch(hybridSearch) {
      case 'Interpolation-Binary':
        performBenchmark(attempts, interpolationBinarySearch, results, downSamplingPlots)
        console.log("interpolation-binary used");
        sessionStorage.setItem("selectedAlgo", hybridSearch)
        break

      case 'Interpolation-Fibonacci':
        performBenchmark(attempts, interpolationFibonacciSearch, results, downSamplingPlots)
        console.log("interpolation-fibonacci used");
        sessionStorage.setItem("selectedAlgo", hybridSearch)
        break

      case 'Interpolation-Exponential':
        performBenchmark(attempts, interpolationExponentialSearch, results, downSamplingPlots)
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
            <Home generateData={generateDataHandler}/>
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

