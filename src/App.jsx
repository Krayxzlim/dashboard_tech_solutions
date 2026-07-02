import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import MainLayout from "./components/layout/MainLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Clientes from "./pages/Clientes";
import Casos from "./pages/Casos";
import Planes from "./pages/Planes";
import Servicios from "./pages/Servicios";
import Solicitudes from "./pages/Solicitudes";
import Usuarios from "./pages/Usuarios";
import Notificaciones from "./pages/Notificaciones";
import Perfil from "./pages/Perfil";
import NotFound from "./pages/NotFound";
import { useAuth } from "./context/AuthContext";

function RedirectIfAuthed({ children }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<RedirectIfAuthed><Login /></RedirectIfAuthed>} />
      <Route path="/register" element={<RedirectIfAuthed><Register /></RedirectIfAuthed>} />

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/casos" element={<Casos />} />
          <Route path="/planes" element={<Planes />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/solicitudes" element={<Solicitudes />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/notificaciones" element={<Notificaciones />} />
          <Route path="/perfil" element={<Perfil />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
