import { Box, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ApplicationItem from "./ApplicationItem";
import ApplicationItemSkeleton from "./ApplicationItemSkeleton";
import useInquiryStore from "../../../../store/useInquiryStore";
import { getLectureApplicants } from "../../../../lib/api/inquiryApi";
import MoreButton from "../../MoreButton";
import CustomToast from "../../../common/CustomToast";

export default function ApplicationsList() {
  const {
    applicants,
    applicantsLoading,
    setApplicants,
    setApplicantsLoading,
    setApplicantsError,
  } = useInquiryStore();

  const [isExpanded, setIsExpanded] = useState(false);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastIcon, setToastIcon] = useState(null);
  const [toastType, setToastType] = useState("info");

  const showToast = (message, icon = null, type = "info") => {
    setToastMessage(message);
    setToastIcon(icon);
    setToastType(type);
    setToastOpen(true);
  };

  useEffect(() => {
    const fetchApplicants = async () => {
      setApplicantsLoading(true);
      try {
        const data = await getLectureApplicants();
        setApplicants(data);
      } catch (err) {
        console.error("신청자 조회 실패:", err);
        setApplicantsError(err);
      } finally {
        setApplicantsLoading(false);
      }
    };
    fetchApplicants();
  }, [setApplicants, setApplicantsLoading, setApplicantsError]);

  const displayedApplicants = isExpanded ? applicants : applicants.slice(0, 4);

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Stack spacing={2} pb={3}>
        {applicantsLoading ? (
          Array(4)
            .fill(null)
            .map((_, i) => <ApplicationItemSkeleton key={i} />)
        ) : applicants.length > 0 ? (
          <>
            {displayedApplicants.map((item) => (
              <ApplicationItem
                key={item.applicationId}
                data={item}
                showToast={showToast}
              />
            ))}

            {applicants.length > 4 && (
              <MoreButton isExpanded={isExpanded} onClick={handleToggle} />
            )}
          </>
        ) : (
          <Box
            sx={{
              py: 3,
              backgroundColor: "var(--bg-100)",
              borderRadius: 1,
              textAlign: "center",
            }}
          >
            <Typography variant="body1" color="var(--text-300)">
              아직 신청자가 없어요
            </Typography>
          </Box>
        )}
      </Stack>

      <CustomToast
        open={toastOpen}
        onClose={() => setToastOpen(false)}
        message={toastMessage}
        iconSrc={toastIcon}
        type={toastType}
      />
    </Box>
  );
}
