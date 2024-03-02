import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./components/home";
import History from "./components/history";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
