// 📄 src/components/Search/RegionSelectionMobile.jsx
import {
  Dialog,
  Box,
  Typography,
  IconButton,
  Chip,
  Tabs,
  Tab,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import CheckIcon from "@mui/icons-material/Check";
import GradientButton from "../Button/GradientButton";
import { useEffect, useState } from "react";
import { RegionApiService } from "./RegionApiService";

export default function RegionSelectionMobile({
  open,
  onClose,
  onSubmit,
  selectedDongs,
  setSelectedDongs,
  selectedProvince,
  setSelectedProvince,
  selectedDistrict,
  setSelectedDistrict,
}) {
  const [tab, setTab] = useState(0);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [dongs, setDongs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      RegionApiService.getSidos().then(setProvinces);
      setTab(0);
    }
  }, [open]);

  const handleTabChange = (_, newValue) => setTab(newValue);

  const handleItemClick = async (item) => {
    if (tab === 0) {
      setSelectedProvince(item);
      setTab(1);
      setLoading(true);
      const res = await RegionApiService.getSigungus(item);
      setDistricts(res);
      setLoading(false);
    } else if (tab === 1) {
      setSelectedDistrict(item);
      setTab(2);
      setLoading(true);
      const res = await RegionApiService.getDongs(selectedProvince, item);
      setDongs(res);
      setLoading(false);
    } else if (tab === 2) {
      const code = item.regionCode;
      setSelectedDongs((prev) =>
        prev.some((d) => d.regionCode === code)
          ? prev.filter((d) => d.regionCode !== code)
          : [
              ...prev,
              {
                ...item,
                displayName: `${item.sido} ${item.sigungu} ${
                  item.dong || ""
                }`.trim(),
              },
            ]
      );
    }
  };

  const handleReset = () => {
    setSelectedProvince("");
    setSelectedDistrict("");
    setSelectedDongs([]);
    setTab(0);
  };

  const isDongSelected = (dong) =>
    selectedDongs.some((d) => d.regionCode === dong.regionCode);

  const handleComplete = () => {
    onSubmit(selectedDongs);
    onClose();
  };

  const currentItems = tab === 0 ? provinces : tab === 1 ? districts : dongs;

  return (
    <Dialog open={open} onClose={onClose} fullScreen>
      <Box
        component="div"
        display="block"
        bgcolor="#fefefe"
        height="100%"
        overflow="auto"
        px={1.5}
        pt={3}
      >
        {/* 상단 바 */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          px={2}
          py={1}
        >
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
          <Typography fontSize={18} fontWeight={600}>
            지역 선택
          </Typography>
          <Box width={40} />
        </Box>

        {/* 탭 */}
        <Tabs value={tab} onChange={handleTabChange} variant="fullWidth">
          <Tab label="시/도" />
          <Tab label="시/군/구" disabled={!selectedProvince} />
          <Tab label="읍/면/동" disabled={!selectedDistrict} />
        </Tabs>

        {/* 리스트 */}
        <Box
          flex={1}
          overflow="auto"
          py={2}
          sx={{
            height: "auto",
            maxHeight: "calc(100vh - 280px)",
            scrollbarWidth: "thin",
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(91, 141, 239, 0.3)",
              borderRadius: "4px",
            },
          }}
        >
          {loading ? (
            <Box p={3} textAlign="center"></Box>
          ) : tab < 2 ? (
            currentItems.map((item) => (
              <Box
                key={item}
                onClick={() => handleItemClick(item)}
                sx={{
                  cursor: "pointer",
                  px: 3,
                  py: 1.5,
                  mb: 1,
                  borderRadius: "8px",
                  backgroundColor: "#fefefe",
                  color: "var(--text-300)",
                  fontWeight: 500,
                  "&:hover": {
                    backgroundColor: "var(--bg-200)",
                  },
                }}
              >
                <Typography>{item}</Typography>
              </Box>
            ))
          ) : (
            dongs.map((dong) => {
              const selected = isDongSelected(dong);
              return (
                <Box
                  key={dong.regionCode}
                  onClick={() => handleItemClick(dong)}
                  sx={{
                    cursor: "pointer",
                    px: 3,
                    py: 1.5,
                    mb: 1,
                    borderRadius: "8px",
                    backgroundColor: "#fefefe",
                    color: selected ? "var(--primary-100)" : "var(--text-300)",
                    fontWeight: 500,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    "&:hover": {
                      backgroundColor: "var(--bg-200)",
                    },
                  }}
                >
                  <Typography>{dong.dong || `${dong.sigungu} 전체`}</Typography>
                  {selected && <CheckIcon fontSize="small" />}
                </Box>
              );
            })
          )}
        </Box>

        {/* 선택된 지역 */}
        {selectedDongs.length > 0 && (
          <Box mt={2} px={2}>
            <Typography fontSize={14} fontWeight={500} mb={1}>
              선택된 지역
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {selectedDongs.map((dong) => (
                <Chip
                  key={dong.regionCode}
                  label={dong.displayName}
                  onDelete={() => handleItemClick(dong)}
                  sx={{
                    fontSize: 13,
                    borderColor: "var(--primary-100)",
                    color: "var(--primary-100)",
                    "& .MuiChip-deleteIcon": {
                      color: "var(--primary-100)",
                      "&:hover": {
                        color: "var(--primary-200)",
                      },
                    },
                  }}
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        )}

        {/* 하단 버튼 */}
        <Box px={2} display="flex" gap={1} mt={3} mb={8}>
          <Chip
            icon={<RestartAltIcon sx={{ fontSize: 18 }} />}
            label="초기화"
            onClick={handleReset}
            sx={{
              borderColor: "var(--text-300)",
              color: "var(--text-300)",
              flex: 1,
              height: 52,
              borderRadius: "8px",
              fontWeight: 500,
            }}
            variant="outlined"
          />
          <GradientButton
            onClick={handleComplete}
            sx={{
              flex: 2,
              height: 52,
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: 16,
            }}
            disabled={selectedDongs.length === 0}
          >
            선택 완료
          </GradientButton>
        </Box>
      </Box>
    </Dialog>
  );
}
