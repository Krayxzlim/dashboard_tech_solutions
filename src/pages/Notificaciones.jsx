import { useState } from "react";
import { Box, Button, IconButton, Tooltip, MenuItem, TextField, Grid } from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DoneAllOutlinedIcon from "@mui/icons-material/DoneAllOutlined";
import { useSnackbar } from "notistack";
import PageHeader from "../components/common/PageHeader";
import DataTable from "../components/common/DataTable";
import FormDialog from "../components/common/FormDialog";
import { usePaginatedResource } from "../hooks/usePaginatedResource";
import { notificacionesApi } from "../api/notificaciones";
import { useAuth } from "../context/AuthContext";

export default function Notificaciones() {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [leidaFilter, setLeidaFilter] = useState("");

  const { rows, meta, status, error, reload } = usePaginatedResource(notificacionesApi.list, {
    usuario_id: user?.usuario_id,
    page,
    per_page: perPage,
    leida: leidaFilter === "" ? undefined : leidaFilter === "true",
  });

  const [createOpen, setCreateOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [markingId, setMarkingId] = useState(null);

  const createFields = [
    { name: "usuario_id", label: "ID de usuario destinatario", type: "number", required: true },
    { name: "tipo", label: "Tipo", required: true, helperText: "Ej: sistema, caso, solicitud" },
    { name: "asunto", label: "Asunto", required: true },
    { name: "contenido", label: "Contenido", type: "textarea", required: true },
  ];

  const handleCreate = async (values) => {
    setLoading(true);
    setFormError(null);
    try {
      await notificacionesApi.create({ ...values, usuario_id: Number(values.usuario_id) });
      enqueueSnackbar("Notificación creada", { variant: "success" });
      setCreateOpen(false);
      reload();
    } catch (err) {
      setFormError(err.friendlyMessage || "No se pudo crear la notificación.");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificacion) => {
    setMarkingId(notificacion.notificacion_id);
    try {
      await notificacionesApi.markAsRead(notificacion.notificacion_id);
      enqueueSnackbar("Marcada como leída", { variant: "success" });
      reload();
    } catch (err) {
      enqueueSnackbar(err.friendlyMessage || "No se pudo marcar como leída.", { variant: "error" });
    } finally {
      setMarkingId(null);
    }
  };

  const columns = [
    { key: "notificacion_id", label: "ID", render: (r) => `#${r.notificacion_id}` },
    { key: "tipo", label: "Tipo" },
    { key: "asunto", label: "Asunto" },
    {
      key: "fecha_creacion",
      label: "Fecha",
      render: (r) => (r.fecha_creacion ? new Date(r.fecha_creacion).toLocaleString("es-AR") : "—"),
    },
    {
      key: "leida",
      label: "Leída",
      render: (r) => (r.leida ? "Sí" : "No"),
    },
    {
      key: "actions",
      label: "Acciones",
      align: "right",
      render: (r) =>
        !r.leida && (
          <Tooltip title="Marcar como leída">
            <IconButton size="small" onClick={() => handleMarkAsRead(r)} disabled={markingId === r.notificacion_id}>
              <DoneAllOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        ),
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Notificaciones"
        description="Notificaciones enviadas a tu usuario."
        breadcrumbs={[{ label: "Notificaciones" }]}
        action={
          <Button variant="contained" startIcon={<AddOutlinedIcon />} onClick={() => { setCreateOpen(true); setFormError(null); }}>
            Nueva notificación
          </Button>
        }
      />

      <Grid container spacing={2} sx={{ mb: 2, maxWidth: 300 }}>
        <Grid item xs={12}>
          <TextField
            select
            label="Filtrar por estado"
            size="small"
            fullWidth
            value={leidaFilter}
            onChange={(e) => { setLeidaFilter(e.target.value); setPage(1); }}
          >
            <MenuItem value="">Todas</MenuItem>
            <MenuItem value="false">No leídas</MenuItem>
            <MenuItem value="true">Leídas</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      <DataTable
        columns={columns}
        rows={rows}
        status={status}
        error={error}
        meta={meta}
        rowKey="notificacion_id"
        onPageChange={setPage}
        onPerPageChange={(n) => { setPerPage(n); setPage(1); }}
        onRetry={reload}
        emptyTitle="No hay notificaciones"
        emptyDescription="Cuando recibas notificaciones del sistema, van a aparecer acá."
      />

      <FormDialog
        open={createOpen}
        title="Nueva notificación"
        fields={createFields}
        onSubmit={handleCreate}
        onClose={() => setCreateOpen(false)}
        loading={loading}
        serverError={formError}
        submitLabel="Enviar"
      />
    </Box>
  );
}
