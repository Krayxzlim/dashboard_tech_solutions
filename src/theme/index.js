import { createTheme } from "@mui/material/styles";
import { palette, fontFamily } from "./tokens";

export function buildTheme(mode) {
  const isDark = mode === "dark";

  return createTheme({
    palette: {
      mode,
      primary: { main: palette.amber500, dark: palette.amber600, contrastText: palette.ink900 },
      secondary: { main: palette.ink700 },
      success: { main: palette.teal500 },
      error: { main: palette.coral500 },
      warning: { main: palette.amber600 },
      background: {
        default: isDark ? palette.ink900 : palette.mist50,
        paper: isDark ? palette.ink800 : palette.white,
      },
      text: {
        primary: isDark ? palette.slate100 : palette.ink900,
        secondary: isDark ? palette.slate300 : palette.slate500,
      },
      divider: isDark ? "rgba(228,231,238,0.08)" : palette.slate100,
    },
    shape: { borderRadius: 10 },
    typography: {
      fontFamily: fontFamily.body,
      h1: { fontFamily: fontFamily.display, fontWeight: 700 },
      h2: { fontFamily: fontFamily.display, fontWeight: 700 },
      h3: { fontFamily: fontFamily.display, fontWeight: 600 },
      h4: { fontFamily: fontFamily.display, fontWeight: 600 },
      h5: { fontFamily: fontFamily.display, fontWeight: 600 },
      h6: { fontFamily: fontFamily.display, fontWeight: 600 },
      button: { textTransform: "none", fontWeight: 600 },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: 8 },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: "none" },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: { boxShadow: "none" },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { fontWeight: 600, fontFamily: fontFamily.mono, fontSize: "0.72rem" },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: { fontWeight: 700, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.04em" },
        },
      },
    },
  });
}
