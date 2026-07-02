import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import Diversity3OutlinedIcon from "@mui/icons-material/Diversity3Outlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import CardMembershipOutlinedIcon from "@mui/icons-material/CardMembershipOutlined";
import DesignServicesOutlinedIcon from "@mui/icons-material/DesignServicesOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";

export const navSections = [
  {
    label: "General",
    items: [{ label: "Dashboard", to: "/", icon: DashboardOutlinedIcon }],
  },
  {
    label: "Gestión comercial",
    items: [
      { label: "Clientes", to: "/clientes", icon: Diversity3OutlinedIcon },
      { label: "Solicitudes", to: "/solicitudes", icon: AssignmentOutlinedIcon },
      { label: "Casos", to: "/casos", icon: WorkOutlineOutlinedIcon },
    ],
  },
  {
    label: "Catálogo",
    items: [
      { label: "Planes", to: "/planes", icon: CardMembershipOutlinedIcon },
      { label: "Servicios", to: "/servicios", icon: DesignServicesOutlinedIcon },
    ],
  },
  {
    label: "Administración",
    items: [
      { label: "Usuarios", to: "/usuarios", icon: GroupOutlinedIcon },
      { label: "Notificaciones", to: "/notificaciones", icon: NotificationsNoneOutlinedIcon },
    ],
  },
];
