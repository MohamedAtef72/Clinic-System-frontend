import { Avatar, Card, CardContent, Typography, Box, IconButton } from "@mui/material";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { FaUserTie } from "react-icons/fa";
import { GOLD, GOLD_BG, GOLD_DARK, GOLD_LIGHT, TEXT_DARK, TEXT_MID } from "../../../theme/tokens";

/**
 * Reusable profile identity card — shows avatar, name, and role badge.
 * Used by: MainProfile, ViewDoctorProfile, ViewPatientProfile.
 *
 * @param {object}   user        - User object with imagePath, userName fields
 * @param {string}   roleLabel   - Display label for the role badge (e.g. "Doctor")
 * @param {string}   [prefix]    - Optional prefix before name (e.g. "Dr.")
 * @param {Function} [onEditClick] - If provided, an edit icon button appears in the top-right
 */
export default function ProfileIdentityCard({ user, roleLabel, prefix = "", onEditClick }) {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 5,
        width: "100%",
        border: `1px solid rgba(184,151,42,0.15)`,
        boxShadow: "0 10px 40px rgba(0,0,0,0.04)",
        fontFamily: "'Inter', sans-serif",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
        background: "#fff",
        "&:hover .avatar-ring": {
          animation: "subtleScale 2s infinite ease-in-out",
        },
      }}
    >
      {/* Decorative gradient header */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "140px",
          background: `linear-gradient(180deg, ${GOLD_BG} 0%, rgba(255,255,255,0) 100%)`,
          zIndex: 0,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.4,
            backgroundImage: `radial-gradient(circle at 2px 2px, ${GOLD} 1px, transparent 0)`,
            backgroundSize: "24px 24px",
          }}
        />
      </Box>

      {/* Optional edit button */}
      {onEditClick && (
        <Box
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            zIndex: 2,
          }}
        >
          <IconButton
            onClick={onEditClick}
            sx={{
              color: GOLD_DARK,
              bgcolor: "white",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              "&:hover": { bgcolor: GOLD_BG },
            }}
            title="Edit Profile"
          >
            <EditOutlinedIcon fontSize="small" />
          </IconButton>
        </Box>
      )}

      <CardContent
        sx={{
          pt: 8,
          pb: 6,
          px: { xs: 3, sm: 4 },
          textAlign: "center",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
        }}
      >
        {/* Avatar with decorative rings */}
        <Box className="avatar-ring" sx={{ position: "relative", mb: 3 }}>
          {/* Outer dashed ring */}
          <Box
            sx={{
              position: "absolute",
              inset: -8,
              borderRadius: "50%",
              border: `1px dashed ${GOLD}60`,
              rotate: "-15deg",
            }}
          />
          {/* Inner solid ring */}
          <Box
            sx={{
              position: "absolute",
              inset: -3,
              borderRadius: "50%",
              border: `2px solid ${GOLD_LIGHT}`,
              zIndex: 0,
            }}
          />

          <Avatar
            src={user.imagePath}
            alt={user.userName}
            sx={{
              width: 140,
              height: 140,
              border: "4px solid white",
              background: `linear-gradient(135deg, #fdfdfc, ${GOLD_BG})`,
              color: GOLD_DARK,
              fontSize: "3.5rem",
              fontWeight: 700,
              boxShadow: `0 8px 24px rgba(184,151,42,0.2)`,
              position: "relative",
              zIndex: 1,
            }}
          >
            {user.userName?.charAt(0).toUpperCase()}
          </Avatar>
        </Box>

        {/* Name */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: TEXT_DARK,
            letterSpacing: "-0.5px",
            fontSize: { xs: "1.5rem", sm: "1.8rem" },
            mb: 1,
            wordBreak: "break-word",
          }}
        >
          {prefix ? `${prefix} ${user.userName}` : user.userName}
        </Typography>

        {/* Role badge */}
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            border: `1px solid ${GOLD}40`,
            px: 2.5,
            py: 0.7,
            borderRadius: 50,
            bgcolor: "#fff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
          }}
        >
          <FaUserTie size={12} color={GOLD} />
          <Typography
            sx={{
              color: TEXT_MID,
              fontWeight: 700,
              fontSize: "0.8rem",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            {roleLabel}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
