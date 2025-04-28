// src/components/GradientButton.jsx
import { Button, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export default function GradientButton({
  children,
  onClick,
  fullWidth = false,
  size = 'md',
  startIcon = null,
  endIcon = null,
  sx = {},
}) {
  const theme = useTheme();

  // 사이즈별 기본 스타일
  const sizeStyles = {
    xs: {
      paddingX: fullWidth ? { xs: 2, md: 3 } : { xs: 3, md: 4 },
      paddingY: { xs: 1, md: 1.5 },
      fontSize: 'clamp(0.8rem, 2.5vw, 1rem)',
    },
    md: {
      paddingX: fullWidth ? { xs: 3, md: 4 } : { xs: 4, md: 6 },
      paddingY: { xs: 1.2, md: 1.8 },
      fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
    },
  };

  return (
    <Button
      onClick={onClick}
      fullWidth={fullWidth}
      variant="contained"
      sx={{
        background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, #FFBAD0 100%)`, // ⭐ 메인 색 theme에서
        color: theme.palette.primary.contrastText, // ⭐ 글자색 theme에서
        fontWeight: 500,
        borderRadius: '16px',
        boxShadow: '0px 4px 12px rgba(91, 141, 239, 0.3)',
        textTransform: 'none',
        whiteSpace: 'nowrap',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        transition: 'all 0.3s ease',
        '&:hover': {
          background: `linear-gradient(90deg, ${theme.palette.primary.dark} 0%, #FF8EA8 100%)`,
        },
        ...sizeStyles[size],
        ...sx,
      }}
    >
      {startIcon && (
        <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
          {startIcon}
        </Box>
      )}
      {children}
      {endIcon && (
        <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
          {endIcon}
        </Box>
      )}
    </Button>
  );
}
