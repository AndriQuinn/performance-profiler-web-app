import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Home from "./pages/Home";
import RunBenchamark from "./pages/RunBenchmark";
import ViewResults from "./pages/ViewResults";
import { Navigate } from "react-router-dom";
import { interpolationSearch, interpolationBinarySearch, interpolationFibonacciSearch, interpolationExponentialSearch } from "../src/utils/search-algo";

function App() {

  function ProtectedRoute({ children }) {
    // Check sessionStorage for required data 
    const data = sessionStorage.getItem("size");

    if (!data) {
      // If not present, redirect to home or another page
      return <Navigate to="/" replace />;
    }

    // If data exists, render the child component
    return children;
  }

  // Generated
  var uniformArr = [];
  var nonUniformArr = [];

  const results =  {
    uniform: {
      interpolation: { executionTime: [], memoryUsage: [] },
      interpolationBin: { executionTime: [], memoryUsage: [] },
      interpolationFibo: { executionTime: [], memoryUsage: [] },
      interpolationExp: { executionTime: [], memoryUsage: [] }
    },
    nonUniform: {
      interpolation: { executionTime: [], memoryUsage: [] },
      interpolationBin: { executionTime: [], memoryUsage: [] },
      interpolationFibo: { executionTime: [], memoryUsage: [] },
      interpolationExp: { executionTime: [], memoryUsage: [] }
    }
  }

  const downSamplingPlots = {
    uniform: {
      interpolation: [],
      interpolationBin: [],
      interpolationFibo: [],
      interpolationExp: [],
    },
    nonUniform: {
      interpolation: [],
      interpolationBin: [],
      interpolationFibo: [],
      interpolationExp: [],
    }
  }

  const generateData = (size,arr) => {
    // Fill data 
    for (var i = 0; i < size; i++) {
      arr.push(i)
    }
  }

  const generateSkewedData = (size, arr, max = 100, skew = 2) => {
    for (let i = 0; i < size; i++) {
      let t = i / (size - 1);          // goes from 0 to 1
      let value = Math.pow(t, skew) * max; // skew curve
      arr.push(value);
    }
  };

  function getRandomInt(min, max) {
    // Make sure min and max are integers
    min = Math.ceil(min);
    max = Math.floor(max);

    // Math.random() returns [0,1), scale and shift to [min, max]
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const performBenchmark = (attempts) => {

    var counter = [1,1,1,1] // Multiplier
    var plotPoints = Math.floor(attempts / 50)
    var totalUni = [0,0,0,0] // Gets avereagen for each plot points 0 - interpolation, 1 - inter-bin , 1 - inter-fibo , 1 - inter-exp
    var totalNonUni = [0,0,0,0] // Gets avereagen for each plot points 0 - interpolation, 1 - inter-bin , 1 - inter-fibo , 1 - inter-exp
    
    for (var i = 0; i <= attempts; i++) {
      var start = performance.now() // Start Time
      var end = performance.now() // End Time

      generateData(Number(sessionStorage.getItem("size")), uniformArr)
      generateSkewedData(Number(sessionStorage.getItem("size")), nonUniformArr, Number(sessionStorage.getItem("size")))

      // Baseline
      start = performance.now()
      interpolationSearch(uniformArr,getRandomInt(0,uniformArr.length))
      end = performance.now()
      results.uniform.interpolation.executionTime.push(end - start)
      totalUni[0] += (end - start)

      start = performance.now()
      interpolationSearch(nonUniformArr,getRandomInt(0,nonUniformArr.length))
      end = performance.now()
      results.nonUniform.interpolation.executionTime.push(end - start)
      totalNonUni[0] += (end-start)

      if (i >= plotPoints * counter[0]) {
        downSamplingPlots.uniform.interpolation.push(totalUni[0] / plotPoints)
        downSamplingPlots.nonUniform.interpolation.push(totalNonUni[0] / plotPoints)
        counter[0] += 1
        totalUni[0] = 0
        totalNonUni[0] = 0
      }
      
      // Interpolation-Binary
      start = performance.now()
      interpolationBinarySearch(uniformArr,getRandomInt(0,uniformArr.length))
      end = performance.now()
      results.uniform.interpolationBin.executionTime.push(end - start)
      totalUni[1] += (end - start)

      start = performance.now()
      interpolationBinarySearch(nonUniformArr,getRandomInt(0,nonUniformArr.length))
      end = performance.now()
      results.nonUniform.interpolationBin.executionTime.push(end - start)
      totalNonUni[1] += (end - start)

      if (i >= plotPoints * counter[1] ) {
        downSamplingPlots.uniform.interpolationBin.push(totalUni[1] / plotPoints)
        downSamplingPlots.nonUniform.interpolationBin.push(totalNonUni[1] / plotPoints)
        counter[1] += 1
        totalUni[1] = 0
        totalNonUni[1] = 0
      }

      // Interpolation-Fibonacci
      start = performance.now()
      interpolationFibonacciSearch(uniformArr,getRandomInt(0,uniformArr.length))
      end = performance.now()
      results.uniform.interpolationFibo.executionTime.push(end - start)
      totalUni[2] += (end - start)

      start = performance.now()
      interpolationFibonacciSearch(nonUniformArr,getRandomInt(0,nonUniformArr.length))
      end = performance.now()
      results.nonUniform.interpolationFibo.executionTime.push(end - start)
      totalNonUni[2] += (end - start)


      if (i >= plotPoints * counter[2]) {
        downSamplingPlots.uniform.interpolationFibo.push(totalUni[2] / plotPoints)
        downSamplingPlots.nonUniform.interpolationFibo.push(totalNonUni[2] / plotPoints)
        counter[2] += 1
        totalUni[2] = 0
        totalNonUni[2] = 0
      }

      // Interpolation-Exponential
      start = performance.now()
      interpolationExponentialSearch(uniformArr,getRandomInt(0,uniformArr.length))
      end = performance.now()
      results.uniform.interpolationExp.executionTime.push(end - start)
      totalUni[3] += (end - start)

      start = performance.now()
      interpolationExponentialSearch(nonUniformArr,getRandomInt(0,nonUniformArr.length))
      end = performance.now()
      results.nonUniform.interpolationExp.executionTime.push(end - start)
      totalNonUni[3] += (end - start)

      if (i >= plotPoints * counter[3]) {
        downSamplingPlots.uniform.interpolationExp.push(totalUni[3] / plotPoints)
        downSamplingPlots.nonUniform.interpolationExp.push(totalNonUni[3] / plotPoints)
        counter[3] += 1
        totalUni[3] = 0
        totalNonUni[3] = 0
      }
    }
    console.log(downSamplingPlots)
  }
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route 
          path="/runBenchmark" 
          element={
            <ProtectedRoute>
              <RunBenchamark performBenchmark={performBenchmark} />
            </ProtectedRoute>  
          } />
        <Route path="/viewResults" element={<ViewResults/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

