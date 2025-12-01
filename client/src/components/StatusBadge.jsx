import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusConfig = {
  OPEN: {
    label: "Open",
    className: "bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-300",
  },
  IN_PROGRESS: {
    label: "In Progress",
    className: "bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-300",
  },
  RESOLVED: {
    label: "Resolved",
    className: "bg-green-100 text-green-700 hover:bg-green-200 border border-green-300",
  },
  CLOSED: {
    label: "Closed",
    className: "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300",
  },
};

export const StatusBadge = ({ status }) => {
  const config = statusConfig[status];

  return (
    <Badge className={cn("font-medium", config.className)}>
      {config.label}
    </Badge>
  );
};
