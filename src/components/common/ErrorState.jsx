import { Box, Typography, Button } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export default function ErrorState({ message, onRetry }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 8,
        px: 3,
        textAlign: "center",
      }}
    >
      <ErrorOutlineIcon color="error" sx={{ fontSize: 40, mb: 1.5 }} />
      <Typography variant="subtitle1" fontWeight={700}>
        No se pudo cargar la información
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, maxWidth: 380 }}>
        {message}
      </Typography>
      {onRetry && (
        <Button variant="outlined" size="small" onClick={onRetry} sx={{ mt: 2 }}>
          Reintentar
        </Button>
      )}
    </Box>
  );
}
