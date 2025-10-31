import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { TextField,Button,Typography,Box,CircularProgress,Alert,Select,MenuItem,FormControl,InputLabel,IconButton,InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { patientRegister } from "../../../services/authService";

// Define a validation schema using Yup to match the Patient DTO
const validationSchema = yup.object({
    userName: yup.string().required("Username is required"),
    email: yup
        .string()
        .email("Enter a valid email")
        .required("Email is required"),
password: yup
    .string()
    // Rule: options.Password.RequiredLength = 8;
    .min(8, "Password must be at least 8 characters")
    
    // Rule: options.Password.RequireLowercase = true;
    .matches(
        /[a-z]/,
        "Password must contain at least one lowercase letter"
    )

    // Rule: options.Password.RequireUppercase = true;
    .matches(
        /[A-Z]/,
        "Password must contain at least one uppercase letter"
    )

    // Rule: options.Password.RequireDigit = true;
    .matches(
        /[0-9]/, // or /\d/
        "Password must contain at least one number"
    )

    // Rule: options.Password.RequireNonAlphanumeric = true;
    .matches(
        /[^A-Za-z0-9]/, // Matches any character that is NOT a letter or a number
        "Password must contain at least one special character"
    )

    // Finally, the field is required
    .required("Password is required"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password'), null], 'Passwords must match')
        .required("Confirm Password is required"),
    phoneNumber: yup.string()
    .matches(/^[0-9]+$/, "Phone Number must contain only numbers")
    .min(11, "Phone Number must be at least 11 characters")
    .required("Phone Number is required"),    country: yup.string().required("Country is required"),
    gender: yup.string().required("Gender is required"),
    dateOfBirth: yup.date()
        .required("Date of Birth is required")
        .max(new Date(), "Date of birth cannot be in the future"),
    bloodType: yup.string().required("Blood Type is required"),
    medicalHistory: yup.string().required("Medical History is required"),
    image: yup
        .mixed()
        .test("fileSize", "The file is too large (max 5MB)", (value) => {
            if (!value || value.length === 0) return true; // Optional image
            return value[0].size <= 5242880; // 5MB
        })
        .test("fileType", "Unsupported file format", (value) => {
            if (!value || value.length === 0) return true; // Optional image
            return ["image/jpeg", "image/png", "image/gif"].includes(value[0].type);
        }),
});

export default function PatientRegister() {
    const [serverError, setServerError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    // The function to handle form submission
    const onSubmit = async (data) => {
        const formData = new FormData();

        // Append all the fields from the form to the FormData object
        formData.append('UserName', data.userName);
        formData.append('Email', data.email);
        formData.append('Password', data.password);
        formData.append('ConfirmPassword', data.confirmPassword);
        formData.append('PhoneNumber', data.phoneNumber);
        formData.append('Country', data.country);
        formData.append('Gender', data.gender);
        formData.append('DateOfBirth', data.dateOfBirth.toISOString().split('T')[0]);
        formData.append('BloodType', data.bloodType);
        formData.append('MedicalHistory', data.medicalHistory);

        // Append the image file only if it has been selected
        if (data.image && data.image.length > 0) {
            formData.append('Image', data.image[0]);
        }

        try {
            setServerError(""); // Clear previous errors
            const response = await patientRegister(formData);
            console.log(response.message);
            // Redirect to a login page or dashboard on success
            navigate("/login");
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || "Registration failed. Please try again.";
            setServerError(errorMessage);
            console.error(error);
        }
    };

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <Box sx={{ maxWidth: 500, mx: "auto", mt: 5, mb: 5, p: 3, boxShadow: 3, borderRadius: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
                Patient Registration
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                {serverError && <Alert severity="error" sx={{ mb: 2 }}>{serverError}</Alert>}
                
                <TextField
                    label="Username"
                    fullWidth
                    margin="normal"
                    required
                    {...register("userName")}
                    error={!!errors.userName}
                    helperText={errors.userName?.message}
                    autoFocus
                />

                <TextField
                    label="Email Address"
                    type="email"
                    fullWidth
                    margin="normal"
                    required
                    {...register("email")}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                />

                <TextField
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    fullWidth
                    margin="normal"
                    required
                    {...register("password")}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />
                
                <TextField
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    fullWidth
                    margin="normal"
                    required
                    {...register("confirmPassword")}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle confirm password visibility"
                                    onClick={handleClickShowConfirmPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />

                <TextField
                    label="Phone Number"
                    fullWidth
                    margin="normal"
                    required
                    {...register("phoneNumber")}
                    error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber?.message}
                />

                <TextField
                    label="Country"
                    fullWidth
                    margin="normal"
                    required
                    {...register("country")}
                    error={!!errors.country}
                    helperText={errors.country?.message}
                />
                
                <FormControl fullWidth margin="normal" required error={!!errors.gender}>
                    <InputLabel id="gender-select-label">Gender</InputLabel>
                    <Select
                        labelId="gender-select-label"
                        label="Gender"
                        defaultValue=""
                        {...register("gender")}
                    >
                        <MenuItem value={"Male"}>Male</MenuItem>
                        <MenuItem value={"Female"}>Female</MenuItem>
                        <MenuItem value={"Other"}>Other</MenuItem>
                    </Select>
                     {errors.gender && <Typography color="error" variant="caption">{errors.gender.message}</Typography>}
                </FormControl>

                <TextField
                    label="Date of Birth"
                    type="date"
                    fullWidth
                    margin="normal"
                    required
                    InputLabelProps={{ shrink: true }}
                    {...register("dateOfBirth")}
                    error={!!errors.dateOfBirth}
                    helperText={errors.dateOfBirth?.message}
                />

                <FormControl fullWidth margin="normal" required error={!!errors.bloodType}>
                    <InputLabel id="blood-type-label">Blood Type</InputLabel>
                    <Select
                        labelId="blood-type-label"
                        label="Blood Type"
                        defaultValue=""
                        {...register("bloodType")}
                    >
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => (
                            <MenuItem key={type} value={type}>{type}</MenuItem>
                        ))}
                    </Select>
                    {errors.bloodType && <Typography color="error" variant="caption">{errors.bloodType.message}</Typography>}
                </FormControl>

                <TextField
                    label="Medical History"
                    fullWidth
                    margin="normal"
                    required
                    multiline
                    rows={4}
                    placeholder="Please describe any relevant medical history, allergies, or current conditions."
                    {...register("medicalHistory")}
                    error={!!errors.medicalHistory}
                    helperText={errors.medicalHistory?.message}
                />

                <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    sx={{ mt: 2, mb: 1 }}
                >
                    Upload Profile Image (Optional)
                    <input
                        type="file"
                        hidden
                        accept="image/*"
                        {...register("image")}
                    />
                </Button>
                {errors.image && <Alert severity="error">{errors.image.message}</Alert>}

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={isSubmitting}
                    sx={{ mt: 2, py: 1.5, fontSize: '1.1rem' }}
                >
                    {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Create Account"}
                </Button>
            </form>
        </Box>
    );
}
