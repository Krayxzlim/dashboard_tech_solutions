import { useState } from "react";
import { Box, Paper, TextField, Button, Typography, Alert, Stack, Link as MLink } from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { palette } from "../theme/tokens";
import AuthShell from "./AuthShell";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      const dest = location.state?.from?.pathname || "/";
      navigate(dest, { replace: true });
    } catch (err) {
      setError(err.friendlyMessage || "Credenciales inválidas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Bienvenido de nuevo"
      subtitle="Ingresá para gestionar clientes, casos y solicitudes."
    >
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2.5}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            autoFocus
          />
          <TextField
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
          />
          <Button type="submit" variant="contained" size="large" disabled={loading} sx={{ py: 1.2 }}>
            {loading ? "Ingresando..." : "Ingresar"}
          </Button>
          <Typography variant="body2" textAlign="center" color="text.secondary">
            ¿No tenés cuenta?{" "}
            <MLink component={Link} to="/register" fontWeight={700} sx={{ color: palette.amber600 }}>
              Registrate
            </MLink>
          </Typography>
        </Stack>
      </Box>
    </AuthShell>
  );
}
