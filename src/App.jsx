import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Home from "./pages/Home";
import RunBenchamark from "./pages/RunBenchmark";
import ViewResults from "./pages/ViewResults";
import { Navigate } from "react-router-dom";
import { interpolationSearch, interpolationBinarySearch, interpolationFibonacciSearch, interpolationExponentialSearch } from "../src/utils/search-algo";
import { getRandomInt } from "./utils/getRandomInt";
import { generateData } from "./utils/generateData";
import { performBenchmark } from "./utils/performBenchmark";

function App() {

  function ProtectedRoute({ children }) {
    // Check sessionStorage for required data 
    const data = sessionStorage.getItem("generatedData");

    if (!data) {
      // If not present, redirect to home or another page
      return <Navigate to="/" replace />;
    }

    // If data exists, render the child component
    return children;
  }

  function ProtectedRoute2({ children }) {
    // Check sessionStorage for required data 
    const data = sessionStorage.getItem("downSampling");

    if (!data) {
      // If not present, redirect to home or another page
      return <Navigate to="/" replace />;
    }

    // If data exists, render the child component
    return children;
  }

  const x = []

  for (var i = 0; i < 50; i++) {
    x.push(i+1)
  }

  // Generated
  const generatedData = {
    uniformArr: [],
    nonUniformArr: []
  }

  for (var i = 0; i < 1e3; i++) {
    generatedData.uniformArr.push(i+1)
    let t = i / (1e3 - 1);
    let value = Math.round(0 + Math.pow(t, 2) * (1e3 - 0)); // ✅ starts at min, ends at max, integer
    generatedData.nonUniformArr.push(value);
  }

  const generateDataHandler = (size) => {
    if (size > 1e5) {
      generateData(25e4 - 1e3, generatedData.uniformArr, generatedData.nonUniformArr, 25e4 - 1e3)
    } else {
      generateData(size - 1e3, generatedData.uniformArr, generatedData.nonUniformArr, size - 1e3)
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
            <ProtectedRoute>
              <RunBenchamark performBenchmark={benchMarkHandler} />
            </ProtectedRoute>  
          } />
        <Route 
          path="/viewResults" 
          element={
            <ProtectedRoute2>
              <ViewResults data={[
                x,
                downSamplingPlots.uniform.interpolation,
                downSamplingPlots.uniform.interpolationBin
              ]}/>
            </ProtectedRoute2>
          } />
      </Routes>
    </BrowserRouter>
  )
}

export default App

