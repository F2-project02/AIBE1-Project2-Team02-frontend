import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Box, Typography, Button, AppBar, Toolbar } from "@mui/material";
import GradientButton from "./components/GradientButton";
import lightTheme from "./styles/themeLight";
import "./styles/global.css";

function App() {
  const styles = {
    container: {
      minHeight: "100vh",
      backgroundColor: "background.default",
      color: "text.primary",
      padding: 4,
      display: "flex",
      flexDirection: "column",
      gap: 4,
      alignItems: "center",
      justifyContent: "flex-start",
    },
    toolbar: {
      width: "100%",
      justifyContent: "space-between",
    },
  };

  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      {/* 상단 AppBar */}
      <AppBar position="static" color="background">
        <Toolbar sx={styles.toolbar}>
          <Typography variant="h6" fontWeight={700}>
            🍭
          </Typography>
        </Toolbar>
      </AppBar>

      {/* 메인 컨텐츠 */}
      <Box sx={styles.container}>
        <Typography variant="h3" fontWeight={700}>
          MEN:TOSS
        </Typography>

        <Typography variant="h6" fontWeight={500} color="grey.500">
          Mentor의 재능을 TOSS하다
        </Typography>

        <GradientButton size="md" onClick={() => alert("테스트중")}>
          탐색하기
        </GradientButton>
      </Box>
    </ThemeProvider>
  );
}

export default App;
