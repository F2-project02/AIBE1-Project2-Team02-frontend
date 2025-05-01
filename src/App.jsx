import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Box, Typography, Button, AppBar, Toolbar } from "@mui/material";
import { Search } from "@mui/icons-material";
import GradientButton from "./components/GradientButton";
import HeroBanner from "./components/HeroBanner/HeroBanner";
import TiptapEditor from "./components/TiptapEditor/TiptapEditor";
import lightTheme from "./styles/themeLight";
import Layout from "./components/common/Layout";
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
    <Layout>
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        {/* 상단 AppBar */}
        <AppBar position="static" color="background" elevation={0} sx={{ zIndex: 1000 }}>
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

          <HeroBanner />

          
          <TiptapEditor />

          <GradientButton
            size="xs"
            startIcon={<Search />}
            onClick={() => alert("TESTING...")}
          >
            탐색하기
          </GradientButton>
        </Box>
      </ThemeProvider>
    </Layout>
  );
}

export default App;
