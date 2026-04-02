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
    const data = sessionStorage.getItem("generatedData");

    if (!data) {
      // If not present, redirect to home or another page
      return <Navigate to="/" replace />;
    }

    // If data exists, render the child component
    return children;
  }


  var arr = [];
  var timeResults = [
    [], // 0 Interpolation 
    [], // 1 Interpolation-Binary
    [], // 2 Interpolation-Fibonacci
    [] // 3 Interpolation-Exponential
  ];
  
  var downSamplingTimeResults = [
    [], // 0 Interpolation 
    [], // 1 Interpolation-Binary
    [], // 2 Interpolation-Fibonacci
    [] // 3 Interpolation-Exponential
  ];

  const results =  {
    interpolation: { executionTime: [], memoryUsage: [] },
    interpolationBin: { executionTime: [], memoryUsage: [] },
    interpolationFibo: { executionTime: [], memoryUsage: [] },
    interpolationExp: { executionTime: [], memoryUsage: [] }
  }

  const downSamplingPlots = {
    interpolation: [],
    interpolationBin: [],
    interpolationFibo: [],
    interpolationExp: [],
  }

  const generateData = (size) => {
    // Fill data 
    for (var i = 0; i < size; i++) {
      arr.push(i)
    }

    // Save the 
    sessionStorage.setItem("generatedData", JSON.stringify(arr));
  }

  function getRandomInt(min, max) {
    // Make sure min and max are integers
    min = Math.ceil(min);
    max = Math.floor(max);

    // Math.random() returns [0,1), scale and shift to [min, max]
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const performBenchmark = (attempts) => {
    for (var i = 0; i < attempts; i++) {
      var start = performance.now() // Start Time
      var end = performance.now() // End Time
      var plotPoints = Math.floor(attempts / 50) // Used for down sampling attempts / 50 points
      var total = [0,0,0,0] // Gets avereagen for each plot points 0 - interpolation, 1 - inter-bin , 1 - inter-fibo , 1 - inter-exp
      var counter = 1 // Multiplier

      // Baseline
      start = performance.now()
      interpolationSearch(arr,getRandomInt(0,arr.length))
      end = performance.now()
      results.interpolation.executionTime.push(end - start)
      total[0] += (end - start)
      if (i >= plotPoints * counter) {
        downSamplingPlots.interpolation.push(total[0] / plotPoints)
        counter += 1
        total[0] = 0
      }
      
      // Interpolation-Binary
      start = performance.now()
      interpolationBinarySearch(arr,getRandomInt(0,arr.length))
      end = performance.now()
      results.interpolationBin.executionTime.push(end - start)
      total[1] += (end - start)
      if (i >= plotPoints * counter) {
        downSamplingPlots.interpolationBin.push(total[1] / plotPoints)
        counter += 1
        total[1] = 0
      }

      // Interpolation-Fibonacci
      start = performance.now()
      interpolationFibonacciSearch(arr,getRandomInt(0,arr.length))
      end = performance.now()
      results.interpolationFibo.executionTime.push(end - start)
      total[2] += (end - start)
      if (i >= plotPoints * counter) {
        downSamplingPlots.interpolationFibo.push(total[2] / plotPoints)
        counter += 1
        total[2] = 0
      }

      // Interpolation-Exponential
      start = performance.now()
      interpolationExponentialSearch(arr,getRandomInt(0,arr.length))
      end = performance.now()
      results.interpolationExp.executionTime.push(end - start)
      total[3] += (end - start)
      if (i >= plotPoints * counter) {
        downSamplingPlots.interpolationExp.push(total[3] / plotPoints)
        counter += 1
        total[3] = 0
      }
    }
    console.log(results)
  }
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home generateData={generateData}/>} />
        <Route 
          path="/runBenchmark" 
          element={
            <ProtectedRoute>
              <RunBenchamark />
            </ProtectedRoute>  
          } />
        <Route path="/viewResults" element={<ViewResults/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

