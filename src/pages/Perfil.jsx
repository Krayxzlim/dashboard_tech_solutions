import { useEffect, useState } from "react";
import { Paper, Stack, Avatar, Typography, Divider, Box } from "@mui/material";
import PageHeader from "../components/common/PageHeader";
import StatusChip from "../components/common/StatusChip";
import ErrorState from "../components/common/ErrorState";
import { Skeleton } from "@mui/material";
import { useAuth } from "../context/AuthContext";

export default function Perfil() {
  const { fetchProfile, user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    setError(null);
    fetchProfile()
      .then(setProfile)
      .catch((err) =>
        setError(err.friendlyMessage || "No se pudo cargar el perfil."),
      )
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  return (
    <Box>
      <PageHeader title="Mi perfil" breadcrumbs={[{ label: "Perfil" }]} />
      <Paper variant="outlined" sx={{ p: 4, borderRadius: 2, maxWidth: 560 }}>
        {loading && <Skeleton variant="rounded" height={140} />}
        {error && <ErrorState message={error} onRetry={load} />}
        {!loading && !error && profile && (
          <Stack spacing={3}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  bgcolor: "primary.main",
                  color: "secondary.main",
                  fontWeight: 700,
                }}
              >
                {profile.email.slice(0, 2).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="h6">{profile.email}</Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  textTransform="capitalize"
                >
                  {profile.rol}
                </Typography>
              </Box>
            </Stack>
            <Divider />
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Estado de cuenta
              </Typography>
              <StatusChip value={profile.estado} />
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Último acceso
              </Typography>
              <Typography variant="body2">
                {profile.ultimo_acceso
                  ? new Date(profile.ultimo_acceso).toLocaleString("es-AR")
                  : "—"}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Cuenta creada
              </Typography>
              <Typography variant="body2">
                {profile.created_at
                  ? new Date(profile.created_at).toLocaleDateString("es-AR")
                  : "—"}
              </Typography>
            </Stack>
          </Stack>
        )}
      </Paper>
    </Box>
  );
}
