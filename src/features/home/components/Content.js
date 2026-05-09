import React, { useEffect, useRef, useState } from "react";
import {
  Typography, Container, Box, Button, Grid, Paper,
  Card, Avatar, Chip
} from "@mui/material";
import {
  Favorite, People, CalendarMonth, BarChart, CheckCircle,
  AccessTime, EmojiEvents, ArrowForward, LocalHospital, Shield,
  TrendingUp, Verified, MedicalServices, Star
} from "@mui/icons-material";
import { useAuth } from "../../../contexts/AuthContext";

import { GOLD, GOLD_BG, GOLD_DARK, GOLD_LIGHT, TEXT_DARK, TEXT_MID } from "../../../theme/tokens";

const WHITE = "#ffffff";
const LIGHT_BG = "#f9f8f5";
const BORDER = "rgba(184,151,42,0.15)";

/* ─────────────────────────────────────────────
   Utility: animate a number from 0 → target
───────────────────────────────────────────── */
function useCountUp(target, duration = 1800, active = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    const end = parseFloat(String(target).replace(/[^0-9.]/g, ""));
    if (isNaN(end)) { setValue(target); return; }
    const startTime = performance.now();
    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setValue(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
      else setValue(end);
    };
    requestAnimationFrame(step);
  }, [active, target, duration]);
  return value;
}

/* ─── Scroll fade-in hook ─── */
function useFadeIn(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ─── Animated stat number ─── */
function TrustStat({ number, suffix, label, icon, delay = 0, active }) {
  const counted = useCountUp(number, 1800, active);
  return (
    <Box
      sx={{
        textAlign: "center",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
        opacity: active ? 1 : 0,
        transform: active ? "translateY(0)" : "translateY(24px)",
      }}
    >
      <Avatar
        sx={{
          mx: "auto", mb: 1.5,
          width: 52, height: 52,
          background: `linear-gradient(135deg, ${GOLD_LIGHT}, #fdf3d0)`,
          border: `2px solid ${GOLD}30`,
          boxShadow: `0 4px 16px ${GOLD}20`,
        }}
      >
        {React.cloneElement(icon, { sx: { color: GOLD, fontSize: 22 } })}
      </Avatar>
      <Typography
        sx={{
          fontSize: "2.2rem", fontWeight: 800,
          color: TEXT_DARK, lineHeight: 1,
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {counted}{suffix}
      </Typography>
      <Typography sx={{ color: TEXT_MID, fontSize: "0.88rem", mt: 0.5, fontWeight: 500 }}>
        {label}
      </Typography>
    </Box>
  );
}

/* ─── Feature Card ─── */
function FeatureCard({ feature, delay = 0 }) {
  const [ref, visible] = useFadeIn(0.12);
  return (
    <Box
      sx={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.4s cubic-bezier(.25,.8,.25,1), transform 0.4s cubic-bezier(.25,.8,.25,1)`,
        transitionDelay: `${delay}ms`,
        height: "100%",
      }}
    >
      <Card
        ref={ref}
        elevation={0}
        sx={{
          p: 3.5,
          borderRadius: 3,
          border: `1px solid ${BORDER}`,
          background: WHITE,
          height: "100%",
          transition: "all 0.4s cubic-bezier(.25,.8,.25,1)",
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: `0 24px 56px rgba(184,151,42,0.14)`,
            borderColor: `${GOLD}50`,
          },
        }}
      >
        {/* Icon Box */}
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: 2.5,
            mb: 2.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: `linear-gradient(135deg, ${GOLD_LIGHT}, #fdf3d0)`,
            border: `1px solid ${GOLD}30`,
          }}
        >
          {React.cloneElement(feature.icon, { sx: { color: GOLD, fontSize: 26 } })}
        </Box>

        {/* Title */}
        <Typography
          fontWeight={700}
          fontSize="1.05rem"
          color={TEXT_DARK}
          gutterBottom
        >
          {feature.title}
        </Typography>

        {/* Subtitle */}
        <Typography
          fontSize="0.8rem"
          fontWeight={600}
          sx={{
            color: GOLD,
            mb: 1.5,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          {feature.subtitle}
        </Typography>

        {/* Description */}
        <Typography
          variant="body2"
          color={TEXT_MID}
          sx={{ mb: 2, lineHeight: 1.7 }}
        >
          {feature.description}
        </Typography>

        {/* Benefits List */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.7 }}>
          {feature.benefits.map((b, i) => (
            <Box
              key={i}
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <CheckCircle sx={{ color: GOLD, fontSize: 16 }} />
              <Typography
                variant="body2"
                color={TEXT_MID}
                fontSize="0.82rem"
              >
                {b}
              </Typography>
            </Box>
          ))}
        </Box>
      </Card>
    </Box>
  );
}

/* ─── Extra Feature Item ─── */
function ExtraItem({ f, delay = 0 }) {
  const [ref, visible] = useFadeIn(0.12);
  return (
    <Box
      ref={ref}
      sx={{
        display: "flex", alignItems: "flex-start", gap: 2,
        p: 2.5, borderRadius: 2.5,
        border: `1px solid ${BORDER}`,
        background: WHITE,
        transition: "all 0.35s ease",
        transform: visible ? "translateX(0)" : "translateX(-24px)",
        opacity: visible ? 1 : 0,
        transitionDelay: `${delay}ms`,
        "&:hover": {
          borderColor: `${GOLD}50`,
          boxShadow: `0 8px 28px ${GOLD}18`,
          transform: "translateX(4px)",
        },
      }}
    >
      <Box
        sx={{
          width: 44, height: 44, borderRadius: 2, flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`,
          boxShadow: `0 4px 14px ${GOLD}44`,
        }}
      >
        {React.cloneElement(f.icon, { sx: { color: "white", fontSize: 20 } })}
      </Box>
      <Box>
        <Typography fontWeight={700} fontSize="0.92rem" color={TEXT_DARK} gutterBottom={false} sx={{ mb: 0.3 }}>
          {f.title}
        </Typography>
        <Typography variant="body2" color={TEXT_MID} fontSize="0.82rem" lineHeight={1.6}>
          {f.description}
        </Typography>
      </Box>
    </Box>
  );
}

/* ══════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════ */
export default function Content() {
  const { user, isAuthenticated } = useAuth();
  const [trustRef, trustVisible] = useFadeIn(0.2);

  const stats = [
    { number: "99.9", suffix: "%", label: "System Uptime", icon: <AccessTime /> },
    { number: "500", suffix: "+", label: "Active Clinics", icon: <LocalHospital /> },
    { number: "50", suffix: "K+", label: "Patients Served", icon: <People /> },
    { number: "15", suffix: "+", label: "Years Experience", icon: <EmojiEvents /> },
  ];

  const features = [
    {
      icon: <Favorite />,
      title: "Healthcare Professionals",
      subtitle: "Medical Management",
      description:
        "Advanced patient record management, treatment history tracking, prescription management, and clinical decision support tools designed for modern healthcare.",
      benefits: ["Electronic Health Records", "Clinical Documentation", "Treatment Planning"],
    },
    {
      icon: <People />,
      title: "Patient Portal",
      subtitle: "Seamless Experience",
      description:
        "Appointment scheduling, health record access, prescription refills, and secure communication with healthcare providers — all in one place.",
      benefits: ["Online Appointments", "Health Records Access", "Secure Messaging"],
    },
    {
      icon: <CalendarMonth />,
      title: "Administrative Staff",
      subtitle: "Operations Management",
      description:
        "Comprehensive tools for patient registration, billing integration, appointment coordination, and staff scheduling.",
      benefits: ["Patient Registration", "Billing Integration", "Staff Coordination"],
    },
  ];

  const extraFeatures = [
    { icon: <BarChart />, title: "Advanced Analytics", description: "Comprehensive reporting and insights for better clinical decision making." },
    { icon: <Shield />, title: "HIPAA Compliant", description: "Enterprise-grade security protecting every piece of patient data." },
    { icon: <EmojiEvents />, title: "Award Winning", description: "Recognized globally for innovation and outstanding user experience." },
    { icon: <TrendingUp />, title: "Proven Results", description: "Measurably improved clinic efficiency and patient satisfaction scores." },
  ];

  const specialties = [
    { name: "Cardiology", icon: <Favorite /> },
    { name: "Neurology", icon: <MedicalServices /> },
    { name: "Orthopedics", icon: <Shield /> },
    { name: "Pediatrics", icon: <People /> },
    { name: "Oncology", icon: <Star /> },
    { name: "Emergency Care", icon: <LocalHospital /> },
  ];

  return (
    <>
      <style>{`
        @keyframes heroFadeUp { from { opacity:0; transform:translateY(32px); } to { opacity:1; transform:translateY(0); } }
        @keyframes floatSlow { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes shimmerGold {
          0%,100% { background-position: 0% 50%; }
          50%      { background-position: 100% 50%; }
        }
        @keyframes badgePop { from{transform:scale(0.7);opacity:0} 80%{transform:scale(1.05)} to{transform:scale(1);opacity:1} }
      `}</style>

      <Box id="home" sx={{ fontFamily: "'Inter', sans-serif", overflowX: "hidden", bgcolor: WHITE }}>

        {/* ══════════════════════════════════════
            HERO — full-bleed photo + overlay
        ══════════════════════════════════════ */}
        <Box
          sx={{
            position: "relative",
            height: { xs: "92vh", md: "88vh" },
            minHeight: 560,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* Background photo */}
          <Box
            sx={{
              position: "absolute", inset: 0,
              backgroundImage: "url('/clinic_hero_bg.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              transform: "scale(1.03)",
              animation: "floatSlow 14s ease-in-out infinite",
            }}
          />
          {/* Dark overlay — lighter at centre-right, darker on left */}
          <Box
            sx={{
              position: "absolute", inset: 0,
              background: "linear-gradient(100deg, rgba(20,18,30,0.82) 0%, rgba(20,18,30,0.65) 55%, rgba(20,18,30,0.3) 100%)",
            }}
          />
          {/* Gold accent line left */}
          <Box
            sx={{
              position: "absolute", left: 0, top: "15%", bottom: "15%",
              width: 4,
              background: `linear-gradient(to bottom, transparent, ${GOLD}, transparent)`,
              borderRadius: 2,
            }}
          />

          <Container
            maxWidth="lg"
            sx={{ position: "relative", zIndex: 2, px: { xs: 3, md: 8 } }}
          >
            <Grid container>
              <Grid item xs={12} md={7}>
                {/* Tag */}
                <Box
                  sx={{
                    display: "inline-flex", alignItems: "center", gap: 1,
                    background: `${GOLD}22`,
                    border: `1px solid ${GOLD}55`,
                    backdropFilter: "blur(6px)",
                    borderRadius: 50,
                    px: 2, py: 0.6, mb: 3,
                    animation: "badgePop 0.8s ease forwards",
                  }}
                >
                  <Verified sx={{ fontSize: 14, color: GOLD }} />
                  <Typography variant="caption" fontWeight={700} color={GOLD} letterSpacing={1.5} textTransform="uppercase">
                    Premium Healthcare Platform
                  </Typography>
                </Box>

                {/* Headline */}
                <Typography
                  variant="h1"
                  sx={{
                    color: WHITE,
                    fontSize: { xs: "2.6rem", sm: "3.4rem", md: "4.2rem", lg: "5rem" },
                    fontWeight: 800,
                    lineHeight: 1.1,
                    letterSpacing: "-1.5px",
                    mb: 1,
                    animation: "heroFadeUp 0.9s 0.1s ease both",
                  }}
                >
                  Medical Care
                </Typography>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: "2.6rem", sm: "3.4rem", md: "4.2rem", lg: "5rem" },
                    fontWeight: 800,
                    lineHeight: 1.1,
                    letterSpacing: "-1.5px",
                    mb: 1,
                    background: `linear-gradient(90deg, ${GOLD}, #f0d070, ${GOLD})`,
                    backgroundSize: "200%",
                    animation: "heroFadeUp 0.9s 0.2s ease both, shimmerGold 4s ease infinite",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  You Deserve.
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    color: "rgba(255,255,255,0.78)",
                    fontWeight: 400,
                    lineHeight: 1.6,
                    mb: 4, mt: 2,
                    maxWidth: 500,
                    fontSize: { xs: "1rem", md: "1.15rem" },
                    animation: "heroFadeUp 0.9s 0.3s ease both",
                  }}
                >
                  Empowering clinics with intelligent tools for superior patient
                  care, streamlined operations, and measurable outcomes.
                </Typography>

                {/* CTA buttons */}
                <Box
                  sx={{
                    display: "flex", gap: 2, flexWrap: "wrap",
                    animation: "heroFadeUp 0.9s 0.4s ease both",
                  }}
                >
                  {isAuthenticated === false && (
                    <>
                      <Button
                        href="/login"
                        endIcon={<ArrowForward />}
                        sx={{
                          background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`,
                          color: WHITE, fontWeight: 700,
                          px: 3.5, py: 1.4,
                          borderRadius: 50,
                          fontSize: "0.95rem",
                          textTransform: "none",
                          boxShadow: `0 8px 30px ${GOLD}55`,
                          "&:hover": {
                            background: GOLD_DARK,
                            transform: "translateY(-2px)",
                            boxShadow: `0 14px 40px ${GOLD}66`,
                          },
                          transition: "all 0.28s",
                        }}
                      >
                        Get Started
                      </Button>
                    </>
                  )}
                  {isAuthenticated && (
                    <Button
                      href={user?.role === "Admin" ? "/admin/dash" : "/doctors"}
                      endIcon={<ArrowForward />}
                      sx={{
                        background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`,
                        color: WHITE, fontWeight: 700,
                        px: 3.5, py: 1.4,
                        borderRadius: 50,
                        fontSize: "0.95rem",
                        textTransform: "none",
                        boxShadow: `0 8px 30px ${GOLD}55`,
                        "&:hover": { background: GOLD_DARK, transform: "translateY(-2px)" },
                        transition: "all 0.28s",
                      }}
                    >
                      {user?.role === "Admin" ? "Go to Dashboard" : "View Doctors"}
                    </Button>
                  )}
                </Box>

                {/* Trust badges */}
                <Box
                  sx={{
                    display: "flex", gap: 1.5, mt: 4, flexWrap: "wrap",
                    animation: "heroFadeUp 0.9s 0.5s ease both",
                  }}
                >
                  {["HIPAA Compliant", "256-bit Encrypted", "99.9% Uptime"].map((b) => (
                    <Box
                      key={b}
                      sx={{
                        display: "flex", alignItems: "center", gap: 0.7,
                        bgcolor: "rgba(255,255,255,0.1)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        backdropFilter: "blur(8px)",
                        borderRadius: 50, px: 1.8, py: 0.5,
                      }}
                    >
                      <CheckCircle sx={{ fontSize: 13, color: GOLD }} />
                      <Typography variant="caption" color="rgba(255,255,255,0.85)" fontWeight={500} fontSize="0.72rem">
                        {b}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Container>

          {/* Scroll indicator */}
          <Box
            sx={{
              position: "absolute", bottom: 28, left: "50%",
              transform: "translateX(-50%)",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5,
              opacity: 0.6,
            }}
          >
            <Box
              sx={{
                width: 24, height: 38, borderRadius: 12,
                border: "2px solid rgba(255,255,255,0.5)",
                display: "flex", justifyContent: "center", pt: 1,
              }}
            >
              <Box
                sx={{
                  width: 4, height: 8, borderRadius: 2,
                  bgcolor: GOLD,
                  animation: "floatSlow 1.6s ease-in-out infinite",
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* ══════════════════════════════════════
            SPECIALTIES — horizontal pill strip
        ══════════════════════════════════════ */}
        <Box
          sx={{
            bgcolor: WHITE,
            borderBottom: `1px solid ${BORDER}`,
            py: 3,
          }}
        >
          <Container maxWidth="lg">
            <Box
              sx={{
                display: "flex", alignItems: "center", gap: 2,
                justifyContent: "center", flexWrap: "wrap",
              }}
            >
              <Typography variant="caption" fontWeight={700} color={GOLD} letterSpacing={2} textTransform="uppercase" sx={{ mr: 1 }}>
                Specialties
              </Typography>
              {specialties.map((s) => (
                <Chip
                  key={s.name}
                  icon={React.cloneElement(s.icon, { sx: { color: `${GOLD} !important`, fontSize: "16px !important" } })}
                  label={s.name}
                  sx={{
                    bgcolor: GOLD_BG,
                    border: `1px solid ${GOLD}30`,
                    color: TEXT_DARK,
                    fontWeight: 500,
                    fontSize: "0.8rem",
                    "&:hover": { bgcolor: GOLD_LIGHT, borderColor: GOLD },
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                />
              ))}
            </Box>
          </Container>
        </Box>

        {/* ══════════════════════════════════════
            STATS strip
        ══════════════════════════════════════ */}
        <Box
          ref={trustRef}
          sx={{
            bgcolor: GOLD_BG,
            borderBottom: `1px solid ${BORDER}`,
            py: { xs: 6, md: 8 },
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={4} justifyContent="center">
              {stats.map((s, i) => (
                <Grid item xs={6} sm={3} key={i}>
                  <TrustStat
                    number={s.number}
                    suffix={s.suffix}
                    label={s.label}
                    icon={s.icon}
                    delay={i * 120}
                    active={trustVisible}
                  />
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* ══════════════════════════════════════
            FEATURES
        ══════════════════════════════════════ */}
        <Box id="about" sx={{ bgcolor: LIGHT_BG, py: { xs: 8, md: 12 } }}>
          <Container maxWidth="lg">
            {/* Section header */}
            <Box sx={{ textAlign: "center", mb: 8 }}>
              <Typography
                variant="overline"
                sx={{ color: GOLD, fontWeight: 700, letterSpacing: 3, fontSize: "0.72rem" }}
              >
                WHAT WE OFFER
              </Typography>
              <Typography
                variant="h3"
                fontWeight={800}
                color={TEXT_DARK}
                sx={{
                  mt: 1, mb: 2,
                  fontSize: { xs: "1.8rem", md: "2.6rem" },
                  letterSpacing: "-0.5px",
                }}
              >
                Comprehensive Healthcare Solutions
              </Typography>
              <Box sx={{ width: 60, height: 3, background: `linear-gradient(90deg, ${GOLD}, ${GOLD_DARK})`, mx: "auto", borderRadius: 2, mb: 2 }} />
              <Typography variant="body1" color={TEXT_MID} sx={{ maxWidth: 560, mx: "auto", lineHeight: 1.7 }}>
                Our integrated platform serves every aspect of your clinic with
                enterprise-grade security and reliability.
              </Typography>
            </Box>

            <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} rowSpacing={8}>
              {features.map((f, i) => (
                <Grid item xs={12} md={4} key={i}>
                  <FeatureCard feature={f} delay={i * 110} />
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* ══════════════════════════════════════
            WHY CHOOSE US — split layout
        ══════════════════════════════════════ */}
        <Box sx={{ bgcolor: WHITE, py: { xs: 8, md: 12 } }}>
          <Container maxWidth="lg">
            <Grid container spacing={8} alignItems="center">
              {/* Left text */}
              <Grid item xs={12} md={5}>
                <Typography variant="overline" sx={{ color: GOLD, fontWeight: 700, letterSpacing: 3, fontSize: "0.72rem" }}>
                  OUR ADVANTAGE
                </Typography>
                <Typography
                  variant="h3" fontWeight={800} color={TEXT_DARK}
                  sx={{
                    mt: 1, mb: 2,
                    fontSize: { xs: "1.8rem", md: "2.4rem" },
                    letterSpacing: "-0.5px",
                    lineHeight: 1.2,
                  }}
                >
                  Why Choose Our Platform?
                </Typography>
                <Box sx={{ width: 50, height: 3, background: `linear-gradient(90deg, ${GOLD}, ${GOLD_DARK})`, borderRadius: 2, mb: 3 }} />
                <Typography variant="body1" color={TEXT_MID} sx={{ lineHeight: 1.8, mb: 4 }}>
                  Built specifically for healthcare environments, our system
                  combines ease of use with powerful functionality — making your
                  clinic smarter, faster, and more patient-friendly.
                </Typography>
                <Button
                  href={isAuthenticated ? (user?.role === "Admin" ? "/admin/dash" : "/doctors") : "/login"}
                  endIcon={<ArrowForward />}
                  sx={{
                    background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`,
                    color: WHITE, fontWeight: 700,
                    px: 3.5, py: 1.4,
                    borderRadius: 50,
                    fontSize: "0.92rem",
                    textTransform: "none",
                    boxShadow: `0 6px 24px ${GOLD}44`,
                    "&:hover": { background: GOLD_DARK, transform: "translateY(-2px)" },
                    transition: "all 0.28s",
                  }}
                >
                  Explore Platform
                </Button>
              </Grid>

              {/* Right grid */}
              <Grid item xs={12} md={7}>
                <Grid container spacing={2}>
                  {extraFeatures.map((f, i) => (
                    <Grid item xs={12} sm={6} key={i}>
                      <ExtraItem f={f} delay={i * 100} />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* ══════════════════════════════════════
            CALL TO ACTION — gold gradient
        ══════════════════════════════════════ */}
        <Box
          sx={{
            background: `linear-gradient(135deg, #1a1526 0%, #2d2040 50%, #1a1526 100%)`,
            color: WHITE,
            py: { xs: 8, md: 12 },
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Gold decorative lines */}
          <Box sx={{
            position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
            width: "60%", height: 2,
            background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
          }} />
          <Box sx={{
            position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
            width: "60%", height: 2,
            background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
          }} />
          {/* Glow orbs */}
          <Box sx={{
            position: "absolute", top: "-80px", left: "-80px",
            width: 300, height: 300, borderRadius: "50%",
            background: `radial-gradient(circle, ${GOLD}18, transparent 70%)`,
            pointerEvents: "none",
          }} />
          <Box sx={{
            position: "absolute", bottom: "-60px", right: "-60px",
            width: 250, height: 250, borderRadius: "50%",
            background: `radial-gradient(circle, ${GOLD}14, transparent 70%)`,
            pointerEvents: "none",
          }} />

          <Container maxWidth="md" sx={{ position: "relative", zIndex: 1, textAlign: "center" }}>
            <Typography variant="overline" sx={{ color: GOLD, fontWeight: 700, letterSpacing: 3, fontSize: "0.72rem" }}>
              READY TO BEGIN?
            </Typography>
            <Typography
              variant="h2" fontWeight={800}
              sx={{
                mt: 1, mb: 2,
                fontSize: { xs: "2rem", md: "3.2rem" },
                letterSpacing: "-1px",
              }}
            >
              Transform Your Clinic Today
            </Typography>
            <Box sx={{
              width: 60, height: 3,
              background: `linear-gradient(90deg, ${GOLD}, #f0d070)`,
              mx: "auto", borderRadius: 2, mb: 3,
            }} />
            <Typography
              variant="h6" sx={{ opacity: 0.75, mb: 5, fontWeight: 400, lineHeight: 1.7 }}
            >
              Join hundreds of healthcare providers who trust our platform to deliver
              exceptional patient care and operational excellence.
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "center", gap: 2.5, flexWrap: "wrap" }}>
              <Button
                endIcon={<ArrowForward />}
                sx={{
                  background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`,
                  color: WHITE, fontWeight: 700,
                  px: 4, py: 1.5,
                  borderRadius: 50,
                  fontSize: "1rem",
                  textTransform: "none",
                  boxShadow: `0 8px 30px ${GOLD}55`,
                  "&:hover": { background: GOLD_DARK, transform: "translateY(-2px)", boxShadow: `0 14px 40px ${GOLD}66` },
                  transition: "all 0.28s",
                }}
              >
                Start Free Trial
              </Button>
              <Button
                sx={{
                  color: "rgba(255,255,255,0.85)", fontWeight: 600,
                  px: 4, py: 1.5,
                  borderRadius: 50,
                  fontSize: "1rem",
                  textTransform: "none",
                  border: `1.5px solid ${GOLD}55`,
                  "&:hover": {
                    border: `1.5px solid ${GOLD}`,
                    bgcolor: `${GOLD}15`,
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.28s",
                }}
              >
                Schedule a Demo
              </Button>
            </Box>

            <Typography variant="body2" sx={{ mt: 4, opacity: 0.5, fontSize: "0.82rem" }}>
              ✓ No setup fees &nbsp;•&nbsp; ✓ 30-day free trial &nbsp;•&nbsp; ✓ Cancel anytime
            </Typography>
          </Container>
        </Box>

        {/* ══════════════════════════════════════
            FOOTER
        ══════════════════════════════════════ */}
        <Box id="contact"
          sx={{
            bgcolor: "#141220",
            color: WHITE,
            pt: 7, pb: 4,
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={5} sx={{ mb: 5 }}>
              {/* Brand */}
              <Grid item xs={12} md={4}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, mb: 2 }}>
                  <LocalHospital sx={{ color: GOLD, fontSize: 28 }} />
                  <Box>
                    <Typography fontWeight={800} fontSize="1.05rem" color={WHITE}>
                      MedClinic
                    </Typography>
                    <Typography fontSize="0.58rem" fontWeight={600} color={GOLD} letterSpacing="1.5px" textTransform="uppercase">
                      Professional Care
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="rgba(255,255,255,0.45)" lineHeight={1.8} maxWidth={300}>
                  Professional healthcare management solutions designed for modern
                  medical practices. Secure, reliable, and HIPAA-compliant.
                </Typography>
              </Grid>

              {/* Quick links */}
              <Grid item xs={6} md={2}>
                <Typography fontWeight={700} fontSize="0.82rem" color={GOLD} letterSpacing={1.5} textTransform="uppercase" mb={2}>
                  Quick Links
                </Typography>
                {["Doctors", "Appointments", "Services", "About Us"].map((l) => (
                  <Typography key={l} variant="body2" color="rgba(255,255,255,0.45)"
                    sx={{ mb: 1, cursor: "pointer", "&:hover": { color: GOLD }, transition: "color 0.2s" }}>
                    {l}
                  </Typography>
                ))}
              </Grid>

              {/* Services */}
              <Grid item xs={6} md={2}>
                <Typography fontWeight={700} fontSize="0.82rem" color={GOLD} letterSpacing={1.5} textTransform="uppercase" mb={2}>
                  Services
                </Typography>
                {["Cardiology", "Neurology", "Orthopedics", "Pediatrics"].map((l) => (
                  <Typography key={l} variant="body2" color="rgba(255,255,255,0.45)"
                    sx={{ mb: 1, cursor: "pointer", "&:hover": { color: GOLD }, transition: "color 0.2s" }}>
                    {l}
                  </Typography>
                ))}
              </Grid>

              {/* Certifications */}
              <Grid item xs={12} md={4}>
                <Typography fontWeight={700} fontSize="0.82rem" color={GOLD} letterSpacing={1.5} textTransform="uppercase" mb={2}>
                  Certifications
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {["HIPAA Compliant", "SOC 2 Certified", "ISO 27001"].map((b) => (
                    <Box
                      key={b}
                      sx={{
                        px: 1.5, py: 0.5, borderRadius: 1.5,
                        border: `1px solid ${GOLD}30`,
                        bgcolor: `${GOLD}0d`,
                      }}
                    >
                      <Typography variant="caption" color="rgba(255,255,255,0.5)" fontWeight={500} fontSize="0.7rem">
                        {b}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Grid>
            </Grid>

            {/* Gold divider */}
            <Box sx={{ height: 1, background: `linear-gradient(90deg, transparent, ${GOLD}40, transparent)`, mb: 3 }} />

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
              <Typography variant="caption" color="rgba(255,255,255,0.3)">
                © 2025 MedClinic Pro. All rights reserved.
              </Typography>
              <Typography variant="caption" color="rgba(255,255,255,0.3)">
                Privacy Policy &nbsp;•&nbsp; Terms of Service
              </Typography>
            </Box>
          </Container>
        </Box>

      </Box>
    </>
  );
}