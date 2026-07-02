import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack,
  Alert,
  CircularProgress,
} from "@mui/material";

/**
 * @param {object[]} fields
 *
 */
export default function FormDialog({
  open,
  title,
  fields,
  initialValues = {},
  onSubmit,
  onClose,
  submitLabel = "Guardar",
  loading = false,
  serverError = null,
}) {
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (open) {
      setValues(initialValues);
      setTouched({});
    }
  }, [open]);

  const errorFor = (field) => {
    if (!touched[field.name]) return null;
    const val = values[field.name];
    if (field.required && (val === undefined || val === null || val === "")) {
      return "Este campo es requerido";
    }
    if (
      field.type === "email" &&
      val &&
      !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val)
    ) {
      return "Email inválido";
    }
    return null;
  };

  const hasErrors = fields.some((f) => {
    const val = values[f.name];
    return f.required && (val === undefined || val === null || val === "");
  });

  const handleChange = (name) => (e) => {
    setValues((prev) => ({ ...prev, [name]: e.target.value }));
  };

  const handleBlur = (name) => () =>
    setTouched((prev) => ({ ...prev, [name]: true }));

  const handleSubmit = () => {
    setTouched(Object.fromEntries(fields.map((f) => [f.name, true])));
    if (hasErrors) return;
    onSubmit(values);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontFamily: "Sora, sans-serif" }}>{title}</DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} sx={{ mt: 0.5 }}>
          {serverError && <Alert severity="error">{serverError}</Alert>}
          {fields.map((field) => (
            <TextField
              key={field.name}
              label={field.label}
              select={field.type === "select"}
              type={
                field.type === "select" || field.type === "textarea"
                  ? "text"
                  : field.type || "text"
              }
              multiline={field.type === "textarea"}
              minRows={field.type === "textarea" ? 3 : undefined}
              required={field.required}
              fullWidth
              disabled={field.disabled || loading}
              value={values[field.name] ?? ""}
              onChange={handleChange(field.name)}
              onBlur={handleBlur(field.name)}
              error={Boolean(errorFor(field))}
              helperText={errorFor(field) || field.helperText}
              size="small"
            >
              {field.type === "select" &&
                (field.options || []).map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
            </TextField>
          ))}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={
            loading ? <CircularProgress size={16} color="inherit" /> : null
          }
        >
          {submitLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
