import React from "react";
import { Typography,Container,Box,Button,Grid,Paper,Card,Avatar } from "@mui/material";
import { Favorite,People,CalendarMonth,BarChart,Security,Headphones,CheckCircle,AccessTime,Lock,EmojiEvents,ArrowForward } from "@mui/icons-material";
import {useAuth} from "../../../contexts/AuthContext";

export default function Content() {

  const { user ,isAuthenticated } = useAuth();
  const features = [
    {
      icon: <Favorite color="error" fontSize="large" />,
      title: "Healthcare Professionals",
      subtitle: "Comprehensive Medical Management",
      description:
        "Advanced patient record management, treatment history tracking, prescription management, and clinical decision support tools.",
      benefits: [
        "Electronic Health Records",
        "Clinical Documentation",
        "Treatment Planning",
      ],
    },
    {
      icon: <People color="primary" fontSize="large" />,
      title: "Patient Portal",
      subtitle: "Streamlined Patient Experience",
      description:
        "Appointment scheduling, health record access, prescription refills, and secure communication with providers.",
      benefits: ["Online Appointments", "Health Records Access", "Secure Messaging"],
    },
    {
      icon: <CalendarMonth color="warning" fontSize="large" />,
      title: "Administrative Staff",
      subtitle: "Efficient Operations Management",
      description:
        "Tools for patient registration, billing, appointment coordination, and staff scheduling.",
      benefits: ["Patient Registration", "Billing Integration", "Staff Coordination"],
    },
  ];

  const stats = [
    { number: "99.9%", label: "System Uptime", icon: <AccessTime /> },
    { number: "HIPAA", label: "Compliant", icon: <Security /> },
    { number: "24/7", label: "Support", icon: <Headphones /> },
    { number: "256-bit", label: "Encryption", icon: <Lock /> },
  ];

  const extraFeatures = [
    {
      icon: <BarChart color="primary" />,
      title: "Advanced Analytics",
      description: "Comprehensive reporting and insights for better decision making.",
    },
    {
      icon: <Security color="primary" />,
      title: "HIPAA Compliant",
      description: "Enterprise-grade security protecting patient data.",
    },
    {
      icon: <EmojiEvents color="primary" />,
      title: "Award Winning",
      description: "Recognized for innovation and user experience.",
    },
    {
      icon: <CheckCircle color="primary" />,
      title: "Proven Results",
      description: "Improved clinic efficiency and patient satisfaction.",
    },
  ];

  return (
    <Box sx={{overflowX: "hidden"}}>
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #0d47a1, #1976d2)",
          color: "white",
          width: "100%",
          py: 10,
          textAlign: "center",
        }}
      >
      <Container maxWidth="md">
          <Typography
            variant="h3"
            fontWeight="bold"
            gutterBottom
            sx={{
              fontSize: {
                xs: "1.8rem", 
                sm: "2rem",
                md: "2.5rem",
                lg: "3rem" 
              }
            }}
          >
            Advanced Clinic <br />
            <span style={{ color: "#bbdefb" }}>Management System</span>
          </Typography>
          <Typography variant="h6" sx={{ mb: 4 }}>
            Empowering healthcare providers with cutting-edge technology for
            superior patient care, streamlined operations, and enhanced outcomes.
          </Typography>
          {isAuthenticated === false && (
            <Button
            variant="contained"
            color="black"
            size="large"
            endIcon={<ArrowForward />}
            href="/Login"
            >
            Get Started Today
          </Button>
      )}{
          isAuthenticated && (
            user.role !== 'Admin' ? (
              <Button
                variant="contained"
                color="black"
                size="large"
                endIcon={<ArrowForward />}
                href="/doctors"
              >
                View Doctors
              </Button>
            ) : (
              <Button
                variant="contained"
                color="black"
                size="large"
                endIcon={<ArrowForward />}
                href="/admin/dash"
              >
                Dashboard
              </Button>
            )
          )
        }
        </Container>
      </Box>

      {/* Stats Section */}
      <Container sx={{ mt: -5 }}>
        <Grid 
          container 
          spacing={3} 
          justifyContent="center" 
          alignItems="center"
        >
          {stats.map((stat, index) => (
            <Grid item key={index} size={{xs:11,md:5}}>
              <Paper
                elevation={6}
                sx={{
                  p: 4,
                  textAlign: "center",
                  borderRadius: 4,
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: 8,
                  },
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: "primary.main",
                    mx: "auto",
                    mb: 2,
                    width: 50,
                    height: 50,
                  }}
                >
                  {stat.icon}
                </Avatar>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  {stat.number}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {stat.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Main Features */}
      <Container sx={{ py: 10 }}>
        <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
          Comprehensive Healthcare Solutions
        </Typography>
        <Typography
          variant="h6"
          align="center"
          color="text.secondary"
          sx={{ mb: 6 }}
        >
          Our integrated platform serves every aspect of your clinic operations
          with enterprise-grade security and reliability.
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          {features.map((feature, idx) => (
          <Grid item xs={12} md={4} key={idx} size = {12}>
              <Card
                elevation={3}
                sx={{
                  p: 4,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  borderRadius: 3,
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: 6,
                  },
                }}
              >
                <Box sx={{ mb: 2, fontSize: 40, color: "primary.main" }}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" fontWeight="bold">
                  {feature.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="primary"
                  sx={{ mb: 2, fontWeight: "bold" }}
                >
                  {feature.subtitle}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {feature.description}
                </Typography>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  Key Features:
                </Typography>
                {feature.benefits.map((b, i) => (
                  <Typography
                    key={i}
                    variant="body2"
                    sx={{ display: "flex", alignItems: "center", mb: 1 }}
                  >
                    <CheckCircle color="success" fontSize="small" sx={{ mr: 1 }} />
                    {b}
                  </Typography>
                ))}
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Additional Features */}
      <Box sx={{ bgcolor: "grey.100", py: 12 }}>
        <Container>
          <Grid container spacing={6} direction="column" alignItems="center">
            {/* Title & Description */}
            <Grid item xs={12} md={8}>
              <Typography
                variant="h3"
                fontWeight="bold"
                gutterBottom
                align="center"
                sx={{ color: "primary.main" }}
              >
                Why Choose Our Platform?
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                align="center"
                sx={{ mb: 6, fontSize: "1.1rem" }}
              >
                Built specifically for healthcare environments, our system combines
                ease of use with powerful functionality to make your clinic smarter
                and more efficient.
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Grid container spacing={4} justifyContent="center">
                {extraFeatures.map((f, idx) => (
                  <Grid 
                    item 
                    key={idx} 
                    size={{ xs: 12, md: 6 }} 
                    sx={{ mb: 3 }}
                  >
                    <Paper
                      elevation={3}
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        height: "100%",
                        display: "flex",
                        alignItems: "flex-start",
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: "primary.light",
                          color: "primary.dark",
                          mr: 2,
                          width: 48,
                          height: 48,
                        }}
                      >
                        {f.icon}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {f.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {f.description}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/* Stats Section */}
            <Grid item xs={12} md={8}>
              <Paper
                elevation={6}
                sx={{
                  p: 6,
                  textAlign: "center",
                  borderRadius: 4,
                  mt: 8,
                  background: "linear-gradient(135deg, #e3f2fd, #ffffff)",
                }}
              >
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  color="text.primary"
                  sx={{ mb: 5 }}
                >
                  Trusted by Healthcare Professionals
                </Typography>

                <Grid container spacing={4} justifyContent="center">
                  <Grid item xs={4} >
                    <Typography variant="h4" fontWeight="bold" color="primary">
                      500+
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Clinics
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="h4" fontWeight="bold" color="primary">
                      50K+
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Patients Served
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="h4" fontWeight="bold" color="primary">
                      99%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Satisfaction Rate
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Call to Action */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)",
          color: "white",
          textAlign: "center",
          py: { xs: 6, md: 6 },
          position: "relative",
          borderRadius: '8px', m:2
        }}
      >
        <Container maxWidth="md">
          <Typography 
            variant="h3" 
            fontWeight="bold" 
            gutterBottom
            sx={{ fontSize: { xs: "2rem", md: "3rem" } }}
          >
            Ready to Transform Your Clinic?
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 4, 
              opacity: 0.95,
              lineHeight: 1.6,
            }}
          >
            Join hundreds of healthcare providers who trust our platform to deliver
            exceptional patient care and operational excellence.
          </Typography>
          <Box 
            sx={{ 
              display: "flex", 
              justifyContent: "center", 
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              sx={{
                bgcolor: "white",
                color: "success.main",
                "&:hover": { 
                  bgcolor: "grey.100",
                  transform: "translateY(-2px)",
                },
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: "bold",
              }}
            >
              Start Free Trial
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                borderColor: "white",
                color: "white",
                "&:hover": {
                  borderColor: "white",
                  bgcolor: "rgba(255,255,255,0.1)",
                  transform: "translateY(-2px)",
                },
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: "bold",
              }}
            >
              Schedule Demo
            </Button>
          </Box>
          
          <Box sx={{ mt: 4, opacity: 0.8 }}>
            <Typography variant="body2">
              ✓ No setup fees • ✓ 30-day free trial • ✓ Cancel anytime
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: "grey.900", color: "white", py: 6 ,borderRadius: '8px', m:2}}>
        <Container>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                MedClinic Pro
              </Typography>
              <Typography variant="body2" color="grey.400" sx={{ lineHeight: 1.6 }}>
                Professional healthcare management solutions designed for modern medical practices.
                Secure, reliable, and HIPAA-compliant.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} textAlign={{ xs: "left", md: "right" }}>
              <Typography variant="body2" color="grey.400">
                © 2025 MedClinic Pro. All rights reserved.
              </Typography>
              <Typography variant="body2" color="grey.500" sx={{ mt: 1 }}>
                HIPAA Compliant • SOC 2 Certified • ISO 27001
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}