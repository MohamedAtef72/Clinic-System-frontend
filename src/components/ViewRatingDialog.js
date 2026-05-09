import React, { useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Box, Typography, CircularProgress, Alert, Stack,Rating, Button} from "@mui/material";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import { getRateByAppointmentId } from '../services/ratingService';

import { GOLD, GOLD_BG, GOLD_DARK, TEXT_DARK, TEXT_MID } from "../theme/tokens";
/* ── Tokens ── */
export default function ViewRatingDialog({ open, onClose, appointmentId }) {
  const [rateLoading, setRateLoading] = useState(false);
  const [ratingDetails, setRatingDetails] = useState(null);

  useEffect(() => {
    if (open && appointmentId) {
      const fetchRate = async () => {
        setRateLoading(true);
        try {
          const res = await getRateByAppointmentId(appointmentId);
          setRatingDetails(res.data || null);
        } catch (error) {
          setRatingDetails(null);
        } finally {
          setRateLoading(false);
        }
      };
      fetchRate();
    } else {
      setRatingDetails(null);
    }
  }, [open, appointmentId]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          border: `1px solid ${GOLD}22`,
          boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
        },
      }}
    >
      {/* Title */}
      <DialogTitle
        sx={{
          borderBottom: `1px solid ${GOLD}20`,
          bgcolor: GOLD_BG,
          display: "flex", alignItems: "center", gap: 1.5,
          py: 2, px: 3,
        }}
      >
        <StarRoundedIcon sx={{ color: GOLD, fontSize: 22 }} />
        <Typography fontWeight={700} fontSize="1rem" color={TEXT_DARK}>
          Appointment Rating
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 3, overflowX: "hidden" }}>
        {rateLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress sx={{ color: GOLD }} size={36} />
          </Box>
        ) : ratingDetails ? (
          <Stack spacing={3} alignItems="center" sx={{ width: "100%", overflowX: "hidden" }}>
            {/* Stars */}
            <Box sx={{ textAlign: "center" }}>
              <Typography sx={{ fontSize: "0.72rem", fontWeight: 700, color: TEXT_MID, textTransform: "uppercase", letterSpacing: 1, mb: 1 }}>
                Patient Rating
              </Typography>
              <Rating
                value={ratingDetails.rate || 0}
                readOnly
                size="large"
                precision={0.5}
                sx={{ "& .MuiRating-iconFilled": { color: GOLD }, "& .MuiRating-iconHalf": { color: GOLD }, fontSize: "3rem" }}
              />
              <Typography sx={{ mt: 0.5, fontWeight: 700, color: GOLD_DARK, fontSize: "1.2rem" }}>
                {ratingDetails.rate || 0} / 5
              </Typography>
            </Box>

            {/* Comment */}
            <Box sx={{ width: "100%" }}>
              <Typography sx={{ fontSize: "0.72rem", fontWeight: 700, color: TEXT_MID, textTransform: "uppercase", letterSpacing: 1, mb: 1.5 }}>
                Comment
              </Typography>
              <Box
                sx={{
                  p: 2.5, borderRadius: 2.5,
                  bgcolor: GOLD_BG, border: `1px solid ${GOLD}25`,
                  position: "relative",
                  width: "100%", boxSizing: "border-box", overflowX: "hidden"
                }}
              >
                <FormatQuoteIcon sx={{ color: `${GOLD}60`, fontSize: 28, position: "absolute", top: 8, left: 10 }} />
                <Typography
                  sx={{
                    fontSize: "0.95rem",
                    lineHeight: 1.7,
                    pl: 3,
                    fontStyle: !ratingDetails.comment ? "italic" : "normal",
                    color: !ratingDetails.comment ? TEXT_MID : TEXT_DARK,
                    wordBreak: "break-word", overflowWrap: "anywhere"
                  }}
                >
                  {ratingDetails.comment || "No comment provided."}
                </Typography>
              </Box>
            </Box>
          </Stack>
        ) : (
          <Alert severity="info" sx={{ borderRadius: 2 }}>
            No rating data is available for this appointment.
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2.5, borderTop: `1px solid ${GOLD}15` }}>
        <Button
          onClick={onClose}
          sx={{
            borderRadius: 50, px: 3, py: 1, fontWeight: 700,
            fontSize: "0.88rem", textTransform: "none",
            background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`,
            color: "white",
            boxShadow: `0 4px 14px ${GOLD}40`,
            "&:hover": { background: GOLD_DARK, transform: "translateY(-1px)" },
            transition: "all 0.22s",
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
