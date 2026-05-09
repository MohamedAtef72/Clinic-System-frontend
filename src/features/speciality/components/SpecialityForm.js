import React, { useState } from "react";
import { Box, TextField, Button, CircularProgress, InputAdornment } from "@mui/material";
import BiotechIcon from "@mui/icons-material/Biotech";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import { GOLD, GOLD_DARK } from "../../../theme/tokens";
const SpecialityForm = ({ onSubmit, loading }) => {
    const [name, setName] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            onSubmit(name);
            setName("");
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate>
            <style>{`
                .gold-input .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline { border-color:${GOLD} !important; }
                .gold-input .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline { border-color:${GOLD} !important; border-width:2px !important; }
                .gold-input .MuiInputLabel-root.Mui-focused { color:${GOLD} !important; }
            `}</style>

            <TextField
                className="gold-input"
                label="Speciality Name"
                variant="outlined"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <BiotechIcon sx={{ color: GOLD, fontSize: 22 }} />
                        </InputAdornment>
                    ),
                }}
                sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": { borderRadius: 2.5, bgcolor: "#fafafa" },
                }}
            />
            <Button
                type="submit"
                fullWidth
                disabled={loading || !name.trim()}
                startIcon={!loading && <AddCircleOutlineIcon />}
                sx={{
                    height: 54,
                    borderRadius: 50,
                    fontWeight: 700,
                    fontSize: "1.05rem",
                    textTransform: "none",
                    background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`,
                    color: "white",
                    boxShadow: `0 6px 20px ${GOLD}40`,
                    "&:hover:not(:disabled)": {
                        background: GOLD_DARK,
                        transform: "translateY(-2px)",
                        boxShadow: `0 8px 25px ${GOLD}50`
                    },
                    "&:disabled": {
                        background: "rgba(0,0,0,0.08)",
                        color: "rgba(0,0,0,0.25)"
                    },
                    transition: "all 0.25s"
                }}
            >
                {loading ? <CircularProgress size={24} sx={{ color: "rgba(255,255,255,0.8)" }} /> : "Create Speciality"}
            </Button>
        </Box>
    );
};

export default SpecialityForm;
