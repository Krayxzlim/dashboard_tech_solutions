import { useState } from "react";
import { Box, Button, IconButton, Stack, Tooltip, MenuItem, TextField, Grid } from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useSnackbar } from "notistack";
import PageHeader from "../components/common/PageHeader";
import DataTable from "../components/common/DataTable";
import FormDialog from "../components/common/FormDialog";
import StatusChip from "../components/common/StatusChip";
import { usePaginatedResource } from "../hooks/usePaginatedResource";
import { casosApi, ESTADOS_CASO } from "../api/casos";

export default function Casos() {
  const { enqueueSnackbar } = useSnackbar();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [estadoFilter, setEstadoFilter] = useState("");
  const [consultorFilter, setConsultorFilter] = useState("");

  const { rows, meta, status, error, reload } = usePaginatedResource(casosApi.list, {
    page,
    per_page: perPage,
    estado_caso: estadoFilter || undefined,
    consultor_id: consultorFilter || undefined,
  });

  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  const createFields = [
    { name: "solicitud_id", label: "ID de solicitud", type: "number", required: true },
    { name: "cliente_id", label: "ID de cliente", type: "number", required: true },
    { name: "consultor_id", label: "ID de consultor", type: "number", required: true },
  ];

  const editFields = [
    {
      name: "estado_caso",
      label: "Estado",
      type: "select",
      required: true,
      options: ESTADOS_CASO.map((e) => ({ value: e, label: e.replace(/_/g, " ") })),
    },
    { name: "horas_trabajadas", label: "Horas trabajadas", type: "number" },
    { name: "notas_internas", label: "Notas internas", type: "textarea" },
  ];

  const handleCreate = async (values) => {
    setLoading(true);
    setFormError(null);
    try {
      await casosApi.create({
        solicitud_id: Number(values.solicitud_id),
        cliente_id: Number(values.cliente_id),
        consultor_id: Number(values.consultor_id),
      });
      enqueueSnackbar("Caso asignado", { variant: "success" });
      setCreateOpen(false);
      reload();
    } catch (err) {
      setFormError(err.friendlyMessage || "No se pudo asignar el caso.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (values) => {
    setLoading(true);
    setFormError(null);
    try {
      await casosApi.update(editing.caso_id, {
        estado_caso: values.estado_caso,
        horas_trabajadas: values.horas_trabajadas ? Number(values.horas_trabajadas) : undefined,
        notas_internas: values.notas_internas || undefined,
      });
      enqueueSnackbar("Caso actualizado", { variant: "success" });
      setEditing(null);
      reload();
    } catch (err) {
      setFormError(err.friendlyMessage || "No se pudo actualizar el caso.");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: "caso_id", label: "ID", render: (r) => `#${r.caso_id}` },
    { key: "cliente", label: "Cliente", render: (r) => `${r.primer_nombre ?? ""} ${r.apellido ?? ""}`.trim() || `#${r.cliente_id}` },
    { key: "consultor_id", label: "Consultor", render: (r) => `#${r.consultor_id}` },
    { key: "estado_caso", label: "Estado", render: (r) => <StatusChip value={r.estado_caso} /> },
    { key: "horas_trabajadas", label: "Horas", align: "right", render: (r) => r.horas_trabajadas ?? "—" },
    {
      key: "actions",
      label: "Acciones",
      align: "right",
      render: (r) => (
        <Tooltip title="Actualizar estado">
          <IconButton
            size="small"
            onClick={() => {
              setEditing(r);
              setFormError(null);
            }}
          >
            <EditOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Casos"
        description="Casos asignados a consultores, con seguimiento de horas y notas internas."
        breadcrumbs={[{ label: "Casos" }]}
        action={
          <Button variant="contained" startIcon={<AddOutlinedIcon />} onClick={() => { setCreateOpen(true); setFormError(null); }}>
            Asignar caso
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
            {ESTADOS_CASO.map((e) => (
              <MenuItem key={e} value={e}>{e.replace(/_/g, " ")}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Filtrar por ID de consultor"
            size="small"
            fullWidth
            type="number"
            value={consultorFilter}
            onChange={(e) => { setConsultorFilter(e.target.value); setPage(1); }}
          />
        </Grid>
      </Grid>

      <DataTable
        columns={columns}
        rows={rows}
        status={status}
        error={error}
        meta={meta}
        rowKey="caso_id"
        onPageChange={setPage}
        onPerPageChange={(n) => { setPerPage(n); setPage(1); }}
        onRetry={reload}
        emptyTitle="No hay casos"
        emptyDescription="Los casos asignados a consultores van a aparecer acá."
        emptyAction={{ label: "Asignar caso", onClick: () => setCreateOpen(true) }}
      />

      <FormDialog
        open={createOpen}
        title="Asignar caso"
        fields={createFields}
        onSubmit={handleCreate}
        onClose={() => setCreateOpen(false)}
        loading={loading}
        serverError={formError}
        submitLabel="Asignar"
      />

      <FormDialog
        open={Boolean(editing)}
        title={`Actualizar caso #${editing?.caso_id ?? ""}`}
        fields={editFields}
        initialValues={{
          estado_caso: editing?.estado_caso,
          horas_trabajadas: editing?.horas_trabajadas ?? "",
          notas_internas: editing?.notas_internas ?? "",
        }}
        onSubmit={handleUpdate}
        onClose={() => setEditing(null)}
        loading={loading}
        serverError={formError}
        submitLabel="Guardar cambios"
      />
    </Box>
  );
}
