import { useState } from "react";
import { Box, Button, IconButton, Tooltip } from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useSnackbar } from "notistack";
import PageHeader from "../components/common/PageHeader";
import DataTable from "../components/common/DataTable";
import FormDialog from "../components/common/FormDialog";
import StatusChip from "../components/common/StatusChip";
import { usePaginatedResource } from "../hooks/usePaginatedResource";
import { planesApi } from "../api/planes";

const baseFields = [
  {
    name: "nombre_plan",
    label: "Nombre del plan",
    type: "select",
    required: true,
    options: [
      { value: "Básico", label: "Básico" },
      { value: "Profesional", label: "Profesional" },
      { value: "Premium", label: "Premium" },
    ],
  },
  { name: "precio", label: "Precio", type: "number", required: true },
  { name: "creditos", label: "Créditos", type: "number", required: true },
  { name: "tiempo_respuesta", label: "Tiempo de respuesta (hs)", type: "number", required: true },
];

const editExtraFields = [
  {
    name: "estado_plan",
    label: "Estado",
    type: "select",
    required: true,
    options: [
      { value: "activo", label: "Activo" },
      { value: "discontinuado", label: "Discontinuado" },
    ],
  },
];

export default function Planes() {
  const { enqueueSnackbar } = useSnackbar();
  const { rows, status, error, reload } = usePaginatedResource(planesApi.list, {});

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values) => {
    setLoading(true);
    setFormError(null);
    const payload = {
      nombre_plan: values.nombre_plan,
      precio: Number(values.precio),
      creditos: Number(values.creditos),
      tiempo_respuesta: Number(values.tiempo_respuesta),
    };
    try {
      if (editing) {
        await planesApi.update(editing.plan_id, { ...payload, estado_plan: values.estado_plan });
        enqueueSnackbar("Plan actualizado", { variant: "success" });
      } else {
        await planesApi.create(payload);
        enqueueSnackbar("Plan creado", { variant: "success" });
      }
      setFormOpen(false);
      reload();
    } catch (err) {
      setFormError(err.friendlyMessage || "No se pudo guardar el plan.");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: "plan_id", label: "ID", render: (r) => `#${r.plan_id}` },
    { key: "nombre_plan", label: "Nombre" },
    { key: "precio", label: "Precio", align: "right", render: (r) => `$${Number(r.precio).toLocaleString("es-AR")}` },
    { key: "creditos", label: "Créditos", align: "right" },
    { key: "tiempo_respuesta", label: "T. respuesta (hs)", align: "right" },
    { key: "estado_plan", label: "Estado", render: (r) => <StatusChip value={r.estado_plan} /> },
    {
      key: "actions",
      label: "Acciones",
      align: "right",
      render: (r) => (
        <Tooltip title="Editar plan">
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
        title="Planes"
        description="Planes de suscripción disponibles para los clientes."
        breadcrumbs={[{ label: "Planes" }]}
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
            Nuevo plan
          </Button>
        }
      />

      <DataTable
        columns={columns}
        rows={rows}
        status={status}
        error={error}
        meta={null}
        rowKey="plan_id"
        onRetry={reload}
        emptyTitle="No hay planes"
        emptyDescription="Creá el primer plan para que los clientes puedan suscribirse."
        emptyAction={{ label: "Nuevo plan", onClick: () => setFormOpen(true) }}
      />

      <FormDialog
        open={formOpen}
        title={editing ? `Editar plan #${editing.plan_id}` : "Nuevo plan"}
        fields={editing ? [...baseFields, ...editExtraFields] : baseFields}
        initialValues={
          editing
            ? {
                nombre_plan: editing.nombre_plan,
                precio: editing.precio,
                creditos: editing.creditos,
                tiempo_respuesta: editing.tiempo_respuesta,
                estado_plan: editing.estado_plan,
              }
            : {}
        }
        onSubmit={handleSubmit}
        onClose={() => setFormOpen(false)}
        loading={loading}
        serverError={formError}
        submitLabel={editing ? "Guardar cambios" : "Crear plan"}
      />
    </Box>
  );
}
