import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Home from "./pages/Home";
import RunBenchamark from "./pages/RunBenchmark";
import ViewResults from "./pages/ViewResults";
import { ProtectedRoute } from "./utils/ProtectedRouter";
import { useData } from "./hooks/useData";

function App() {

  const { dataset,benchmarkResult } = useData()
  
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
            <ProtectedRoute routeKey={dataset}>
              <RunBenchamark  />
            </ProtectedRoute>  
          } />
        <Route 
          path="/viewResults" 
          element={
            <ProtectedRoute routeKey={benchmarkResult}>
              <ViewResults/>
            </ProtectedRoute>
          } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
