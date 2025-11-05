import React, { useState } from "react";
import { TextField, Button, CircularProgress } from "@mui/material";

const SpecialityForm = ({ onSubmit, loading }) => {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(name);
    setName("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Speciality Name"
        variant="outlined"
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
        sx={{ mb: 3 }}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={loading}
        sx={{ height: 45 }}
      >
        {loading ? <CircularProgress size={25} sx={{ color: "white" }} /> : "Add Speciality"}
      </Button>
    </form>
  );
};

export default SpecialityForm;
