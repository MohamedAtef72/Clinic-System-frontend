export const getStatusChipColor = (status) => {
  switch (status) {
    case "CheckedIn":
    case "Completed":
      return "success";
    case "Confirmed":
      return "info";
    case "Schedule":
      return "warning";
    case "Cancelled":
    case "NoShow":
      return "error";
    default:
      return "default";
  }
};