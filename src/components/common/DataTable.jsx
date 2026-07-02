import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Skeleton,
  Box,
} from "@mui/material";
import EmptyState from "./EmptyState";
import ErrorState from "./ErrorState";

/**
 * @param {object[]} columns
 * @param {object[]} rows
 * @param {"idle"|"loading"|"success"|"error"} status
 * @param {string} error
 * @param {object|null} meta
 * @param {(page:number)=>void} onPageChange
 * @param {(perPage:number)=>void} onPerPageChange
 * @param {string} rowKey
 * @param {string} emptyTitle
 * @param {string} emptyDescription
 */
export default function DataTable({
  columns,
  rows,
  status,
  error,
  meta,
  onPageChange,
  onPerPageChange,
  onRetry,
  rowKey = "id",
  emptyTitle = "No hay resultados",
  emptyDescription = "Todavía no hay elementos para mostrar acá.",
  emptyAction,
}) {
  const isLoading = status === "loading";
  const isError = status === "error";
  const isEmpty = status === "success" && rows.length === 0;

  return (
    <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.key} align={col.align || "left"}>
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading &&
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={`skeleton-${i}`}>
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      <Skeleton variant="text" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {!isLoading &&
              !isError &&
              rows.map((row) => (
                <TableRow key={row[rowKey]} hover>
                  {columns.map((col) => (
                    <TableCell key={col.key} align={col.align || "left"}>
                      {col.render ? col.render(row) : row[col.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {isEmpty && (
        <EmptyState
          title={emptyTitle}
          description={emptyDescription}
          actionLabel={emptyAction?.label}
          onAction={emptyAction?.onClick}
        />
      )}
      {isError && <ErrorState message={error} onRetry={onRetry} />}

      {meta && !isLoading && !isError && rows.length > 0 && (
        <Box sx={{ borderTop: "1px solid", borderColor: "divider" }}>
          <TablePagination
            component="div"
            count={meta.total}
            page={meta.page - 1}
            rowsPerPage={meta.per_page}
            rowsPerPageOptions={[10, 20, 50]}
            onPageChange={(_, newPage) => onPageChange?.(newPage + 1)}
            onRowsPerPageChange={(e) =>
              onPerPageChange?.(parseInt(e.target.value, 10))
            }
            labelRowsPerPage="Filas por página"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}–${to} de ${count}`
            }
          />
        </Box>
      )}
    </Paper>
  );
}
