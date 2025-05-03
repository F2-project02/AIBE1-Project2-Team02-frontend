// src/App.jsx

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import lightTheme from "./styles/themeLight";
import AppRouter from "./router/Router";

export default function App() {
  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <AppRouter />
    </ThemeProvider>
  );
}
