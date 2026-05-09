import React from "react";
import { Box, Pagination } from "@mui/material";

import { GOLD, GOLD_BG, GOLD_DARK } from "../../../theme/tokens";
export default function NotificationsPagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
      <Pagination
        count={totalPages}
        page={page}
        onChange={onChange}
        shape="rounded"
        showFirstButton
        showLastButton
        sx={{
          "& .MuiPaginationItem-root": {
            color: "#4a4a6a",
            fontWeight: 600,
            borderRadius: 2,
            transition: "all 0.2s",
            border: "1px solid transparent",
          },
          "& .MuiPaginationItem-root.Mui-selected": {
            background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`,
            color: "white",
            fontWeight: 700,
            boxShadow: `0 4px 12px ${GOLD}40`,
            border: "none",
            "&:hover": { background: GOLD_DARK },
          },
          "& .MuiPaginationItem-root:not(.Mui-selected):hover": {
            backgroundColor: GOLD_BG,
            borderColor: `${GOLD}40`,
            color: GOLD_DARK,
          },
        }}
      />
    </Box>
  );
}
