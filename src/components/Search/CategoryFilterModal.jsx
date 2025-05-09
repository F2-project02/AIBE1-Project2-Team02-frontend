// 📄 src/components/Search/CategoryFilterModal.jsx

import {
  Dialog,
  Box,
  Typography,
  IconButton,
  InputBase,
  Chip,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SearchIcon from "@mui/icons-material/Search";
import CheckIcon from "@mui/icons-material/Check";
import { useEffect, useState } from "react";
import { CategoryService } from "../../lib/api/categoryApi";
import GradientButton from "../Button/GradientButton";

export default function CategoryFilterModal({ open, onClose, onSelect }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedParent, setSelectedParent] = useState("");
  const [selectedMiddle, setSelectedMiddle] = useState("");

  const [parentCategories, setParentCategories] = useState([]);
  const [middleCategories, setMiddleCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (open) {
      CategoryService.getParentCategories().then(setParentCategories);
      setSearchTerm("");
    }
  }, [open]);

  useEffect(() => {
    if (selectedParent) {
      CategoryService.getMiddleCategories(selectedParent).then(
        setMiddleCategories
      );
    } else {
      setMiddleCategories([]);
    }
    setSelectedMiddle("");
    setSubCategories([]);
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
    } else {
      setSubCategories([]);
    }
  }, [selectedMiddle]);

  const toggleItem = (item) => {
    setSelectedItems((prev) =>
      prev.includes(item) ? prev.filter((s) => s !== item) : [...prev, item]
    );
  };

  const handleDelete = (item) => {
    setSelectedItems((prev) => prev.filter((v) => v !== item));
  };

  const handleReset = () => {
    setSelectedParent("");
    setSelectedMiddle("");
    setSelectedItems([]);
    setSearchTerm("");
  };

  const handleComplete = () => {
    onSelect(selectedItems);
    onClose();
  };

  const filterItems = (items) =>
    searchTerm.trim()
      ? items.filter((item) =>
          item.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : items;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={isMobile}
      fullWidth
      maxWidth="md"
    >
      <Box p={4} height="100vh" bgcolor="#fefefe">
        {/* 상단 영역 */}
        <Box
          position="relative"
          display="flex"
          alignItems="center"
          height={48}
          mb={3}
        >
          {/* 닫기 버튼 */}
          <IconButton
            onClick={onClose}
            sx={{ position: "absolute", right: 0, color: "var(--text-400)" }}
          >
            <CloseIcon />
          </IconButton>

          {/* 가운데 제목 */}
          <Box flex={1} textAlign="center">
            <Typography fontSize={24} fontWeight={600} color="var(--text-100)">
              과목 필터
            </Typography>
          </Box>
        </Box>

        {/* 검색창 */}
        <Box
          display="flex"
          alignItems="center"
          px={1.5}
          py={1}
          bgcolor="var(--bg-200)"
          borderRadius="8px"
          mb={4}
        >
          <InputBase
            placeholder="과목명으로 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            sx={{ color: "var(--text-400)" }}
          />
          <SearchIcon sx={{ color: "var(--text-400)" }} />
        </Box>

        {/* 3단 선택 영역 */}
        <Box
          display={isMobile ? "block" : "flex"}
          height={isMobile ? "auto" : 300}
          gap={2}
        >
          <CategoryColumn
            label="대분류"
            items={filterItems(parentCategories)}
            selected={selectedItems}
            onClick={(item) => {
              setSelectedParent(item);
              toggleItem(item);
            }}
          />
          <CategoryColumn
            label="중분류"
            items={filterItems(middleCategories)}
            selected={selectedItems}
            onClick={(item) => {
              setSelectedMiddle(item);
              toggleItem(item);
            }}
          />
          <CategoryColumn
            label="소분류"
            items={filterItems(subCategories)}
            selected={selectedItems}
            onClick={toggleItem}
          />
        </Box>

        {/* 선택된 항목 */}
        <Box mt={4}>
          <Typography fontWeight={500} fontSize={16} mb={1}>
            선택 항목 {selectedItems.length}
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {selectedItems.map((item) => (
              <Chip
                key={item}
                label={item}
                onDelete={() => handleDelete(item)}
                variant="outlined"
                sx={{
                  borderColor: "var(--primary-100)",
                  color: "var(--primary-100)",
                  fontSize: 13,
                  "& .MuiChip-deleteIcon": {
                    color: "var(--primary-100)",
                    "&:hover": {
                      color: "var(--primary-200)", // hover 시 색상 조정
                    },
                  },
                }}
              />
            ))}
          </Box>
        </Box>

        {/* 하단 버튼 */}
        <Box display="flex" gap={2} mt={4}>
          <Button
            startIcon={<RestartAltIcon />}
            onClick={handleReset}
            sx={{
              border: "1px solid var(--bg-300)",
              height: 52,
              borderRadius: "8px",
              px: 2,
              color: "var(--text-300)",
              whiteSpace: "nowrap",
              "&:hover": {
                backgroundColor: "var(--bg-200)",
              },
            }}
          >
            초기화
          </Button>

          <GradientButton
            onClick={handleComplete}
            sx={{
              flexGrow: 1,
              height: 52,
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: 16,
              color: "#fff",
            }}
          >
            선택 완료
          </GradientButton>
        </Box>
      </Box>
    </Dialog>
  );
}

function CategoryColumn({ label, items, selected, onClick }) {
  return (
    <Box
      flex={1}
      display="flex"
      flexDirection="column"
      gap={1}
      overflow="auto"
      sx={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      <Typography fontWeight={600} fontSize={16} mb={1} pl={1}>
        {label}
      </Typography>
      {items.length === 0 ? (
        <Typography pl={1} color="var(--text-300)"></Typography>
      ) : (
        items.map((item) => {
          const isSelected = selected.includes(item);
          return (
            <Box
              key={item}
              onClick={() => onClick(item)}
              sx={{
                cursor: "pointer",
                px: 3,
                py: 1.5,
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
              <Typography fontSize={16}>{item}</Typography>
              {isSelected && <CheckIcon sx={{ fontSize: 16 }} />}
            </Box>
          );
        })
      )}
    </Box>
  );
}
