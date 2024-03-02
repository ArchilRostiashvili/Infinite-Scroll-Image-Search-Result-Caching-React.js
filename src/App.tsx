import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./components/home";
import History from "./components/history";

function App() {
  return (
    <main>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </main>
  );
}

export default App;
