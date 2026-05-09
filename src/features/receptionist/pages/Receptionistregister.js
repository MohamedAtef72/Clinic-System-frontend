import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
    TextField, Button, Typography, Box, CircularProgress,
    Alert, Select, MenuItem, FormControl, InputLabel, IconButton,
    InputAdornment, LinearProgress, Divider
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import WcOutlinedIcon from "@mui/icons-material/WcOutlined";
import CakeOutlinedIcon from "@mui/icons-material/CakeOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SettingsIcon from "@mui/icons-material/Settings";
import { useNavigate } from "react-router-dom";
import { receptionistRegister, getUploadSignature } from '../../../services/authService';
import { uploadToCloudinary } from "../../../services/cloudinaryService";

import { GOLD, GOLD_BG, GOLD_DARK, GOLD_LIGHT, TEXT_DARK, TEXT_MID } from "../../../theme/tokens";
const BORDER_CLR = "rgba(184,151,42,0.25)";

/* ── Password strength ── */
function getStrength(pwd) {
    if (!pwd) return { score: 0, label: "", color: "transparent" };
    let s = 0;
    if (pwd.length >= 8) s++;
    if (pwd.length >= 12) s++;
    if (/[A-Z]/.test(pwd)) s++;
    if (/[0-9]/.test(pwd)) s++;
    if (/[^A-Za-z0-9]/.test(pwd)) s++;
    if (s <= 1) return { score: 20, label: "Weak", color: "#ef4444" };
    if (s === 2) return { score: 40, label: "Fair", color: "#f59e0b" };
    if (s === 3) return { score: 60, label: "Good", color: GOLD };
    if (s === 4) return { score: 80, label: "Strong", color: "#22c55e" };
    return { score: 100, label: "Very Strong", color: "#16a34a" };
}

/* ── Validation schema ── */
const validationSchema = yup.object({
    userName: yup.string().required("Username is required"),
    email: yup.string().email("Enter a valid email").required("Email is required"),
    password: yup
        .string()
        .min(8, "At least 8 characters")
        .matches(/[a-z]/, "Include at least one lowercase letter")
        .matches(/[A-Z]/, "Include at least one uppercase letter")
        .matches(/[0-9]/, "Include at least one number")
        .matches(/[^A-Za-z0-9]/, "Include at least one special character")
        .required("Password is required"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password"), null], "Passwords must match")
        .required("Confirm password is required"),
    phoneNumber: yup
        .string()
        .matches(/^[0-9]+$/, "Phone number must contain only numbers")
        .min(11, "At least 11 digits required")
        .required("Phone number is required"),
    country: yup.string().required("Country is required"),
    gender: yup.string().required("Gender is required"),
    dateOfBirth: yup
        .date()
        .required("Date of birth is required")
        .max(new Date(), "Cannot be in the future"),
    shiftStart: yup.string().required("Shift start time is required"),
    shiftEnd: yup.string().required("Shift end time is required")
        .test('is-greater', 'End time must be after start time', function (value) {
            const { shiftStart } = this.parent;
            return shiftStart && value && value > shiftStart;
        }),
    image: yup
        .mixed()
        .test("fileSize", "File too large (max 5 MB)", (v) =>
            !v || v.length === 0 ? true : v[0].size <= 5242880
        )
        .test("fileType", "Unsupported format", (v) =>
            !v || v.length === 0 ? true : ["image/jpeg", "image/png", "image/gif"].includes(v[0].type)
        ),
});

/* ── Steps metadata ── */
const STEPS = [
    { label: "Account", icon: <PersonOutlineIcon /> },
    { label: "Personal", icon: <WcOutlinedIcon /> },
    { label: "Operations", icon: <SettingsIcon /> },
];

/* ── Left-panel highlights ── */
const HIGHLIGHTS = [
    { icon: <AccessTimeIcon />, text: "Efficient shift & schedule management" },
    { icon: <SettingsIcon />, text: "Full access to reception dashboard" },
    { icon: <LocalHospitalIcon />, text: "Coordinate patient appointments seamlessly" },
    { icon: <CheckCircleIcon />, text: "Verified clinic administration access" },
];

export default function ReceptionistRegister() {
    const navigate = useNavigate();
    const [serverError, setServerError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [step, setStep] = useState(0);
    const [imageFile, setImageFile] = useState(null);
    const fileInputRef = useRef(null);

    const {
        register,
        handleSubmit,
        trigger,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({ resolver: yupResolver(validationSchema), mode: "onTouched" });

    const { onChange: onImageChange, ref: imageHookRef, ...imageRest } = register("image");

    const passwordValue = watch("password", "");
    const strength = getStrength(passwordValue);

    const STEP_FIELDS = [
        ["userName", "email", "password", "confirmPassword"],
        ["phoneNumber", "country", "gender", "dateOfBirth"],
        ["shiftStart", "shiftEnd"],
    ];

    const goNext = async () => {
        const valid = await trigger(STEP_FIELDS[step]);
        if (valid) setStep((s) => s + 1);
    };

    const onSubmit = async (data) => {
        try {
            setServerError("");
            let imageUrl = null;

            // 1. Fetch signature and upload to Cloudinary if an image is selected
            if (data.image && data.image.length > 0) {
                const signatureResponse = await getUploadSignature("clinic_app_images");
                imageUrl = await uploadToCloudinary(data.image[0], signatureResponse.data);
            }

            // 2. Prepare the registration payload
            const registrationData = {
                UserName: data.userName,
                Email: data.email,
                Password: data.password,
                ConfirmPassword: data.confirmPassword,
                PhoneNumber: data.phoneNumber,
                Country: data.country,
                Gender: data.gender,
                DateOfBirth: data.dateOfBirth.toISOString().split("T")[0],
                ShiftStart: data.shiftStart?.includes(':') && data.shiftStart.split(':').length === 2 ? `${data.shiftStart}:00` : data.shiftStart,
                ShiftEnd: data.shiftEnd?.includes(':') && data.shiftEnd.split(':').length === 2 ? `${data.shiftEnd}:00` : data.shiftEnd,
                ImagePath: imageUrl // Send the secure URL to the backend
            };

            // 3. Send the registration request
            await receptionistRegister(registrationData);
            navigate("/");
        } catch (err) {
            setServerError(err.message || "Registration failed. Please try again.");
            setStep(0);
        }
    };

    const fieldSx = {
        "& .MuiOutlinedInput-root": { borderRadius: 2.5, bgcolor: "#fafafa" },
    };

    return (
        <>
            <style>{`
        @keyframes panelFadeIn { from { opacity:0; transform:translateX(-24px); } to { opacity:1; transform:translateX(0); } }
        @keyframes formFadeIn { from { opacity:0; transform:translateX(24px); } to { opacity:1; transform:translateX(0); } }
        @keyframes stepSlide { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }
        @keyframes shimmerGold { 0%,100% { background-position:0% 50%; } 50% { background-position:100% 50%; } }
        @keyframes floatY { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-8px); } }
        .gold-input .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline { border-color:${GOLD} !important; }
        .gold-input .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline { border-color:${GOLD} !important; border-width:2px !important; }
        .gold-input .MuiInputLabel-root.Mui-focused { color:${GOLD} !important; }
        .gold-select .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline { border-color:${GOLD} !important; }
        .gold-select .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline { border-color:${GOLD} !important; border-width:2px !important; }
        .gold-select .MuiInputLabel-root.Mui-focused { color:${GOLD} !important; }
      `}</style>

            <Box sx={{ overflowX: "hidden", display: "flex", minHeight: "100vh", fontFamily: "'Inter', sans-serif", bgcolor: "#f9f8f5" }}>

                {/* LEFT PANEL */}
                <Box sx={{ display: { xs: "none", md: "flex" }, flexDirection: "column", justifyContent: "space-between", width: "40%", flexShrink: 0, position: "relative", overflow: "hidden", animation: "panelFadeIn 0.7s ease both" }}>
                    <Box sx={{ position: "absolute", inset: 0, backgroundImage: "url('/login_panel_bg.png')", backgroundSize: "cover", backgroundPosition: "center" }} />
                    <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(160deg,rgba(20,18,32,.55) 0%,rgba(20,18,32,.78) 60%,rgba(20,18,32,.94) 100%)" }} />
                    <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,transparent,${GOLD},transparent)` }} />

                    <Box sx={{ position: "relative", zIndex: 1, p: { md: 5, lg: 7 } }}>
                        <Box onClick={() => navigate("/")} sx={{ display: "inline-flex", alignItems: "center", gap: 1.2, cursor: "pointer", mb: 7 }}>
                            <LocalHospitalIcon sx={{ color: GOLD, fontSize: 28 }} />
                            <Box>
                                <Typography sx={{ fontWeight: 800, fontSize: "1rem", color: "white", lineHeight: 1.1 }}>MedClinic</Typography>
                                <Typography sx={{ fontSize: "0.58rem", fontWeight: 600, color: GOLD, letterSpacing: "1.5px", textTransform: "uppercase" }}>Professional Care</Typography>
                            </Box>
                        </Box>

                        <Typography sx={{ fontSize: { md: "1.9rem", lg: "2.4rem" }, fontWeight: 800, color: "white", lineHeight: 1.2, letterSpacing: "-0.5px", mb: 1 }}>Clinic Operations</Typography>
                        <Typography sx={{
                            fontSize: { md: "1.9rem", lg: "2.4rem" }, fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.5px", mb: 3,
                            background: `linear-gradient(90deg,${GOLD},#f0d070,${GOLD})`,
                            backgroundSize: "200%", animation: "shimmerGold 4s ease infinite",
                            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                        }}>Management Center.</Typography>
                        <Typography sx={{ color: "rgba(255,255,255,.6)", fontSize: "0.9rem", lineHeight: 1.7, maxWidth: 320, mb: 5 }}>
                            Register new reception staff to manage patient flow,
                            coordinate schedules, and ensure a smooth hospital experience.
                        </Typography>

                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            {HIGHLIGHTS.map((h, i) => (
                                <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                    <Box sx={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg,${GOLD}33,${GOLD}66)`, border: `1px solid ${GOLD}55`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                        {(() => { const Icon = h.icon.type; return <Icon sx={{ color: GOLD, fontSize: 16 }} />; })()}
                                    </Box>
                                    <Typography sx={{ color: "rgba(255,255,255,.75)", fontSize: "0.84rem" }}>{h.text}</Typography>
                                </Box>
                            ))}
                        </Box>

                        <Box sx={{ mt: 6, p: 2.5, borderRadius: 2.5, bgcolor: `${GOLD}10`, border: `1px solid ${GOLD}25` }}>
                            <Typography sx={{ color: GOLD, fontSize: "0.7rem", fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", mb: 1.5 }}>Staff Registration Progress</Typography>
                            <Box sx={{ display: "flex", gap: 1 }}>
                                {STEPS.map((s, i) => (
                                    <Box key={i} sx={{ flex: 1 }}>
                                        <Box sx={{ height: 4, borderRadius: 2, bgcolor: i <= step ? GOLD : "rgba(255,255,255,.15)", transition: "background 0.4s ease" }} />
                                        <Typography sx={{ color: i <= step ? GOLD : "rgba(255,255,255,.3)", fontSize: "0.65rem", mt: 0.7, fontWeight: 600 }}>{s.label}</Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    </Box>

                    <Box sx={{ position: "relative", zIndex: 1, p: { md: 5, lg: 7 }, pt: 0 }}>
                        <Box sx={{ height: 1, background: `linear-gradient(90deg,transparent,${GOLD}40,transparent)`, mb: 3 }} />
                        <Typography sx={{ color: "rgba(255,255,255,.35)", fontSize: "0.75rem" }}>© 2025 MedClinic Pro. All rights reserved.</Typography>
                    </Box>
                </Box>

                {/* RIGHT PANEL */}
                <Box sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", px: { xs: 3, sm: 5, lg: 8 }, py: 5, animation: "formFadeIn 0.7s 0.1s ease both", overflowY: "auto" }}>
                    <Box onClick={() => navigate("/")} sx={{ display: { xs: "flex", md: "none" }, alignItems: "center", gap: 1, mb: 4, cursor: "pointer" }}>
                        <LocalHospitalIcon sx={{ color: GOLD, fontSize: 26 }} />
                        <Typography sx={{ fontWeight: 800, fontSize: "1.05rem", color: TEXT_DARK }}>MedClinic <span style={{ color: GOLD }}>Pro</span></Typography>
                    </Box>

                    <Box sx={{ width: "100%", maxWidth: 560 }}>
                        <Box sx={{ mb: 4 }}>
                            <Box sx={{ width: 56, height: 56, borderRadius: 3, background: `linear-gradient(135deg,${GOLD_LIGHT},#fdf3d0)`, border: `1.5px solid ${GOLD}40`, display: "flex", alignItems: "center", justifyContent: "center", mb: 2.5, animation: "floatY 4s ease-in-out infinite", boxShadow: `0 8px 24px ${GOLD}25` }}>
                                <SettingsIcon sx={{ color: GOLD, fontSize: 26 }} />
                            </Box>
                            <Typography variant="h4" sx={{ fontWeight: 800, color: TEXT_DARK, letterSpacing: "-0.5px", mb: 0.5 }}>Staff Enrollment</Typography>
                            <Typography sx={{ color: TEXT_MID, fontSize: "0.92rem" }}>Step {step + 1} of {STEPS.length} — {STEPS[step].label} details</Typography>
                        </Box>

                        <Box sx={{ display: "flex", gap: 1, mb: 4 }}>
                            {STEPS.map((s, i) => (
                                <Box key={i} sx={{ flex: 1 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.8 }}>
                                        <Box sx={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 700, background: i < step ? `linear-gradient(135deg,${GOLD},${GOLD_DARK})` : i === step ? `linear-gradient(135deg,${GOLD_LIGHT},#fdf3d0)` : "rgba(0,0,0,0.06)", color: i < step ? "white" : i === step ? GOLD_DARK : TEXT_MID, border: i === step ? `2px solid ${GOLD}` : "2px solid transparent", transition: "all 0.3s ease", flexShrink: 0 }}>
                                            {i < step ? <CheckCircleIcon sx={{ fontSize: 14, color: "white" }} /> : i + 1}
                                        </Box>
                                        <Typography sx={{ fontSize: "0.72rem", fontWeight: 600, color: i === step ? GOLD_DARK : i < step ? TEXT_MID : "rgba(0,0,0,0.35)" }}>{s.label}</Typography>
                                    </Box>
                                    <Box sx={{ height: 3, borderRadius: 2, bgcolor: i <= step ? GOLD : "rgba(0,0,0,0.08)", transition: "background 0.4s ease" }} />
                                </Box>
                            ))}
                        </Box>

                        {serverError && <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }} onClose={() => setServerError("")}>{serverError}</Alert>}

                        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                            {step === 0 && (
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, animation: "stepSlide 0.35s ease both" }}>
                                    <TextField className="gold-input" fullWidth label="Username" required {...register("userName")} error={!!errors.userName} helperText={errors.userName?.message} autoFocus InputProps={{ startAdornment: (<InputAdornment position="start"><PersonOutlineIcon sx={{ color: GOLD, fontSize: 20 }} /></InputAdornment>), }} sx={fieldSx} />
                                    <TextField className="gold-input" fullWidth label="Email Address" type="email" required {...register("email")} error={!!errors.email} helperText={errors.email?.message} InputProps={{ startAdornment: (<InputAdornment position="start"><EmailOutlinedIcon sx={{ color: GOLD, fontSize: 20 }} /></InputAdornment>), }} sx={fieldSx} />
                                    <Box>
                                        <TextField className="gold-input" fullWidth label="Password" required type={showPassword ? "text" : "password"} {...register("password")} error={!!errors.password} helperText={errors.password?.message} InputProps={{ startAdornment: (<InputAdornment position="start"><LockOutlinedIcon sx={{ color: GOLD, fontSize: 20 }} /></InputAdornment>), endAdornment: (<InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">{showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}</IconButton></InputAdornment>), }} sx={fieldSx} />
                                        {passwordValue.length > 0 && (<Box sx={{ mt: 1 }}><LinearProgress variant="determinate" value={strength.score} sx={{ height: 4, borderRadius: 2, bgcolor: "rgba(0,0,0,.06)", "& .MuiLinearProgress-bar": { bgcolor: strength.color, borderRadius: 2 } }} /><Typography sx={{ fontSize: "0.7rem", mt: 0.5, color: strength.color, fontWeight: 600 }}>{strength.label}</Typography></Box>)}
                                    </Box>
                                    <TextField className="gold-input" fullWidth label="Confirm Password" required type={showConfirm ? "text" : "password"} {...register("confirmPassword")} error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message} InputProps={{ startAdornment: (<InputAdornment position="start"><LockOutlinedIcon sx={{ color: GOLD, fontSize: 20 }} /></InputAdornment>), endAdornment: (<InputAdornment position="end"><IconButton onClick={() => setShowConfirm(!showConfirm)} edge="end" size="small">{showConfirm ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}</IconButton></InputAdornment>), }} sx={fieldSx} />
                                </Box>
                            )}

                            {step === 1 && (
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, animation: "stepSlide 0.35s ease both" }}>
                                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                                        <TextField className="gold-input" fullWidth label="Phone Number" required {...register("phoneNumber")} error={!!errors.phoneNumber} helperText={errors.phoneNumber?.message} InputProps={{ startAdornment: (<InputAdornment position="start"><PhoneOutlinedIcon sx={{ color: GOLD, fontSize: 20 }} /></InputAdornment>), }} sx={fieldSx} />
                                        <TextField className="gold-input" fullWidth label="Country" required {...register("country")} error={!!errors.country} helperText={errors.country?.message} InputProps={{ startAdornment: (<InputAdornment position="start"><PublicOutlinedIcon sx={{ color: GOLD, fontSize: 20 }} /></InputAdornment>), }} sx={fieldSx} />
                                    </Box>
                                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                                        <FormControl fullWidth required error={!!errors.gender} className="gold-select" sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5, bgcolor: "#fafafa" } }}>
                                            <InputLabel>Gender</InputLabel>
                                            <Select label="Gender" defaultValue="" {...register("gender")} startAdornment={<InputAdornment position="start"><WcOutlinedIcon sx={{ color: GOLD, fontSize: 20, ml: 0.5 }} /></InputAdornment>}>
                                                <MenuItem value="Male">Male</MenuItem>
                                                <MenuItem value="Female">Female</MenuItem>
                                                <MenuItem value="Other">Other</MenuItem>
                                            </Select>
                                            {errors.gender && <Typography color="error" variant="caption" sx={{ mt: 0.5, ml: 1.5 }}>{errors.gender.message}</Typography>}
                                        </FormControl>
                                        <TextField className="gold-input" fullWidth label="Date of Birth" type="date" required InputLabelProps={{ shrink: true }} {...register("dateOfBirth")} error={!!errors.dateOfBirth} helperText={errors.dateOfBirth?.message} InputProps={{ startAdornment: (<InputAdornment position="start"><CakeOutlinedIcon sx={{ color: GOLD, fontSize: 20 }} /></InputAdornment>), }} sx={fieldSx} />
                                    </Box>
                                </Box>
                            )}

                            {step === 2 && (
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, animation: "stepSlide 0.35s ease both" }}>
                                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                                        <TextField className="gold-input" fullWidth label="Shift Start Time" type="time" required InputLabelProps={{ shrink: true }} {...register("shiftStart")} error={!!errors.shiftStart} helperText={errors.shiftStart?.message} InputProps={{ startAdornment: (<InputAdornment position="start"><AccessTimeIcon sx={{ color: GOLD, fontSize: 20 }} /></InputAdornment>), }} sx={fieldSx} />
                                        <TextField className="gold-input" fullWidth label="Shift End Time" type="time" required InputLabelProps={{ shrink: true }} {...register("shiftEnd")} error={!!errors.shiftEnd} helperText={errors.shiftEnd?.message} InputProps={{ startAdornment: (<InputAdornment position="start"><AccessTimeIcon sx={{ color: GOLD, fontSize: 20 }} /></InputAdornment>), }} sx={fieldSx} />
                                    </Box>

                                    <Box>
                                        <input ref={(e) => { imageHookRef(e); fileInputRef.current = e; }} type="file" hidden accept="image/*" {...imageRest} onChange={(e) => { onImageChange(e); setImageFile(e.target.files[0] || null); }} />
                                        <Button fullWidth variant="outlined" onClick={() => fileInputRef.current?.click()} startIcon={<CloudUploadOutlinedIcon />} sx={{ py: 1.6, borderRadius: 2.5, borderColor: BORDER_CLR, borderStyle: "dashed", borderWidth: 2, color: imageFile ? GOLD_DARK : TEXT_MID, bgcolor: imageFile ? GOLD_BG : "#fafafa", fontWeight: 600, textTransform: "none", "&:hover": { borderColor: GOLD, bgcolor: GOLD_BG } }}>
                                            {imageFile ? `📷 ${imageFile.name}` : "Upload Profile Photo (Optional)"}
                                        </Button>
                                        {errors.image && <Typography color="error" variant="caption" sx={{ mt: 0.5, ml: 0.5 }}>{errors.image.message}</Typography>}
                                    </Box>
                                </Box>
                            )}

                            <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
                                {step > 0 && (<Button onClick={() => setStep((s) => s - 1)} startIcon={<ArrowBackIcon fontSize="small" />} sx={{ flex: 1, py: 1.4, borderRadius: 50, fontWeight: 600, textTransform: "none", color: TEXT_MID, border: `1.5px solid rgba(74,74,106,.2)`, "&:hover": { bgcolor: "#f4f4f8" } }}>Back</Button>)}
                                {step < STEPS.length - 1 ? (<Button onClick={goNext} endIcon={<ArrowForwardIcon fontSize="small" />} sx={{ flex: 2, py: 1.5, borderRadius: 50, fontWeight: 700, textTransform: "none", background: `linear-gradient(135deg,${GOLD},${GOLD_DARK})`, color: "white", boxShadow: `0 6px 24px ${GOLD}40`, "&:hover": { background: GOLD_DARK, transform: "translateY(-2px)" } }}>Continue</Button>) : (<Button type="submit" disabled={isSubmitting} sx={{ flex: 2, py: 1.5, borderRadius: 50, fontWeight: 700, textTransform: "none", background: `linear-gradient(135deg,${GOLD},${GOLD_DARK})`, color: "white", boxShadow: `0 6px 24px ${GOLD}40`, "&:hover:not(:disabled)": { background: GOLD_DARK, transform: "translateY(-2px)" } }}>{isSubmitting ? <CircularProgress size={18} sx={{ color: "white" }} /> : "Register Staff"}</Button>)}
                            </Box>
                            <Divider sx={{ borderColor: BORDER_CLR, my: 3 }} />
                        </Box>
                    </Box>
                </Box>
            </Box>
        </>
    );
}
