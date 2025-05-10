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
import CheckIcon from "@mui/icons-material/Check";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import GradientButton from "../Button/GradientButton";
import { useEffect, useState } from "react";
import { CategoryService } from "../../lib/api/categoryApi";

export default function CategoryFilterMobile({
  open,
  onClose,
  onSelect,
  selectedItems,
  setSelectedItems,
  selectedParent,
  setSelectedParent,
  selectedMiddle,
  setSelectedMiddle,
}) {
  const [tab, setTab] = useState(0); // 0: 대, 1: 중, 2: 소
  const [parentCategories, setParentCategories] = useState([]);
  const [middleCategories, setMiddleCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    if (open) {
      CategoryService.getParentCategories().then(setParentCategories);
      setTab(0);
    }
  }, [open]);

  useEffect(() => {
    if (selectedParent) {
      CategoryService.getMiddleCategories(selectedParent).then(
        setMiddleCategories
      );
    }
  }, [selectedParent]);

  useEffect(() => {
    if (selectedMiddle) {
      CategoryService.getSubcategories(selectedParent, selectedMiddle).then(
        (subs) => {
          const parsed =
            Array.isArray(subs) && typeof subs[0] === "object"
              ? subs.map((s) => s.subcategory)
              : subs;
          setSubCategories(parsed || []);
        }
      );
    }
  }, [selectedMiddle]);

  const toggleItem = (item) => {
    setSelectedItems((prev) =>
      prev.includes(item) ? prev.filter((s) => s !== item) : [...prev, item]
    );
  };

  const handleTabChange = (_, newValue) => setTab(newValue);

  const handleItemClick = (item) => {
    if (tab === 0) {
      setSelectedParent(item);
      setTab(1);
      toggleItem(item);
    } else if (tab === 1) {
      setSelectedMiddle(item);
      setTab(2);
      toggleItem(item);
    } else {
      toggleItem(item);
    }
  };

  const handleComplete = () => {
    const categoryArray = Array.isArray(selectedItems)
      ? selectedItems
      : [selectedItems];
    onSelect(categoryArray.filter(Boolean));
    onClose();
  };

  const handleReset = () => {
    setSelectedItems([]);
    setSelectedParent("");
    setSelectedMiddle("");
    setTab(0);
  };

  const items =
    tab === 0 ? parentCategories : tab === 1 ? middleCategories : subCategories;

  return (
    <Dialog open={open} onClose={onClose} fullScreen>
      <Box
        height="100vh"
        bgcolor="#fefefe"
        display="flex"
        flexDirection="column"
        px={1.5}
        pt={3}
        pb={2}
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
            카테고리 선택
          </Typography>
          <Box width={40} />
        </Box>

        <Tabs value={tab} onChange={handleTabChange} variant="fullWidth">
          <Tab label="대분류" />
          <Tab label="중분류" disabled={!selectedParent} />
          <Tab label="소분류" disabled={!selectedMiddle} />
        </Tabs>

        {/* 리스트 */}
        <Box
          flex={1}
          overflow="auto"
          py={2}
          sx={{
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
          {items.map((item) => {
            const isSelected = selectedItems.includes(item);
            return (
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
                  color: isSelected ? "var(--primary-100)" : "var(--text-300)",
                  fontWeight: 500,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  "&:hover": {
                    backgroundColor: "var(--bg-200)",
                  },
                }}
              >
                <Typography>{item}</Typography>
                {isSelected && <CheckIcon sx={{ fontSize: 16 }} />}
              </Box>
            );
          })}
        </Box>

        {/* 선택된 항목 */}
        {selectedItems.length > 0 && (
          <Box mt={2} px={2}>
            <Typography fontSize={14} fontWeight={500} mb={1}>
              선택된 항목
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {selectedItems.map((item) => (
                <Chip
                  key={item}
                  label={item}
                  onDelete={() => toggleItem(item)}
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
        <Box px={2} display="flex" gap={1} mt={3}>
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
              color: "var(--bg-100)",
            }}
          >
            선택 완료
          </GradientButton>
        </Box>
      </Box>
    </Dialog>
  );
}
