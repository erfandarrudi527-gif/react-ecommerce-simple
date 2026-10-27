import { createTheme } from "@mui/material/styles";

// ===== فروشگاه — تم دارک نئونی آبی/سیان =====
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#22d3ee",
      dark: "#0891b2",
      light: "#67e8f9",
      contrastText: "#04131a",
    },
    secondary: {
      main: "#a855f7",
      contrastText: "#ffffff",
    },
    success: { main: "#10b981", dark: "#059669" },
    error: { main: "#f43f5e" },
    warning: { main: "#f59e0b" },
    info: { main: "#3b82f6" },
    background: { default: "#020617", paper: "#0b1424" },
    text: { primary: "#e0f2fe", secondary: "#7dd3fc" },
  },
  shape: { borderRadius: 18 },
  typography: {
    fontFamily:
      "Vazirmatn, Quicksand, 'Segoe UI', Tahoma, sans-serif",
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h3: { fontWeight: 800 },
    h4: { fontWeight: 800 },
    h6: { fontWeight: 700 },
    body1: { lineHeight: 1.9 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "13px",
          fontWeight: 700,
          boxShadow: "none",
          transition:
            "transform .18s ease, box-shadow .3s ease, background-color .3s ease",
          "&:hover": { boxShadow: "none" },
          "&:active": { transform: "scale(.97)" },
        },
      },
    },
    MuiChip: {
      styleOverrides: { root: { fontWeight: 700 } },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: "transform .18s ease, background-color .3s ease",
          "&:active": { transform: "scale(.88)" },
        },
      },
    },
    MuiCard: {
      styleOverrides: { root: { backgroundImage: "none" } },
    },
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: "none" } },
    },
  },
});

export default theme;