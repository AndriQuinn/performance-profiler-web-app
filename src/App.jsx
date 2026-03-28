import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Home from "./pages/Home";
import RunBenchamark from "./pages/RunBenchmark";
import ViewResults from "./pages/ViewResults";

function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/runBenchmark" element={<RunBenchamark />} />
        <Route path="/viewResults" element={<ViewResults/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
