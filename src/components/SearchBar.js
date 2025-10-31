import { TextField, InputAdornment , Box } from "@mui/material";
import { Search } from "@mui/icons-material";

export default function SearchBar({ searchTerm, setSearchTerm }) {
  return (
    <Box display="flex" justifyContent="center" sx={{ mb: 2 }}>
      <TextField
        variant="outlined"
        placeholder="Search by name ..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
        sx={{
          width: "100%",       
          maxWidth: 700,
        }}
      />
    </Box>
  );
}
