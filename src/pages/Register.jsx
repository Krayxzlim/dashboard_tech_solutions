import { useEffect, useState } from "react";
import { Box, TextField, Button, Typography, Alert, Stack, MenuItem, Link as MLink, Grid } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { planesApi } from "../api/planes";
import { palette } from "../theme/tokens";
import AuthShell from "./AuthShell";

const initialForm = {
  email: "",
  password: "",
  primer_nombre: "",
  apellido: "",
  dni: "",
  plan_id: "",
};

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [planes, setPlanes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    planesApi
      .list()
      .then((res) => setPlanes(res.data || []))
      .catch(() => setPlanes([]));
  }, []);

  const handleChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register({ ...form, plan_id: Number(form.plan_id) });
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.friendlyMessage || "No se pudo completar el registro.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Creá tu cuenta" subtitle="Tu identidad se valida automáticamente contra VeriCheck.">
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2.5}>
          {error && <Alert severity="error">{error}</Alert>}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField label="Nombre" value={form.primer_nombre} onChange={handleChange("primer_nombre")} required fullWidth size="small" />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Apellido" value={form.apellido} onChange={handleChange("apellido")} required fullWidth size="small" />
            </Grid>
          </Grid>
          <TextField label="DNI" value={form.dni} onChange={handleChange("dni")} required fullWidth size="small" />
          <TextField label="Email" type="email" value={form.email} onChange={handleChange("email")} required fullWidth size="small" />
          <TextField label="Contraseña" type="password" value={form.password} onChange={handleChange("password")} required fullWidth size="small" />
          <TextField
            label="Plan"
            select
            value={form.plan_id}
            onChange={handleChange("plan_id")}
            required
            fullWidth
            size="small"
          >
            {planes.map((plan) => (
              <MenuItem key={plan.plan_id} value={plan.plan_id}>
                {plan.nombre_plan}
              </MenuItem>
            ))}
          </TextField>
          <Button type="submit" variant="contained" size="large" disabled={loading} sx={{ py: 1.2 }}>
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </Button>
          <Typography variant="body2" textAlign="center" color="text.secondary">
            ¿Ya tenés cuenta?{" "}
            <MLink component={Link} to="/login" fontWeight={700} sx={{ color: palette.amber600 }}>
              Ingresá
            </MLink>
          </Typography>
        </Stack>
      </Box>
    </AuthShell>
  );
}
