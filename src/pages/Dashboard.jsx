import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Stack,
  Skeleton,
  Chip,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Diversity3OutlinedIcon from "@mui/icons-material/Diversity3Outlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import CardMembershipOutlinedIcon from "@mui/icons-material/CardMembershipOutlined";
import DesignServicesOutlinedIcon from "@mui/icons-material/DesignServicesOutlined";
import PageHeader from "../components/common/PageHeader";
import StatusChip from "../components/common/StatusChip";
import { clientesApi } from "../api/clientes";
import { casosApi, ESTADOS_CASO } from "../api/casos";
import { solicitudesApi, ESTADOS_SOLICITUD } from "../api/solicitudes";
import { usuariosApi } from "../api/usuarios";
import { planesApi } from "../api/planes";
import { serviciosApi } from "../api/servicios";
import { palette } from "../theme/tokens";

function MetricCard({ label, value, icon: Icon, loading, accent }) {
  return (
    <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, height: "100%" }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Box>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
          {loading ? (
            <Skeleton width={60} height={40} />
          ) : (
            <Typography variant="h4" sx={{ mt: 0.5 }}>
              {value}
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: accent + "22",
            color: accent,
          }}
        >
          <Icon fontSize="small" />
        </Box>
      </Stack>
    </Paper>
  );
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [recentCasos, setRecentCasos] = useState([]);
  const [recentSolicitudes, setRecentSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      clientesApi.list({ page: 1, per_page: 1 }),
      casosApi.list({ page: 1, per_page: 5 }),
      solicitudesApi.list({ page: 1, per_page: 5 }),
      usuariosApi.list(),
      planesApi.list(),
      serviciosApi.list(),
    ]).then(
      ([clientesR, casosR, solicitudesR, usuariosR, planesR, serviciosR]) => {
        setMetrics({
          clientes:
            clientesR.status === "fulfilled"
              ? (clientesR.value.meta?.total ?? 0)
              : "—",
          casos:
            casosR.status === "fulfilled"
              ? (casosR.value.meta?.total ?? 0)
              : "—",
          solicitudes:
            solicitudesR.status === "fulfilled"
              ? (solicitudesR.value.meta?.total ?? 0)
              : "—",
          usuarios:
            usuariosR.status === "fulfilled"
              ? (usuariosR.value.data || []).length
              : "—",
          planes:
            planesR.status === "fulfilled"
              ? (planesR.value.data || []).length
              : "—",
          servicios:
            serviciosR.status === "fulfilled"
              ? (serviciosR.value.data || []).length
              : "—",
        });
        if (casosR.status === "fulfilled")
          setRecentCasos(casosR.value.data || []);
        if (solicitudesR.status === "fulfilled")
          setRecentSolicitudes(solicitudesR.value.data || []);
        setLoading(false);
      },
    );
  }, []);

  const casoStatusData = ESTADOS_CASO.map((estado) => ({
    estado: estado.replace(/_/g, " "),
    cantidad: recentCasos.filter((c) => c.estado_caso === estado).length,
  }));

  const solicitudStatusData = ESTADOS_SOLICITUD.map((estado, i) => ({
    name: estado.replace(/_/g, " "),
    value:
      recentSolicitudes.filter((s) => s.estado_solicitud === estado).length ||
      (i === 0 ? 1 : 0),
  })).filter((d) => d.value > 0);

  const pieColors = [
    palette.amber500,
    palette.teal500,
    "#3D6FD9",
    palette.coral500,
    palette.slate500,
  ];

  return (
    <Box>
      <PageHeader
        title="Dashboard"
        description="Resumen general de la operación de TechSolutions."
      />

      <Grid container spacing={2.5}>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <MetricCard
            label="Clientes"
            value={metrics?.clientes}
            icon={Diversity3OutlinedIcon}
            loading={loading}
            accent={palette.amber500}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <MetricCard
            label="Casos"
            value={metrics?.casos}
            icon={WorkOutlineOutlinedIcon}
            loading={loading}
            accent={palette.teal500}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <MetricCard
            label="Solicitudes"
            value={metrics?.solicitudes}
            icon={AssignmentOutlinedIcon}
            loading={loading}
            accent="#3D6FD9"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <MetricCard
            label="Usuarios"
            value={metrics?.usuarios}
            icon={GroupOutlinedIcon}
            loading={loading}
            accent={palette.coral500}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <MetricCard
            label="Planes"
            value={metrics?.planes}
            icon={CardMembershipOutlinedIcon}
            loading={loading}
            accent={palette.amber600}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <MetricCard
            label="Servicios"
            value={metrics?.servicios}
            icon={DesignServicesOutlinedIcon}
            loading={loading}
            accent={palette.slate500}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
        <Grid item xs={12} md={7}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, height: 360 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
              Casos recientes por estado
            </Typography>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={casoStatusData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="estado" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar
                  dataKey="cantidad"
                  fill={palette.amber500}
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={5}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, height: 360 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
              Solicitudes recientes por estado
            </Typography>
            {solicitudStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="85%">
                <PieChart>
                  <Pie
                    data={solicitudStatusData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={90}
                  >
                    {solicitudStatusData.map((_, i) => (
                      <Cell key={i} fill={pieColors[i % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ py: 6, textAlign: "center" }}
              >
                Sin datos recientes.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
              Actividad reciente — Casos
            </Typography>
            <Stack spacing={1.5}>
              {recentCasos.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  No hay casos recientes.
                </Typography>
              )}
              {recentCasos.map((c) => (
                <Stack
                  key={c.caso_id}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="body2">Caso #{c.caso_id}</Typography>
                  <StatusChip value={c.estado_caso} />
                </Stack>
              ))}
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
              Actividad reciente — Solicitudes
            </Typography>
            <Stack spacing={1.5}>
              {recentSolicitudes.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  No hay solicitudes recientes.
                </Typography>
              )}
              {recentSolicitudes.map((s) => (
                <Stack
                  key={s.solicitud_id}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="body2">
                    Solicitud #{s.solicitud_id}
                  </Typography>
                  <StatusChip value={s.estado_solicitud} />
                </Stack>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
