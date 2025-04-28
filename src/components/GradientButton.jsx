// src/components/GradientButton.jsx
// 메인 그라디언트 버튼 컴포넌트

import { Button } from '@mui/material';

export default function GradientButton({ children, onClick, fullWidth = false, size = 'md', sx = {} }) {
  // size에 따른 스타일 분기
  const sizeStyles = {
    xs: {
      paddingX: 3,
      paddingY: 1,
      fontSize: 'clamp(0.75rem, 2vw, 0.9rem)',
    },
    md: {
      paddingX: 16,
      paddingY: 1.5,
      fontSize: 'clamp(0.75rem, 2.5vw, 1rem)',
    },
  };

  return (
    <Button
      onClick={onClick}
      fullWidth={fullWidth}
      variant="contained"
      sx={{
        background: 'linear-gradient(90deg, #5B8DEF 0%, #FFBAD0 100%)',
        color: '#FFFEFB',
        fontWeight: 500,
        borderRadius: '16px',
        boxShadow: '0px 4px 12px rgba(91, 141, 239, 0.3)',
        textTransform: 'none',
        ...sizeStyles[size], // 사이즈에 따른 스타일 적용
        ...sx, // 추가 스타일 커스터마이징
      }}
    >
      {children}
    </Button>
  );
}
