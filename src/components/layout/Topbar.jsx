import { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Typography,
  Divider,
  ListItemIcon,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { useNavigate } from "react-router-dom";
import { useThemeMode } from "../../context/ThemeModeContext";
import { useAuth } from "../../context/AuthContext";
import { notificacionesApi } from "../../api/notificaciones";

export default function Topbar({ onMenuClick }) {
  const { mode, toggleMode } = useThemeMode();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user?.usuario_id) return;
    notificacionesApi
      .list({ usuario_id: user.usuario_id, leida: false, per_page: 1 })
      .then((res) => setUnreadCount(res.meta?.total ?? 0))
      .catch(() => setUnreadCount(0));
  }, [user]);

  const handleLogout = () => {
    setUserMenuAnchor(null);
    logout();
    navigate("/login");
  };

  const initials = (user?.email || "?").slice(0, 2).toUpperCase();

  return (
    <AppBar
      position="sticky"
      color="default"
      sx={{
        bgcolor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Toolbar sx={{ gap: 1 }}>
        <IconButton edge="start" onClick={onMenuClick} sx={{ display: { md: "none" } }}>
          <MenuIcon />
        </IconButton>

        <Box sx={{ flex: 1 }} />

        <Tooltip title={mode === "light" ? "Modo oscuro" : "Modo claro"}>
          <IconButton onClick={toggleMode}>
            {mode === "light" ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
          </IconButton>
        </Tooltip>

        <Tooltip title="Notificaciones">
          <IconButton onClick={() => navigate("/notificaciones")}>
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsNoneOutlinedIcon />
            </Badge>
          </IconButton>
        </Tooltip>

        <IconButton onClick={(e) => setUserMenuAnchor(e.currentTarget)} sx={{ ml: 0.5 }}>
          <Avatar sx={{ width: 32, height: 32, fontSize: "0.8rem", bgcolor: "primary.main", color: "secondary.main" }}>
            {initials}
          </Avatar>
        </IconButton>
        <Menu
          anchorEl={userMenuAnchor}
          open={Boolean(userMenuAnchor)}
          onClose={() => setUserMenuAnchor(null)}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="body2" fontWeight={700} noWrap>
              {user?.email}
            </Typography>
            <Typography variant="caption" color="text.secondary" textTransform="capitalize">
              {user?.rol}
            </Typography>
          </Box>
          <Divider />
          <MenuItem
            onClick={() => {
              setUserMenuAnchor(null);
              navigate("/perfil");
            }}
          >
            <ListItemIcon>
              <PersonOutlineOutlinedIcon fontSize="small" />
            </ListItemIcon>
            Mi perfil
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutOutlinedIcon fontSize="small" />
            </ListItemIcon>
            Cerrar sesión
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
