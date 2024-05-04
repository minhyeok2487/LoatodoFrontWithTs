import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomeIndex from "./pages/Home/HomeIndex";
import TodoIndex from "./pages/Todo/TodoIndex";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<HomeIndex />} />
        <Route path="/todo" element={<TodoIndex />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
