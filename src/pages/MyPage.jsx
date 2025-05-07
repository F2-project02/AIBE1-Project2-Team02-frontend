import React from 'react';
import { Box, Typography } from "@mui/material";

export default function MyPage() {
    return (
        <Box sx={{ width: '100%', maxWidth: '1040px', margin: '0 auto', padding: '2rem'}}>
            <Typography variant="h5" fontWeight={600} sx={{ mb: 4 }}>
                마이페이지 - 내 정보 수정
            </Typography>

            {/*여기에 페이지 내용을 추가할 예정입니다*/}
            <Typography>마이페이지 내용이 여기에 표시됩니다</Typography>
        </Box>
    );
}