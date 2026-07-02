import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", gap: 2 }}>
      <Typography variant="h2">404</Typography>
      <Typography color="text.secondary">Esta página no existe.</Typography>
      <Button component={Link} to="/" variant="contained">
        Volver al inicio
      </Button>
    </Box>
  );
}
