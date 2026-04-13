import React from "react";
import { Box, Pagination } from "@mui/material";

export default function NotificationsPagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
      <Pagination
        id="notifications-pagination"
        count={totalPages}
        page={page}
        onChange={onChange}
        color="primary"
        shape="rounded"
        showFirstButton
        showLastButton
        sx={{
          "& .MuiPaginationItem-root": {
            color: "#000000",
            borderColor: "#000000",
          },
          "& .MuiPaginationItem-root.Mui-selected": {
            background: "linear-gradient(135deg, #1976d2, #42a5f5)",
            color: "white",
            fontWeight: 700,
          },
          "& .MuiPaginationItem-root:hover": {
            backgroundColor: "rgba(25,118,210,0.15)",
          },
        }}
      />
    </Box>
  );
}
