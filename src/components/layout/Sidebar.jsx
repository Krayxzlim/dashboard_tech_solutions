import {
  Drawer,
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";
import { navSections } from "./navConfig";
import { palette } from "../../theme/tokens";

export const SIDEBAR_WIDTH = 264;

export default function Sidebar({ mobileOpen, onClose, variant }) {
  const location = useLocation();

  const content = (
    <Box
      sx={{
        height: "100%",
        bgcolor: palette.ink800,
        color: palette.slate100,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{ px: 3, py: 3, display: "flex", alignItems: "center", gap: 1.25 }}
      >
        <Box
          sx={{
            width: 32,
            height: 32,
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
      </Box>

      <Box sx={{ flex: 1, overflowY: "auto", px: 1.5, pb: 3 }}>
        {navSections.map((section) => (
          <Box key={section.label} sx={{ mb: 2 }}>
            <Typography
              variant="caption"
              sx={{
                px: 1.5,
                color: palette.slate300,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontWeight: 700,
                fontSize: "0.68rem",
              }}
            >
              {section.label}
            </Typography>
            <List dense sx={{ mt: 0.5 }}>
              {section.items.map((item) => {
                const active = location.pathname === item.to;
                const Icon = item.icon;
                return (
                  <ListItemButton
                    key={item.to}
                    component={NavLink}
                    to={item.to}
                    onClick={onClose}
                    sx={{
                      borderRadius: 1.5,
                      mb: 0.25,
                      color: active ? palette.ink900 : palette.slate100,
                      bgcolor: active ? palette.amber500 : "transparent",
                      "&:hover": {
                        bgcolor: active
                          ? palette.amber500
                          : "rgba(255,255,255,0.06)",
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 34, color: "inherit" }}>
                      <Icon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontSize: "0.86rem",
                        fontWeight: active ? 700 : 500,
                      }}
                    />
                  </ListItemButton>
                );
              })}
            </List>
          </Box>
        ))}
      </Box>
    </Box>
  );

  if (variant === "permanent") {
    return (
      <Box component="nav" sx={{ width: SIDEBAR_WIDTH, flexShrink: 0 }}>
        <Drawer
          variant="permanent"
          open
          sx={{
            "& .MuiDrawer-paper": { width: SIDEBAR_WIDTH, border: "none" },
          }}
        >
          {content}
        </Drawer>
      </Box>
    );
  }

  return (
    <Drawer
      variant="temporary"
      open={mobileOpen}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{ "& .MuiDrawer-paper": { width: SIDEBAR_WIDTH, border: "none" } }}
    >
      {content}
    </Drawer>
  );
}
