import { useState } from "react";
import { Box, Button, IconButton, Stack, Tooltip, TextField, InputAdornment } from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import PersonOffOutlinedIcon from "@mui/icons-material/PersonOffOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { useSnackbar } from "notistack";
import PageHeader from "../components/common/PageHeader";
import DataTable from "../components/common/DataTable";
import FormDialog from "../components/common/FormDialog";
import ConfirmDialog from "../components/common/ConfirmDialog";
import StatusChip from "../components/common/StatusChip";
import { usePaginatedResource } from "../hooks/usePaginatedResource";
import { clientesApi } from "../api/clientes";

const clienteFields = (plans) => [
  { name: "primer_nombre", label: "Nombre", required: true },
  { name: "apellido", label: "Apellido", required: true },
  { name: "segundo_nombre", label: "Segundo nombre" },
  { name: "segundo_apellido", label: "Segundo apellido" },
  { name: "dni", label: "DNI", required: true },
  { name: "codigo_pais", label: "Código de país" },
  { name: "codigo_area", label: "Código de área" },
  { name: "numero_telefono", label: "Teléfono" },
  { name: "plan_id", label: "Plan (ID)", required: true, type: "number", helperText: "ID numérico del plan" },
];

export default function Clientes() {
  const { enqueueSnackbar } = useSnackbar();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [search, setSearch] = useState("");

  const { rows, meta, status, error, reload } = usePaginatedResource(clientesApi.list, {
    page,
    per_page: perPage,
  });

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  const [confirmTarget, setConfirmTarget] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const filteredRows = search
    ? rows.filter((c) =>
        `${c.primer_nombre} ${c.apellido} ${c.dni} ${c.email}`.toLowerCase().includes(search.toLowerCase())
      )
    : rows;

  const openCreate = () => {
    setEditing(null);
    setFormError(null);
    setFormOpen(true);
  };

  const openEdit = (cliente) => {
    setEditing(cliente);
    setFormError(null);
    setFormOpen(true);
  };

  const handleSubmit = async (values) => {
    setFormLoading(true);
    setFormError(null);
    try {
      if (editing) {
        await clientesApi.update(editing.cliente_id, values);
        enqueueSnackbar("Cliente actualizado", { variant: "success" });
      } else {
        await clientesApi.create({ ...values, usuario_id: Number(values.usuario_id) });
        enqueueSnackbar("Cliente creado", { variant: "success" });
      }
      setFormOpen(false);
      reload();
    } catch (err) {
      setFormError(err.friendlyMessage || "No se pudo guardar el cliente.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeactivate = async () => {
    setConfirmLoading(true);
    try {
      await clientesApi.deactivate(confirmTarget.cliente_id);
      enqueueSnackbar("Cliente desactivado", { variant: "success" });
      setConfirmTarget(null);
      reload();
    } catch (err) {
      enqueueSnackbar(err.friendlyMessage || "No se pudo desactivar el cliente.", { variant: "error" });
    } finally {
      setConfirmLoading(false);
    }
  };

  const columns = [
    { key: "cliente_id", label: "ID", render: (r) => `#${r.cliente_id}` },
    { key: "nombre", label: "Nombre", render: (r) => `${r.primer_nombre} ${r.apellido}` },
    { key: "dni", label: "DNI" },
    { key: "email", label: "Email" },
    { key: "estado", label: "Estado", render: (r) => <StatusChip value={r.estado} /> },
    { key: "creditos", label: "Créditos", align: "right" },
    {
      key: "actions",
      label: "Acciones",
      align: "right",
      render: (r) => (
        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
          <Tooltip title="Editar">
            <IconButton size="small" onClick={() => openEdit(r)}>
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Desactivar cliente">
            <IconButton size="small" color="error" onClick={() => setConfirmTarget(r)} disabled={r.estado === "inactivo"}>
              <PersonOffOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  const editingValues = editing
    ? {
        primer_nombre: editing.primer_nombre,
        apellido: editing.apellido,
        segundo_nombre: editing.segundo_nombre,
        segundo_apellido: editing.segundo_apellido,
        dni: editing.dni,
        codigo_pais: editing.codigo_pais,
        codigo_area: editing.codigo_area,
        numero_telefono: editing.numero_telefono,
        plan_id: editing.plan_id,
      }
    : { usuario_id: "" };

  const fields = editing
    ? clienteFields()
    : [{ name: "usuario_id", label: "ID de usuario existente", required: true, type: "number", helperText: "El usuario debe existir previamente (se crea vía registro)" }, ...clienteFields()];

  return (
    <Box>
      <PageHeader
        title="Clientes"
        description="Administrá los clientes activos de la plataforma."
        breadcrumbs={[{ label: "Clientes" }]}
        action={
          <Button variant="contained" startIcon={<AddOutlinedIcon />} onClick={openCreate}>
            Nuevo cliente
          </Button>
        }
      />

      <TextField
        placeholder="Buscar por nombre, DNI o email…"
        size="small"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2, maxWidth: 360 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchOutlinedIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
      />

      <DataTable
        columns={columns}
        rows={filteredRows}
        status={status}
        error={error}
        meta={meta}
        rowKey="cliente_id"
        onPageChange={setPage}
        onPerPageChange={(n) => {
          setPerPage(n);
          setPage(1);
        }}
        onRetry={reload}
        emptyTitle="Todavía no hay clientes"
        emptyDescription="Los clientes que se registren o creen manualmente van a aparecer acá."
        emptyAction={{ label: "Crear cliente", onClick: openCreate }}
      />

      <FormDialog
        open={formOpen}
        title={editing ? `Editar cliente #${editing.cliente_id}` : "Nuevo cliente"}
        fields={fields}
        initialValues={editingValues}
        onSubmit={handleSubmit}
        onClose={() => setFormOpen(false)}
        loading={formLoading}
        serverError={formError}
        submitLabel={editing ? "Guardar cambios" : "Crear cliente"}
      />

      <ConfirmDialog
        open={Boolean(confirmTarget)}
        title="Desactivar cliente"
        description={`Esta acción va a desactivar la cuenta de ${confirmTarget?.primer_nombre} ${confirmTarget?.apellido}. Podés seguir viéndolo en el listado con estado "inactivo".`}
        confirmLabel="Desactivar"
        confirmColor="error"
        loading={confirmLoading}
        onConfirm={handleDeactivate}
        onClose={() => setConfirmTarget(null)}
      />
    </Box>
  );
}
