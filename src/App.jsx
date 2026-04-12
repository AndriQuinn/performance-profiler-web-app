import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Home from "./pages/Home";
import RunBenchamark from "./pages/RunBenchmark";
import ViewResults from "./pages/ViewResults";
import { ProtectedRoute } from "./utils/ProtectedRouter";
import { useData } from "./context/DataContext";

function App() {

  const { dataset } = useData()
  
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
            <ProtectedRoute storageKey={"downSampling"}>
              <ViewResults/>
            </ProtectedRoute>
          } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
