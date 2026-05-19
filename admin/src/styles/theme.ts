import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Theme {
    custom: {
      fieldHeight: number;
    };
  }
  interface ThemeOptions {
    custom?: {
      fieldHeight?: number;
    };
  }
}

export const theme = createTheme({
  palette: {
    primary: { main: "#1A6B45", light: "#2D9E6B", dark: "#0D3D27" },
    secondary: { main: "#F5A623", light: "#FEF3DC", dark: "#8A6010" },
    success: {
      main: "#2D9E6B",
      light: "#E6F5EE",
      dark: "#1A6B45",
    },
    warning: { main: "#FFA500", light: "#FFB74D", dark: "#FF8C00" },
    error: {
      main: "#D94040",
      light: "#FCEAEA",
      dark: "#A52727",
    },
    background: {
      default: "#F3F7F5",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#111B16",
      secondary: "#4A6055",
    },
    divider: "rgba(0,0,0,0.08)",
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily:
      "var(--font-jakarta), system-ui, Segoe UI, Roboto, Arial, sans-serif",
    button: { textTransform: "none", fontWeight: 600 },
  },
  custom: { fieldHeight: 46 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily:
            "var(--font-jakarta), system-ui, Segoe UI, Roboto, Arial, sans-serif",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: "10px",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: "none",
          "&:disabled": {
            opacity: 0.6,
            backgroundColor: "#EAF0EC",
            color: "#8FA89B",
          },
        },
        contained: {
          backgroundColor: "#1f80ff",
          color: "#FFFFFF",
          "&:hover": { backgroundColor: "#2D9E6B" },
          "&:active": { backgroundColor: "#0D3D27" },
          "&:disabled": {
            backgroundColor: "#EAF0EC",
            color: "#8FA89B",
          },
        },
        containedPrimary: {
          backgroundColor: "#1A6B45",
          color: "#FFFFFF",
          "&:hover": { backgroundColor: "#2D9E6B", boxShadow: "none" },
          "&:active": { backgroundColor: "#0D3D27" },
          "&:disabled": {
            backgroundColor: "#EAF0EC",
            color: "#8FA89B",
          },
        },
        outlined: {
          borderColor: "#1A6B45",
          color: "#1A6B45",
          backgroundColor: "#FFFFFF",
          "&:hover": {
            backgroundColor: "#ADD8E608",
            borderColor: "#ADD8E6",
            boxShadow: "none",
          },
          "&:disabled": {
            borderColor: "#EAF0EC",
            color: "#8FA89B",
          },
        },
        outlinedPrimary: {
          borderColor: "#1A6B45",
          color: "#1A6B45",
          backgroundColor: "#FFFFFF",
          "&:hover": {
            backgroundColor: "#2D9E6B08",
            borderColor: "#2D9E6B",
            boxShadow: "none",
          },
          "&:disabled": {
            borderColor: "#EAF0EC",
            color: "#8FA89B",
          },
        },
        sizeLarge: {
          minHeight: 46,
          width: 323,
          padding: "12px 24px",
          fontSize: "16px",
        },
        sizeSmall: { minHeight: 36, padding: "8px 16px", fontSize: "14px" },
      },
      defaultProps: { disableElevation: true },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: "#1A6B45",
          cursor: "pointer",
          textDecoration: "none",
          transition: "all 0.2s ease-in-out",
          "&:hover": { textDecoration: "underline", opacity: 0.8 },
        },
      },
    },
  },
});
