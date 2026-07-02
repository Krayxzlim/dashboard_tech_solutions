import { useState } from "react";
import { Box, Button, IconButton, Tooltip, MenuItem, TextField, Grid } from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import SyncAltOutlinedIcon from "@mui/icons-material/SyncAltOutlined";
import { useSnackbar } from "notistack";
import PageHeader from "../components/common/PageHeader";
import DataTable from "../components/common/DataTable";
import FormDialog from "../components/common/FormDialog";
import StatusChip from "../components/common/StatusChip";
import { usePaginatedResource } from "../hooks/usePaginatedResource";
import { solicitudesApi, ESTADOS_SOLICITUD } from "../api/solicitudes";

export default function Solicitudes() {
  const { enqueueSnackbar } = useSnackbar();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [estadoFilter, setEstadoFilter] = useState("");
  const [clienteFilter, setClienteFilter] = useState("");

  const { rows, meta, status, error, reload } = usePaginatedResource(solicitudesApi.list, {
    page,
    per_page: perPage,
    estado_solicitud: estadoFilter || undefined,
    cliente_id: clienteFilter || undefined,
  });

  const [createOpen, setCreateOpen] = useState(false);
  const [statusTarget, setStatusTarget] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  const createFields = [
    { name: "cliente_id", label: "ID de cliente", type: "number", required: true },
    { name: "servicio_id", label: "ID de servicio", type: "number", required: true },
    { name: "descripcion", label: "Descripción", type: "textarea", required: true },
    {
      name: "prioridad",
      label: "Prioridad",
      type: "select",
      options: [
        { value: "baja", label: "Baja" },
        { value: "media", label: "Media" },
        { value: "alta", label: "Alta" },
      ],
    },
  ];

  const statusFields = [
    {
      name: "estado_solicitud",
      label: "Nuevo estado",
      type: "select",
      required: true,
      options: ESTADOS_SOLICITUD.map((e) => ({ value: e, label: e.replace(/_/g, " ") })),
    },
  ];

  const handleCreate = async (values) => {
    setLoading(true);
    setFormError(null);
    try {
      await solicitudesApi.create({
        cliente_id: Number(values.cliente_id),
        servicio_id: Number(values.servicio_id),
        descripcion: values.descripcion,
        prioridad: values.prioridad || "media",
      });
      enqueueSnackbar("Solicitud creada", { variant: "success" });
      setCreateOpen(false);
      reload();
    } catch (err) {
      setFormError(err.friendlyMessage || "No se pudo crear la solicitud.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (values) => {
    setLoading(true);
    setFormError(null);
    try {
      await solicitudesApi.updateEstado(statusTarget.solicitud_id, values.estado_solicitud);
      enqueueSnackbar("Estado actualizado", { variant: "success" });
      setStatusTarget(null);
      reload();
    } catch (err) {
      setFormError(err.friendlyMessage || "No se pudo actualizar el estado.");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: "solicitud_id", label: "ID", render: (r) => `#${r.solicitud_id}` },
    { key: "cliente_id", label: "Cliente", render: (r) => `#${r.cliente_id}` },
    { key: "servicio_id", label: "Servicio", render: (r) => `#${r.servicio_id}` },
    { key: "prioridad", label: "Prioridad", render: (r) => <span style={{ textTransform: "capitalize" }}>{r.prioridad}</span> },
    { key: "estado_solicitud", label: "Estado", render: (r) => <StatusChip value={r.estado_solicitud} /> },
    {
      key: "actions",
      label: "Acciones",
      align: "right",
      render: (r) => (
        <Tooltip title="Cambiar estado">
          <IconButton size="small" onClick={() => { setStatusTarget(r); setFormError(null); }}>
            <SyncAltOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Solicitudes"
        description="Solicitudes de servicio realizadas por los clientes."
        breadcrumbs={[{ label: "Solicitudes" }]}
        action={
          <Button variant="contained" startIcon={<AddOutlinedIcon />} onClick={() => { setCreateOpen(true); setFormError(null); }}>
            Nueva solicitud
          </Button>
        }
      />

      <Grid container spacing={2} sx={{ mb: 2, maxWidth: 560 }}>
        <Grid item xs={6}>
          <TextField
            select
            label="Filtrar por estado"
            size="small"
            fullWidth
            value={estadoFilter}
            onChange={(e) => { setEstadoFilter(e.target.value); setPage(1); }}
          >
            <MenuItem value="">Todos</MenuItem>
            {ESTADOS_SOLICITUD.map((e) => (
              <MenuItem key={e} value={e}>{e.replace(/_/g, " ")}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Filtrar por ID de cliente"
            size="small"
            fullWidth
            type="number"
            value={clienteFilter}
            onChange={(e) => { setClienteFilter(e.target.value); setPage(1); }}
          />
        </Grid>
      </Grid>

      <DataTable
        columns={columns}
        rows={rows}
        status={status}
        error={error}
        meta={meta}
        rowKey="solicitud_id"
        onPageChange={setPage}
        onPerPageChange={(n) => { setPerPage(n); setPage(1); }}
        onRetry={reload}
        emptyTitle="No hay solicitudes"
        emptyDescription="Las solicitudes que realicen los clientes van a aparecer acá."
        emptyAction={{ label: "Nueva solicitud", onClick: () => setCreateOpen(true) }}
      />

      <FormDialog
        open={createOpen}
        title="Nueva solicitud"
        fields={createFields}
        initialValues={{ prioridad: "media" }}
        onSubmit={handleCreate}
        onClose={() => setCreateOpen(false)}
        loading={loading}
        serverError={formError}
        submitLabel="Crear solicitud"
      />

      <FormDialog
        open={Boolean(statusTarget)}
        title={`Cambiar estado — solicitud #${statusTarget?.solicitud_id ?? ""}`}
        fields={statusFields}
        initialValues={{ estado_solicitud: statusTarget?.estado_solicitud }}
        onSubmit={handleStatusChange}
        onClose={() => setStatusTarget(null)}
        loading={loading}
        serverError={formError}
        submitLabel="Actualizar estado"
      />
    </Box>
  );
}
