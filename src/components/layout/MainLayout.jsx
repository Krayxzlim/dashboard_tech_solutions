import { useState } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar, { SIDEBAR_WIDTH } from "./Sidebar";
import Topbar from "./Topbar";

export default function MainLayout() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar
        variant={isDesktop ? "permanent" : "temporary"}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
      <Box sx={{ flex: 1, width: { md: `calc(100% - ${SIDEBAR_WIDTH}px)` } }}>
        <Topbar onMenuClick={() => setMobileOpen(true)} />
        <Box component="main" sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
