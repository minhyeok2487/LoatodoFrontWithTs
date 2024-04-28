import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomeIndex from "./pages/Home/HomeIndex";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<HomeIndex />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
