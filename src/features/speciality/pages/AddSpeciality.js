import React, { useState } from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import SpecialityForm from "../components/SpecialityForm";
import FeedbackMessage from "../components/FeedbackMessage";
import { addSpeciality } from "../../../services/authService";

const AddSpeciality = () => {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleAddSpeciality = async (name) => {
    setSuccessMsg("");
    setErrorMsg("");

    if (!name.trim()) {
      setErrorMsg("Speciality name is required");
      return;
    }

    try {
      setLoading(true);
      const model = {
        Name: name
      }
      await addSpeciality(model);
      setSuccessMsg("Speciality added successfully!");
    } catch (error) {
      console.error(error);
      setErrorMsg(error.response?.data?.message || "Failed to add speciality");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="90vh" bgcolor="#f4f6f8">
      <Card sx={{ width: 400, boxShadow: 4, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" textAlign="center" mb={3}>
            Add New Speciality
          </Typography>

          <FeedbackMessage successMsg={successMsg} errorMsg={errorMsg} />

          <SpecialityForm onSubmit={handleAddSpeciality} loading={loading} />
        </CardContent>
      </Card>
    </Box>
  );
};

export default AddSpeciality;
