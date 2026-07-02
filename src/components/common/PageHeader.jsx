import { Box, Typography, Breadcrumbs, Link, Stack } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

export default function PageHeader({ title, description, breadcrumbs = [], action }) {
  return (
    <Box sx={{ mb: 3 }}>
      {breadcrumbs.length > 0 && (
        <Breadcrumbs separator={<NavigateNextIcon sx={{ fontSize: 14 }} />} sx={{ mb: 1 }}>
          <Link component={RouterLink} to="/" underline="hover" color="text.secondary" variant="body2">
            Inicio
          </Link>
          {breadcrumbs.map((b, i) =>
            b.to ? (
              <Link key={i} component={RouterLink} to={b.to} underline="hover" color="text.secondary" variant="body2">
                {b.label}
              </Link>
            ) : (
              <Typography key={i} variant="body2" color="text.primary">
                {b.label}
              </Typography>
            )
          )}
        </Breadcrumbs>
      )}
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2}>
        <Box>
          <Typography variant="h4">{title}</Typography>
          {description && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {description}
            </Typography>
          )}
        </Box>
        {action}
      </Stack>
    </Box>
  );
}
