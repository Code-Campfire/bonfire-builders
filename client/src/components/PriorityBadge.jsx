import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AlertCircle, AlertTriangle, Info, Flame } from "lucide-react";
import { priorityColors } from "../styles/colors";

// Icon mapping for priorities
const priorityIcons = {
  LOW: Info,
  MEDIUM: AlertCircle,
  HIGH: AlertTriangle,
  URGENT: Flame,
};

// Label mapping for priorities
const priorityLabels = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  URGENT: "Urgent",
};

export const PriorityBadge = ({ priority }) => {
  // Get color from centralized styles, with fallback
  const colorClass = priorityColors[priority] || priorityColors.default;
  const Icon = priorityIcons[priority] || Info;
  const label = priorityLabels[priority] || priority || "Unknown";

  return (
    <Badge
      variant="outline"
      className={cn("flex items-center gap-1", colorClass)}
    >
      <Icon className="w-3 h-3" />
      {label}
    </Badge>
  );
};
