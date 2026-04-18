import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Home from "./pages/Home";
import RunBenchamark from "./pages/RunBenchmark";
import ViewResults from "./pages/ViewResults";
import { ProtectedRoute } from "./utils/ProtectedRouter";
import { useData } from "./hooks/useData";

function App() {

  const { datasetArr,benchmarkResult } = useData()
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <Home /> } />
        <Route path="/runBenchmark" 
          element={
            <ProtectedRoute routeKey={datasetArr}> {/* Check key before navigate */}
              <RunBenchamark  />
            </ProtectedRoute>  
          } />
        <Route 
          path="/viewResults" 
          element={
            <ProtectedRoute routeKey={benchmarkResult}> {/* Check key before navigate */}
              <ViewResults/>
            </ProtectedRoute>
          } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
