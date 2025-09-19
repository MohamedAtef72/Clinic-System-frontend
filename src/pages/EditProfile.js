import { TextField, Button, Box, Typography, Avatar, Container, Paper, CircularProgress, Alert } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { useState, useEffect } from 'react';
import { userProfile, userUpdate } from '../services/authService';
import { useNavigate } from 'react-router-dom';

export default function EditProfile() {
  const navigate = useNavigate();

  // --- STATE ---
  const [form, setForm] = useState({
    userName: '',
    country: '',
    medicalHistory: '',
    shiftStart: '',
    shiftEnd: '',
    imagePath: ''
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [roles, setRoles] = useState([]);

  // --- FETCH USER ---
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await userProfile();
        const user = res.user;

        setForm({
          userName: user.userName || '',
          country: user.country || '',
          medicalHistory: user.medicalHistory || '',
          shiftStart: user.shiftStart || '',
          shiftEnd: user.shiftEnd || '',
          imagePath: user.imagePath || ''
        });

        setRoles(res.role || []);
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
        setError('Could not load your profile data.');
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  // --- HANDLERS ---
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const formData = new FormData();
    formData.append('userName', form.userName);
    formData.append('country', form.country);
    if (form.medicalHistory) formData.append('medicalHistory', form.medicalHistory);
    if (form.shiftStart) formData.append('shiftStart', form.shiftStart);
    if (form.shiftEnd) formData.append('shiftEnd', form.shiftEnd);
    if (image) {
    formData.append("Image", image);
    }
    try {
      const res = await userUpdate(formData);
      if (res.status === 200) {
        navigate('/profile');
      }
    } catch (err) {
      console.error('Update failed:', err);
      setError('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // --- LOADING ---
  if (loading) {
    return (
      <Container component="main" maxWidth="sm" sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" textAlign="center" gutterBottom>
            Loading Profile...
          </Typography>
          <CircularProgress sx={{ display: 'block', mx: 'auto' }} />
        </Paper>
      </Container>
    );
  }

  // --- RENDER ---
  return (
    <Container component="main" maxWidth="sm" sx={{ my: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 } }}>
        <Typography component="h1" variant="h5" textAlign="center">
          Edit Your Profile
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar
              src={imagePreview || (form.imagePath)}
              sx={{ width: 150, height: 150, border: '2px solid', borderColor: 'divider' }}
            />
            <Button
              variant="outlined"
              component="label"
              startIcon={<PhotoCamera />}
            >
              Change Picture
              <input type="file" hidden accept="image/*" onChange={handleImageChange} />
            </Button>
          </Box>

          {error && <Alert severity="error">{error}</Alert>}

          <TextField fullWidth name="userName" label="Name" value={form.userName} onChange={handleChange} required />
          <TextField fullWidth name="country" label="Country" value={form.country} onChange={handleChange} />

        { roles.includes('Patient') &&
          <TextField
            fullWidth
            name="medicalHistory"
            label="Medical History"
            value={form.medicalHistory}
            onChange={handleChange}
            multiline
            rows={3}
          />
        }

        { roles.includes('Receptionist') &&
          <>
            <TextField
                fullWidth
                name="shiftStart"
                label="Shift Start"
                type="time"
                value={form.shiftStart}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
            />

            <TextField
                fullWidth
                name="shiftEnd"
                label="Shift End"
                type="time"
                value={form.shiftEnd}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
            />
          </>}

          <Button type="submit" fullWidth variant="contained" disabled={saving} sx={{ mt: 2, py: 1.5 }}>
            {saving ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
