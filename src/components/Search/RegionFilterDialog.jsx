// src/components/Search/RegionFilterDialog.jsx

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Tabs,
  Tab,
  Chip,
  IconButton,
  Grid,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import GradientButton from "../Button/GradientButton";

// Mock 지역 데이터 (이후 API 연동)
const regionData = {
  서울: {
    강남구: [
      "개포동",
      "논현동",
      "대치동",
      "도곡동",
      "삼성동",
      "세곡동",
      "수서동",
      "신사동",
      "압구정동",
      "역삼동",
      "일원동",
      "청담동",
    ],
    강동구: [
      "강일동",
      "고덕동",
      "길동",
      "둔촌동",
      "명일동",
      "상일동",
      "성내동",
      "암사동",
      "천호동",
    ],
    강서구: [
      "가양동",
      "개화동",
      "공항동",
      "내발산동",
      "등촌동",
      "마곡동",
      "방화동",
      "염창동",
      "오곡동",
      "오쇠동",
      "외발산동",
      "화곡동",
    ],
    관악구: ["남현동", "봉천동", "신림동"],
    광진구: [
      "광장동",
      "구의동",
      "군자동",
      "능동",
      "자양동",
      "중곡동",
      "화양동",
    ],
    구로구: [
      "가리봉동",
      "개봉동",
      "고척동",
      "구로동",
      "궁동",
      "신도림동",
      "오류동",
      "천왕동",
      "항동",
    ],
  },
  경기: {
    고양시: ["덕양구", "일산동구", "일산서구"],
    과천시: ["과천동", "문원동", "부림동"],
    광명시: ["철산동", "하안동", "소하동"],
    광주시: ["초월읍", "오포읍", "곤지암읍"],
    구리시: ["갈매동", "동구동", "인창동"],
    군포시: ["군포동", "당동", "산본동"],
  },
  부산: {
    강서구: ["강동동", "녹산동", "명지동"],
    금정구: ["구서동", "금사동", "금성동"],
    남구: ["감만동", "대연동", "문현동"],
    동구: ["범일동", "수정동", "좌천동"],
    동래구: ["낙민동", "명륜동", "복천동"],
  },
  대구: {
    남구: ["대명동", "봉덕동", "이천동"],
    달서구: ["갈산동", "감삼동", "도원동"],
    달성군: ["다사읍", "화원읍", "가창면"],
    동구: ["검사동", "괴전동", "도동"],
  },
  인천: {
    계양구: ["계산동", "작전동", "효성동"],
    미추홀구: ["관교동", "도화동", "문학동"],
    남동구: ["간석동", "구월동", "논현동"],
    동구: ["금창동", "만석동", "송림동"],
  },
  대전: {
    대덕구: ["덕암동", "목상동", "문평동"],
    동구: ["가오동", "구도동", "낭월동"],
    서구: ["가수원동", "갈마동", "관저동"],
    유성구: ["가정동", "갑동", "계산동"],
  },
  광주: {
    광산구: ["고룡동", "남산동", "대산동"],
    남구: ["백운동", "봉선동", "월산동"],
    동구: ["계림동", "동명동", "산수동"],
    북구: ["두암동", "매곡동", "문흥동"],
  },
  울산: {
    남구: ["달동", "무거동", "삼산동"],
    동구: ["대송동", "방어동", "일산동"],
    북구: ["구유동", "농소동", "매곡동"],
    울주군: ["온산읍", "언양읍", "범서읍"],
  },
  세종: {
    세종시: ["고운동", "금남면", "나성동"],
  },
  강원: {
    강릉시: ["강남동", "교동", "교1동"],
    고성군: ["간성읍", "거진읍", "수동면"],
    동해시: ["귀운동", "동호동", "망상동"],
  },
  충북: {
    괴산군: ["괴산읍", "감물면", "문광면"],
    단양군: ["단양읍", "매포읍", "가곡면"],
    보은군: ["보은읍", "내북면", "마로면"],
  },
  충남: {
    계룡시: ["금암동", "두마면", "신도안면"],
    공주시: ["계룡면", "금학동", "낭성면"],
    금산군: ["금산읍", "남이면", "남일면"],
  },
  전북: {
    고창군: ["고창읍", "고수면", "공음면"],
    군산시: ["개정동", "경암동", "구암동"],
    김제시: ["검산동", "교동", "금구면"],
  },
  전남: {
    강진군: ["강진읍", "군동면", "대구면"],
    고흥군: ["고흥읍", "과역면", "금산면"],
    곡성군: ["곡성읍", "겸면", "고달면"],
  },
  경북: {
    경산시: ["갑제동", "계양동", "남매동"],
    경주시: ["감포읍", "강동면", "건천읍"],
    고령군: ["고령읍", "대가면", "덕곡면"],
  },
  경남: {
    거제시: ["거제면", "고현동", "남부면"],
    거창군: ["거창읍", "가북면", "가조면"],
    고성군: ["고성읍", "개천면", "거류면"],
  },
  제주: {
    서귀포시: ["대정읍", "남원읍", "성산읍"],
    제주시: ["건입동", "구좌읍", "노형동"],
  },
};

function RegionFilterDialog({
  open,
  onClose,
  selectedRegions,
  setSelectedRegions,
}) {
  const [selectedSido, setSelectedSido] = useState("서울");
  const [selectedSigungu, setSelectedSigungu] = useState(null);
  const [sigunguList, setSigunguList] = useState([]);
  const [dongList, setDongList] = useState([]);
  const [tempSelectedRegions, setTempSelectedRegions] = useState([]);

  // 선택된 시도에 따른 시군구 목록 업데이트
  useEffect(() => {
    if (selectedSido) {
      const sigunguNames = Object.keys(regionData[selectedSido]);
      setSigunguList(sigunguNames);
      setSelectedSigungu(sigunguNames[0]);
    }
  }, [selectedSido]);

  // 선택된 시군구에 따른 동 목록 업데이트
  useEffect(() => {
    if (selectedSido && selectedSigungu) {
      setDongList(regionData[selectedSido][selectedSigungu]);
    }
  }, [selectedSido, selectedSigungu]);

  // 다이얼로그 열릴 때 임시 선택된 지역 초기화
  useEffect(() => {
    if (open) {
      setTempSelectedRegions([...selectedRegions]);
    }
  }, [open, selectedRegions]);

  // 시도 탭 변경 핸들러
  const handleSidoChange = (event, newValue) => {
    setSelectedSido(newValue);
  };

  // 시군구 선택 핸들러
  const handleSigunguSelect = (sigungu) => {
    setSelectedSigungu(sigungu);
  };

  // 지역 선택/해제 핸들러
  const handleRegionToggle = () => {
    // 현재 선택한 시군구를 저장
    const regionToToggle = selectedSigungu;

    setTempSelectedRegions((prev) => {
      if (prev.includes(regionToToggle)) {
        return prev.filter((r) => r !== regionToToggle);
      } else {
        // 최대 3개 제한
        if (prev.length >= 3) {
          alert("최대 3개 지역까지 선택 가능합니다.");
          return prev;
        }
        return [...prev, regionToToggle];
      }
    });
  };

  // 선택 완료 핸들러
  const handleConfirm = () => {
    setSelectedRegions(tempSelectedRegions);
    onClose();
  };

  // 선택 초기화 핸들러
  const handleReset = () => {
    setTempSelectedRegions([]);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: "20px",
          overflowY: "visible",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          지역 필터
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pb: 1 }}>
        {/* 선택된 지역 표시 */}
        {tempSelectedRegions.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              선택 항목 {tempSelectedRegions.length}/3
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {tempSelectedRegions.map((region) => (
                <Chip
                  key={region}
                  label={region}
                  onDelete={() => {
                    setTempSelectedRegions((prev) =>
                      prev.filter((r) => r !== region)
                    );
                  }}
                  sx={{
                    backgroundColor: "var(--action-yellow-bg)",
                    color: "var(--action-yellow)",
                    fontWeight: 500,
                    borderRadius: "8px",
                  }}
                />
              ))}
              <Button
                variant="text"
                onClick={handleReset}
                sx={{ color: "var(--text-400)", fontSize: 14, ml: 1 }}
              >
                초기화
              </Button>
            </Box>
          </Box>
        )}

        {/* 시도 선택 탭 */}
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={selectedSido}
            onChange={handleSidoChange}
            variant="scrollable"
            scrollButtons="auto"
            TabIndicatorProps={{
              style: { backgroundColor: "var(--primary-100)" },
            }}
          >
            {Object.keys(regionData).map((sido) => (
              <Tab
                key={sido}
                label={sido}
                value={sido}
                sx={{
                  textTransform: "none",
                  fontWeight: "500",
                  fontSize: "14px",
                  color: "var(--text-300)",
                  "&.Mui-selected": {
                    color: "var(--primary-100)",
                  },
                }}
              />
            ))}
          </Tabs>
        </Box>

        {/* 시군구 and 동 선택 영역 */}
        <Box sx={{ display: "flex", mt: 2, height: 300 }}>
          {/* 시군구 리스트 */}
          <List
            sx={{
              width: "40%",
              borderRight: "1px solid var(--bg-300)",
              overflowY: "auto",
              pr: 1,
            }}
          >
            {sigunguList.map((sigungu) => (
              <ListItem
                key={sigungu}
                button
                selected={selectedSigungu === sigungu}
                onClick={() => handleSigunguSelect(sigungu)}
                sx={{
                  borderRadius: "8px",
                  mb: 0.5,
                  "&.Mui-selected": {
                    backgroundColor: "var(--bg-200)",
                  },
                  "&:hover": {
                    backgroundColor: "var(--bg-200)",
                  },
                }}
              >
                <ListItemText
                  primary={sigungu}
                  primaryTypographyProps={{
                    variant: "body2",
                    fontWeight: selectedSigungu === sigungu ? 600 : 400,
                    color:
                      selectedSigungu === sigungu
                        ? "var(--text-100)"
                        : "var(--text-300)",
                  }}
                />
                {tempSelectedRegions.includes(sigungu) && (
                  <Chip
                    size="small"
                    label="선택됨"
                    sx={{
                      height: 20,
                      fontSize: 10,
                      backgroundColor: "var(--action-yellow-bg)",
                      color: "var(--action-yellow)",
                    }}
                  />
                )}
              </ListItem>
            ))}
          </List>

          {/* 동 목록 (오른쪽) */}
          <Box
            sx={{
              width: "60%",
              pl: 2,
              overflowY: "auto",
            }}
          >
            <Button
              fullWidth
              variant="contained"
              onClick={handleRegionToggle}
              disabled={tempSelectedRegions.includes(selectedSigungu)}
              sx={{
                borderRadius: "12px",
                backgroundColor: tempSelectedRegions.includes(selectedSigungu)
                  ? "var(--bg-300)"
                  : "var(--action-yellow-bg)",
                color: tempSelectedRegions.includes(selectedSigungu)
                  ? "var(--text-400)"
                  : "var(--action-yellow)",
                fontWeight: 500,
                textTransform: "none",
                mb: 2,
                "&:hover": {
                  backgroundColor: tempSelectedRegions.includes(selectedSigungu)
                    ? "var(--bg-300)"
                    : "var(--action-yellow-bg)",
                  opacity: 0.9,
                },
              }}
            >
              {tempSelectedRegions.includes(selectedSigungu)
                ? "선택됨"
                : `${selectedSigungu} 지역 선택하기`}
            </Button>

            <Typography variant="body2" color="var(--text-400)" sx={{ mb: 1 }}>
              세부 지역 (행정동)
            </Typography>

            <Grid container spacing={1}>
              {dongList.map((dong) => (
                <Grid item key={dong}>
                  <Chip
                    label={dong}
                    sx={{
                      backgroundColor: "var(--bg-200)",
                      color: "var(--text-300)",
                      fontWeight: 400,
                      borderRadius: "20px",
                      fontSize: 12,
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={onClose}
          sx={{
            color: "var(--text-300)",
            textTransform: "none",
            fontWeight: "500",
          }}
        >
          취소
        </Button>
        <GradientButton onClick={handleConfirm} size="xs">
          선택 완료 ({tempSelectedRegions.length}/3)
        </GradientButton>
      </DialogActions>
    </Dialog>
  );
}

export default RegionFilterDialog;
