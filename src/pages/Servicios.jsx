import { useState } from "react";
import { Box, Button, IconButton, Tooltip, MenuItem, TextField, Grid, Chip } from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useSnackbar } from "notistack";
import PageHeader from "../components/common/PageHeader";
import DataTable from "../components/common/DataTable";
import FormDialog from "../components/common/FormDialog";
import StatusChip from "../components/common/StatusChip";
import { usePaginatedResource } from "../hooks/usePaginatedResource";
import { serviciosApi, AREAS_SERVICIO } from "../api/servicios";

const areaOptions = AREAS_SERVICIO.map((a) => ({ value: a, label: a.replace(/_/g, " ") }));

const formFields = (includeEstado) => [
  { name: "nombre_servicio", label: "Nombre del servicio", required: true },
  { name: "descripcion", label: "Descripción", type: "textarea", required: true },
  { name: "area", label: "Área", type: "select", required: true, options: areaOptions },
  ...(includeEstado
    ? [
        {
          name: "estado_servicio",
          label: "Estado",
          type: "select",
          required: true,
          options: [
            { value: "activo", label: "Activo" },
            { value: "inactivo", label: "Inactivo" },
          ],
        },
      ]
    : []),
];

export default function Servicios() {
  const { enqueueSnackbar } = useSnackbar();
  const [areaFilter, setAreaFilter] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");

  const { rows, status, error, reload } = usePaginatedResource(serviciosApi.list, {
    area: areaFilter || undefined,
    estado: estadoFilter || undefined,
  });

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values) => {
    setLoading(true);
    setFormError(null);
    try {
      if (editing) {
        await serviciosApi.update(editing.servicio_id, values);
        enqueueSnackbar("Servicio actualizado", { variant: "success" });
      } else {
        await serviciosApi.create(values);
        enqueueSnackbar("Servicio creado", { variant: "success" });
      }
      setFormOpen(false);
      reload();
    } catch (err) {
      setFormError(err.friendlyMessage || "No se pudo guardar el servicio.");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: "servicio_id", label: "ID", render: (r) => `#${r.servicio_id}` },
    { key: "nombre_servicio", label: "Nombre" },
    { key: "area", label: "Área", render: (r) => <Chip size="small" label={r.area?.replace(/_/g, " ")} variant="outlined" sx={{ textTransform: "capitalize" }} /> },
    { key: "estado_servicio", label: "Estado", render: (r) => <StatusChip value={r.estado_servicio} /> },
    {
      key: "actions",
      label: "Acciones",
      align: "right",
      render: (r) => (
        <Tooltip title="Editar servicio">
          <IconButton
            size="small"
            onClick={() => {
              setEditing(r);
              setFormError(null);
              setFormOpen(true);
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
        title="Servicios"
        description="Catálogo de servicios ofrecidos, agrupados por área."
        breadcrumbs={[{ label: "Servicios" }]}
        action={
          <Button
            variant="contained"
            startIcon={<AddOutlinedIcon />}
            onClick={() => {
              setEditing(null);
              setFormError(null);
              setFormOpen(true);
            }}
          >
            Nuevo servicio
          </Button>
        }
      />

      <Grid container spacing={2} sx={{ mb: 2, maxWidth: 560 }}>
        <Grid item xs={6}>
          <TextField select label="Filtrar por área" size="small" fullWidth value={areaFilter} onChange={(e) => setAreaFilter(e.target.value)}>
            <MenuItem value="">Todas</MenuItem>
            {areaOptions.map((a) => (
              <MenuItem key={a.value} value={a.value}>{a.label}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={6}>
          <TextField select label="Filtrar por estado" size="small" fullWidth value={estadoFilter} onChange={(e) => setEstadoFilter(e.target.value)}>
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="activo">Activo</MenuItem>
            <MenuItem value="inactivo">Inactivo</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      <DataTable
        columns={columns}
        rows={rows}
        status={status}
        error={error}
        meta={null}
        rowKey="servicio_id"
        onRetry={reload}
        emptyTitle="No hay servicios"
        emptyDescription="Agregá servicios para que puedan asociarse a planes y solicitudes."
        emptyAction={{ label: "Nuevo servicio", onClick: () => setFormOpen(true) }}
      />

      <FormDialog
        open={formOpen}
        title={editing ? `Editar servicio #${editing.servicio_id}` : "Nuevo servicio"}
        fields={formFields(Boolean(editing))}
        initialValues={
          editing
            ? {
                nombre_servicio: editing.nombre_servicio,
                descripcion: editing.descripcion,
                area: editing.area,
                estado_servicio: editing.estado_servicio,
              }
            : {}
        }
        onSubmit={handleSubmit}
        onClose={() => setFormOpen(false)}
        loading={loading}
        serverError={formError}
        submitLabel={editing ? "Guardar cambios" : "Crear servicio"}
      />
    </Box>
  );
}
