import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Home from "./pages/Home";
import RunBenchamark from "./pages/RunBenchmark";
import ViewResults from "./pages/ViewResults";
import { ProtectedRoute } from "./utils/ProtectedRouter";

function App() {

  // Temporarily Removed
  // const results =  {
  //   interpolation: {
  //     uniform: { executionTime: [], memoryUsage: [] },
  //     nonUniform: { executionTime: [], memoryUsage: [] }
  //   },
  //   hybridSearch: {
  //     uniform: { executionTime: [], memoryUsage: [] },
  //     nonUniform: { executionTime: [], memoryUsage: [] }
  //   }
  // }
  
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
              <RunBenchamark  />
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