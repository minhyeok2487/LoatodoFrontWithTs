import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomeIndex from "./pages/Home/HomeIndex";
import TodoIndex from "./pages/Todo/TodoIndex";
import Login from "./pages/auth/Login";
import SocialLogin from "./pages/auth/SocialLogin";
import Logout from "./pages/auth/Logout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<HomeIndex />} />
        <Route path="/login" element={<Login message={""} />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/sociallogin" element={<SocialLogin />} />
        <Route path="/todo" element={<TodoIndex />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
