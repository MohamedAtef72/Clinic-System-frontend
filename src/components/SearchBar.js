import { TextField, InputAdornment, Box, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

import { GOLD } from "../theme/tokens";
export default function SearchBar({ searchTerm, setSearchTerm, placeholder = "Search by name…" }) {
  return (
    <Box sx={{ mb: 2.5 }}>
      <TextField
        variant="outlined"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: GOLD, fontSize: 20 }} />
            </InputAdornment>
          ),
          endAdornment: searchTerm ? (
            <InputAdornment position="end">
              <IconButton size="small" onClick={() => setSearchTerm("")} sx={{ color: "#aaa", "&:hover": { color: GOLD } }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : null,
        }}
        sx={{
          maxWidth: 700,
          mx: "auto",
          display: "block",
          "& .MuiOutlinedInput-root": {
            borderRadius: 50,
            bgcolor: "#fafafa",
            fontSize: "0.92rem",
            transition: "all 0.25s",
            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: GOLD },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: GOLD,
              borderWidth: 2,
              boxShadow: `0 0 0 3px ${GOLD}18`,
            },
          },
          "& .MuiInputLabel-root.Mui-focused": { color: GOLD },
          "& .MuiOutlinedInput-input::placeholder": { color: "#aaa", opacity: 1 },
        }}
      />
    </Box>
  );
}
