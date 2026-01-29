import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { statusColors } from "../styles/colors";

export const StatusBadge = ({ status }) => {
  // Get color from centralized styles, with fallback
  const colorClass = statusColors[status] || statusColors.default;
  
  // Status label mapping
  const labelMap = {
    OPEN: "Open",
    IN_PROGRESS: "In Progress",
    RESOLVED: "Resolved",
    CLOSED: "Closed",
  };
  
  const label = labelMap[status] || status || "Unknown";

  return (
    <Badge variant="outline" className={cn("font-medium", colorClass)}>
      {label}
    </Badge>
  );
};
