import { Chip } from "@mui/material";
import { statusColors } from "../../theme/tokens";

export default function StatusChip({ value }) {
  const style = statusColors[value] || statusColors.pendiente;
  return (
    <Chip
      label={value?.replace(/_/g, " ")}
      size="small"
      sx={{
        color: style.color,
        backgroundColor: style.bg,
        border: "1px solid",
        borderColor: style.color + "33",
        textTransform: "capitalize",
      }}
    />
  );
}
