export const palette = {
  ink900: "#10141F",
  ink800: "#171D2E",
  ink700: "#1E2A4A",
  ink600: "#2A3757",
  slate500: "#5B6478",
  slate300: "#9AA2B4",
  slate100: "#E4E7EE",
  mist50: "#F6F7FB",
  amber500: "#E8A33D",
  amber600: "#CC8A26",
  amber100: "#FBEBD1",
  teal500: "#2F9E8F",
  teal100: "#DCF3EF",
  coral500: "#D9584F",
  coral100: "#FBE1DF",
  white: "#FFFFFF",
};

export const statusColors = {
  // Solicitudes
  pendiente: { color: palette.slate500, bg: palette.slate100 },
  en_revisión: { color: palette.amber600, bg: palette.amber100 },
  aprobada: { color: palette.teal500, bg: palette.teal100 },
  rechazada: { color: palette.coral500, bg: palette.coral100 },
  resuelta: { color: palette.teal500, bg: palette.teal100 },
  // Casos
  asignado: { color: palette.slate500, bg: palette.slate100 },
  en_atención: { color: palette.amber600, bg: palette.amber100 },
  en_progreso: { color: "#3D6FD9", bg: "#E1E9FC" },
  resuelto: { color: palette.teal500, bg: palette.teal100 },
  escalado: { color: palette.coral500, bg: palette.coral100 },
  // Usuario/Plan/Servicio
  activo: { color: palette.teal500, bg: palette.teal100 },
  inactivo: { color: palette.slate500, bg: palette.slate100 },
  discontinuado: { color: palette.coral500, bg: palette.coral100 },
};

export const fontFamily = {
  display: '"Sora", "Inter", sans-serif',
  body: '"Inter", sans-serif',
  mono: '"IBM Plex Mono", monospace',
};
