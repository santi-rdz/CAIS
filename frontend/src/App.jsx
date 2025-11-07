import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import AppLayout from "./ui/AppLayout";
import Dashboard from "./pages/Dashboard";
import Pacientes from "./pages/Pacientes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />

          <Route index element={<Navigate to="pacientes" />} />
          <Route path="/pacientes" element={<Pacientes />} />
        </Route>
        <Route path="login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
