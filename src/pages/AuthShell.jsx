import { Box, Paper, Typography, Stack } from "@mui/material";
import { palette } from "../theme/tokens";

export default function AuthShell({ title, subtitle, children }) {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex" }}>
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "space-between",
          width: "42%",
          bgcolor: palette.ink800,
          color: palette.slate100,
          p: 6,
        }}
      >
        <Stack direction="row" alignItems="center" gap={1.25}>
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: "8px",
              bgcolor: palette.amber500,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "Sora, sans-serif",
              fontWeight: 800,
              color: palette.ink900,
            }}
          >
            C
          </Box>
          <Typography
            variant="h6"
            sx={{ fontFamily: "Sora, sans-serif", color: "#fff" }}
          >
            TechSolutions
          </Typography>
        </Stack>

        <Box>
          <Typography
            variant="h3"
            sx={{ maxWidth: 420, lineHeight: 1.25, color: "#fff" }}
          >
            Consultoría profesional, ordenada de punta a punta.
          </Typography>
          <Typography
            variant="body1"
            sx={{ mt: 2, color: palette.slate300, maxWidth: 380 }}
          >
            Solicitudes, casos y clientes en un mismo lugar, con trazabilidad
            completa de cada estado.
          </Typography>
        </Box>

        <Typography variant="caption" color={palette.slate300}>
          © {new Date().getFullYear()} TechSolutions
        </Typography>
      </Box>

      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
          p: 3,
        }}
      >
        <Paper
          variant="outlined"
          sx={{
            p: { xs: 3, sm: 5 },
            width: "100%",
            maxWidth: 420,
            borderRadius: 3,
          }}
        >
          <Typography variant="h5" sx={{ mb: 0.5 }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {subtitle}
          </Typography>
          {children}
        </Paper>
      </Box>
    </Box>
  );
}
