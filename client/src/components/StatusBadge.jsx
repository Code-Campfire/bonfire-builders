import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusConfig = {
  OPEN: {
    label: "Open",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  IN_PROGRESS: {
    label: "In Progress",
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  RESOLVED: {
    label: "Resolved",
    className: "bg-green-100 text-green-800 border-green-200",
  },
  CLOSED: {
    label: "Closed",
    className: "bg-gray-100 text-gray-800 border-gray-200",
  },
};

export const StatusBadge = ({ status }) => {
  // Default config if status not found
  const config = statusConfig[status] || {
    label: status || "Unknown",
    className: "bg-gray-100 text-gray-800 border-gray-200",
  };

  return (
    <Badge variant="outline" className={cn("font-medium", config.className)}>
      {config.label}
    </Badge>
  );
};
