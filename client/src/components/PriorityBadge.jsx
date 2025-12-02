import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AlertCircle, AlertTriangle, Info, Flame } from "lucide-react";

const priorityConfig = {
  LOW: {
    label: "Low",
    icon: Info,
    className: "bg-gray-100 text-gray-800 border-gray-300",
  },
  MEDIUM: {
    label: "Medium",
    icon: AlertCircle,
    className: "bg-blue-100 text-blue-800 border-blue-300",
  },
  HIGH: {
    label: "High",
    icon: AlertTriangle,
    className: "bg-orange-100 text-orange-800 border-orange-300",
  },
  URGENT: {
    label: "Urgent",
    icon: Flame,
    className: "bg-red-100 text-red-800 border-red-300",
  },
};

export const PriorityBadge = ({ priority }) => {
  // Default config if priority not found
  const config = priorityConfig[priority] || {
    label: priority || "Unknown",
    icon: Info,
    className: "bg-gray-100 text-gray-800 border-gray-300",
  };

  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn("flex items-center gap-1", config.className)}
    >
      <Icon className="w-3 h-3" />
      {config.label}
    </Badge>
  );
};
