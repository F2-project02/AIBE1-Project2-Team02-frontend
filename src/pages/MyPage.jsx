// import React from 'react';
// import { Box, Typography } from "@mui/material";
//
// export default function MyPage() {
//     return (
//         <Box sx={{ width: '100%', maxWidth: '1040px', margin: '0 auto', padding: '2rem'}}>
//             <Typography variant="h5" fontWeight={600} sx={{ mb: 4 }}>
//                 마이페이지 - 내 정보 수정
//             </Typography>
//
//             {/*여기에 페이지 내용을 추가할 예정입니다*/}
//             <Typography>마이페이지 내용이 여기에 표시됩니다</Typography>
//         </Box>
//     );
// }



// src/pages/MyPage.jsx

import { useState, useEffect } from 'react';
import { Box, Typography } from "@mui/material";

export default function MyPage() {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);

            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error("인증 토큰이 없습니다");
                    setLoading(false);
                    return;
                }

                const response = await fetch('http://localhost:8081/api/account/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error("프로필 정보는 가져오는데 실패했습니다");
                }

                const result = await response.json();
                if (result.success) {
                    setProfileData(result.data);
                }
            } catch (error) {
                console.error("프로필 조회 오류: ", error);
            } finally {
                setLoading(false);
            }
        }

        fetchProfile();
    }, []);


    return (
        <Box sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h5" fontWeight={600} sx={{ mb: 4 }}>
                마이페이지 - 내 정보 수정
            </Typography>

            {loading ? (
                <Typography sx={{ mt:4 }}> 정보 불러오는 주우우웅 </Typography>
            ) : (
                <Box sx={{ mt:4 }}>
                    {profileData ? (
                        <>
                            <Typography>닉네임: {profileData.nickname || '없음'}</Typography>
                            <Typography>이메일: {profileData.email || '없음'}</Typography>
                            <Typography>생년월일: {profileData.birthDate || '없음'}</Typography>
                            <Typography>성별: {profileData.sex || '없음'}</Typography>
                            <Typography>MBTI: {profileData.mbti || '없음'}</Typography>
                        </>
                    ) : (
                        <Typography>프로필 정보를 불러올 수 없습니다</Typography>
                    )}
                </Box>
            )}
        </Box>
    );
}