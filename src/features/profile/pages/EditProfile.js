import { TextField, Button, Box, Typography, Avatar, CircularProgress, Alert, Divider, Grid, Card, CardContent, Dialog, DialogContent, IconButton, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { useState, useEffect } from 'react';
import { userProfile, userUpdate } from '../../../services/userService';
import { useNavigate } from 'react-router-dom';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { getUploadSignature } from '../../../services/authService';
import { uploadToCloudinary } from '../../../services/cloudinaryService';

import { GOLD, GOLD_BG, GOLD_DARK, TEXT_DARK, TEXT_MID } from "../../../theme/tokens";
export default function EditProfile({ onSuccess, onCancelBtn, isDialog, open, onClose }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    userName: '', country: '', bloodType: '', medicalHistory: '', shiftStart: '', shiftEnd: '', imagePath: ''
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await userProfile();
        const user = res.user;
        setForm({
          userName: user.UserName || '',
          country: user.Country || '',
          bloodType: user.BloodType || '',
          medicalHistory: user.MedicalHistory || '',
          shiftStart: user.ShiftStart || '',
          shiftEnd: user.ShiftEnd || '',
          imagePath: user.ImagePath || ''
        });
        setRoles(res.role || []);
      } catch (err) {
        setError('Could not load your profile data.');
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      let imageUrl = form.imagePath;

      // 1. Upload to Cloudinary if a new image is selected
      if (image) {
        const signatureResponse = await getUploadSignature("clinic_app_images");
        imageUrl = await uploadToCloudinary(image, signatureResponse.data);
      }

      // 2. Prepare the update payload (JSON)
      const updateData = {
        UserName: form.userName,
        Country: form.country,
        ImagePath: imageUrl
      };

      if (roles.includes("Patient")) {
        if (form.bloodType) updateData.BloodType = form.bloodType;
        if (form.medicalHistory) updateData.MedicalHistory = form.medicalHistory;
      }

      if (roles.includes("Receptionist")) {
        if (form.shiftStart) updateData.ShiftStart = form.shiftStart;
        if (form.shiftEnd) updateData.ShiftEnd = form.shiftEnd;
      }

      // 3. Send the update request
      const res = await userUpdate(updateData);
      
      if (res.status === 200) {
        if (onClose) onClose();
        else if (onSuccess) onSuccess();
        else navigate('/profile');
      }
    } catch (err) {
      setError(err.message || 'Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelClick = () => {
    if (onClose) onClose();
    else if (onCancelBtn) onCancelBtn();
    else navigate('/profile');
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 3,
      bgcolor: "white",
      "&.Mui-focused fieldset": { borderColor: GOLD, borderWidth: "2px" },
      "&:hover fieldset": { borderColor: `${GOLD}80` },
      transition: "all 0.2s ease",
      boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
    },
    "& .MuiInputLabel-root.Mui-focused": { color: GOLD_DARK },
  };

  if (loading) {
    const Loader = (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: isDialog ? "30vh" : 400, gap: 2 }}>
        <CircularProgress sx={{ color: GOLD, mb: 2 }} size={30} />
        <Typography sx={{ color: TEXT_MID, fontWeight: 600 }}>Loading Form...</Typography>
      </Box>
    );
    if (isDialog) {
      return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
          <DialogContent>{Loader}</DialogContent>
        </Dialog>
      );
    }
    return (
      <Card elevation={0} sx={{ borderRadius: 5, width: '100%', border: `1px solid rgba(184,151,42,0.15)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
        <CircularProgress sx={{ color: GOLD, mb: 2 }} size={30} />
        <Typography sx={{ color: TEXT_MID, fontWeight: 600 }}>Loading Form...</Typography>
      </Card>
    );
  }

  const formContent = (
    <Card
      elevation={0}
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{
        borderRadius: isDialog ? 0 : 5, width: '100%',
        border: isDialog ? 'none' : `1.5px solid ${GOLD}`,
        boxShadow: isDialog ? 'none' : `0 12px 40px rgba(184,151,42,0.15)`,
        fontFamily: "'Inter', sans-serif",
        display: "flex", flexDirection: "column",
        background: "#fff",
        overflowY: "scroll"
      }}
    >
      <Box sx={{ borderBottom: `1px solid rgba(184,151,42,0.15)`, bgcolor: "#fdf8ec", px: { xs: 3, sm: 4 }, py: 3, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{ width: 40, height: 40, borderRadius: 3, background: `linear-gradient(135deg, ${GOLD}, #96791e)`, display: "flex", alignItems: "center", justifyContent: "center", color: 'white', boxShadow: `0 4px 12px ${GOLD}40` }}>
            <SettingsOutlinedIcon size={18} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: TEXT_DARK, letterSpacing: "-0.5px", fontSize: "1.2rem" }}>
            Update Profile
          </Typography>
        </Box>
        {isDialog && (
          <IconButton onClick={onClose} sx={{ color: TEXT_MID }}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      <CardContent sx={{ p: { xs: 3, sm: 4 }, flexGrow: 1, bgcolor: "#f9f8f5", display: "flex", flexDirection: "column", gap: 3 }}>
        {error && <Alert severity="error" sx={{ borderRadius: 3 }}>{error}</Alert>}

        {/* Picture Upload List Item */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 2, bgcolor: "white", borderRadius: 4, border: `1px dashed ${GOLD}60` }}>
          <Avatar
            src={imagePreview || form.imagePath}
            sx={{ width: 60, height: 60, border: `2px solid ${GOLD_BG}`, bgcolor: GOLD_BG, color: GOLD }}
          >
            {!imagePreview && !form.imagePath && <PersonOutlineIcon sx={{ fontSize: 32 }} />}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontWeight: 700, color: TEXT_DARK, fontSize: "0.85rem", mb: 0.5 }}>Account Image</Typography>
            <Button
              component="label"
              startIcon={<PhotoCamera fontSize="small" />}
              sx={{
                borderRadius: 50, px: 2, py: 0.5, color: GOLD_DARK, fontWeight: 700, textTransform: "none", fontSize: "0.75rem",
                border: `1px solid ${GOLD}50`, bgcolor: "transparent",
                "&:hover": { bgcolor: GOLD_BG, borderColor: GOLD }
              }}
            >
              Choose file
              <input type="file" hidden accept="image/*" onChange={handleImageChange} />
            </Button>
          </Box>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography sx={{ fontWeight: 600, color: TEXT_DARK, fontSize: "0.85rem" }}>Full Name <span style={{ color: '#d32f2f' }}>*</span></Typography>
          <TextField fullWidth name="userName" placeholder="e.g. Dr. Sarah Smith" value={form.userName} onChange={handleChange} required sx={inputSx} size="small" />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography sx={{ fontWeight: 600, color: TEXT_DARK, fontSize: "0.85rem" }}>Country</Typography>
          <TextField fullWidth name="country" placeholder="e.g. Egypt" value={form.country} onChange={handleChange} sx={inputSx} size="small" />
        </Box>

        {/* Role-Specific List Items */}
        {roles.includes('Patient') && (
          <>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography sx={{ fontWeight: 600, color: TEXT_DARK, fontSize: "0.85rem" }}>Blood Type</Typography>
              <FormControl fullWidth size="small" sx={inputSx}>
                <Select
                  name="bloodType"
                  value={form.bloodType}
                  onChange={handleChange}
                  displayEmpty
                  sx={{ borderRadius: 3, bgcolor: "white" }}
                >
                  <MenuItem value="" disabled><em>Select blood type</em></MenuItem>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((t) => (
                    <MenuItem key={t} value={t}>{t}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography sx={{ fontWeight: 600, color: TEXT_DARK, fontSize: "0.85rem" }}>Medical History</Typography>
              <TextField fullWidth name="medicalHistory" placeholder="Relevant medical history..." value={form.medicalHistory} onChange={handleChange} multiline rows={3} sx={inputSx} size="small" />
            </Box>
          </>
        )}

        {roles.includes('Receptionist') && (
          <Box sx={{ display: "flex", gap: 2 }}>
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography sx={{ fontWeight: 600, color: TEXT_DARK, fontSize: "0.85rem" }}>Shift Start</Typography>
              <TextField fullWidth name="shiftStart" type="time" value={form.shiftStart} onChange={handleChange} sx={inputSx} size="small" />
            </Box>
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography sx={{ fontWeight: 600, color: TEXT_DARK, fontSize: "0.85rem" }}>Shift End</Typography>
              <TextField fullWidth name="shiftEnd" type="time" value={form.shiftEnd} onChange={handleChange} sx={inputSx} size="small" />
            </Box>
          </Box>
        )}

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: "auto", pt: 3, borderTop: `1px solid rgba(184,151,42,0.15)` }}>
          <Button
            onClick={handleCancelClick}
            disabled={saving}
            sx={{ color: TEXT_MID, fontWeight: 700, px: 3, borderRadius: 50, textTransform: "none", "&:hover": { bgcolor: "white", color: TEXT_DARK } }}
          >
            Cancel
          </Button>
          <Button
            type="submit" disabled={saving}
            sx={{
              px: 3, py: 1, borderRadius: 50, fontWeight: 800, fontSize: "0.85rem", textTransform: "none",
              background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`, color: "white",
              boxShadow: `0 4px 14px ${GOLD}66`,
              "&:hover:not(:disabled)": { background: GOLD_DARK, transform: "translateY(-1px)", boxShadow: `0 6px 20px ${GOLD}80` }
            }}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>

      </CardContent>
    </Card>
  );

  if (isDialog) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4, bgcolor: "#f9f8f5" } }}>
        {formContent}
      </Dialog>
    );
  }

  return formContent;
}
