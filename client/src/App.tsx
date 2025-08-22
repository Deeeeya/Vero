import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import Projects from "./pages/dashboard/Projects";
import ProjectDetails from "./pages/dashboard/ProjectDetails";
import Users from "./pages/dashboard/Users";
import UserSignup from "./pages/user-auth/UserSignup";
import UserSignin from "./pages/user-auth/UserSignin";

function App() {
  <BrowserRouter>
    <div className="App">
      <Routes>
        {/* Admin Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Admin Dashboard Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/projects" element={<Projects />} />
        <Route path="/dashboard/projects/:id" element={<ProjectDetails />} />
        <Route path="/dashboard/projects/:id/users" element={<Users />} />
        {/* End-User Authentication Rooutes */}
        <Route path="/auth/signup" element={<UserSignup />} />
        <Route path="/auth/signin" element={<UserSignin />} />
        {/* Default Route */}
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </div>
  </BrowserRouter>;
}

export default App;
