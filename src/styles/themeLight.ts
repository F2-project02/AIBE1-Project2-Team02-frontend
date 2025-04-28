// 라이트모드 테마 설정
/// src/styles/themeLight.ts
import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#5B8DEF',
      light: '#5B8DEF',
      dark: '#3572D0',
      contrastText: '#FFFEFB',
    },
    background: {
      default: '#FFFEFB',
      paper: '#F5F4F1',
    },
    text: {
      primary: '#1D1C1C',
      secondary: '#252525',
      disabled: '#AAAAAA',
    },
    grey: {
      300: '#CCCBC8',
      500: '#555555',
    },
  },
  typography: {
    fontFamily: `'Pretendard', sans-serif`,
    fontWeightLight: 400,
    fontWeightRegular: 500,
    fontWeightMedium: 600,
    fontWeightBold: 700,
  },
});

export default lightTheme;
