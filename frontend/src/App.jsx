import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Auth";
import AppLayout from "./ui/AppLayout";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import LoginForm from "@features/authenticaction/LoginForm";
import Users from "./pages/Users";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="usuarios" element={<Users />} />
        </Route>
        <Route element={<Auth />}>
          <Route path="login" element={<LoginForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
