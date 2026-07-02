import { Box, Alert } from "@mui/material";
import PageHeader from "../components/common/PageHeader";
import DataTable from "../components/common/DataTable";
import StatusChip from "../components/common/StatusChip";
import { usePaginatedResource } from "../hooks/usePaginatedResource";
import { usuariosApi } from "../api/usuarios";

export default function Usuarios() {
  const { rows, status, error, reload } = usePaginatedResource(usuariosApi.list, {});

  const columns = [
    { key: "usuario_id", label: "ID", render: (r) => `#${r.usuario_id}` },
    { key: "email", label: "Email" },
    { key: "rol", label: "Rol", render: (r) => <span style={{ textTransform: "capitalize" }}>{r.rol}</span> },
    { key: "estado", label: "Estado", render: (r) => <StatusChip value={r.estado} /> },
    {
      key: "ultimo_acceso",
      label: "Último acceso",
      render: (r) => (r.ultimo_acceso ? new Date(r.ultimo_acceso).toLocaleString("es-AR") : "—"),
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Usuarios"
        description="Listado de cuentas del sistema."
        breadcrumbs={[{ label: "Usuarios" }]}
      />

      <Alert severity="info" sx={{ mb: 2 }}>
        El backend expone únicamente lectura para usuarios. Las cuentas se crean a través del registro
        de clientes (<code>/api/auth/register</code>).
      </Alert>

      <DataTable
        columns={columns}
        rows={rows}
        status={status}
        error={error}
        meta={null}
        rowKey="usuario_id"
        onRetry={reload}
        emptyTitle="No hay usuarios"
        emptyDescription="Las cuentas creadas van a listarse acá."
      />
    </Box>
  );
}
