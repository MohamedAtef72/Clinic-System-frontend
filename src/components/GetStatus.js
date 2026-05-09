import { GOLD, GOLD_BG, GOLD_DARK } from "../theme/tokens";

/* Returns { label, bgcolor, color, border } */
export const getStatusStyle = (status) => {
  switch (status) {
    case "CheckedIn":
      return { bgcolor: "#dcfce7", color: "#166534", border: "1px solid #bbf7d0" };
    case "Completed":
      return { bgcolor: "#d1fae5", color: "#065f46", border: "1px solid #6ee7b7" };
    case "Schedule":
      return { bgcolor: GOLD_BG, color: GOLD_DARK, border: `1px solid ${GOLD}50` };
    case "Cancelled":
      return { bgcolor: "#fee2e2", color: "#991b1b", border: "1px solid #fca5a5" };
    default:
      return { bgcolor: "#f3f4f6", color: "#4b5563", border: "1px solid #e5e7eb" };
  }
};