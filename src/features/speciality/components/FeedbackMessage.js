import React from "react";
import { Alert } from "@mui/material";

const FeedbackMessage = ({ successMsg, errorMsg }) => {
  if (!successMsg && !errorMsg) return null;

  return (
    <>
      {successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}
      {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}
    </>
  );
};

export default FeedbackMessage;
