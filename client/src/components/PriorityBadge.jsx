import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AlertCircle, Clock, Zap } from "lucide-react";

const priorityConfig = {
  LOW: {
    label: "Low",
    icon: Clock,
    className: "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-300",
  },
  MEDIUM: {
    label: "Medium",
    icon: AlertCircle,
    className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border border-yellow-300",
  },
  HIGH: {
    label: "High",
    icon: Zap,
    className: "bg-orange-100 text-orange-700 hover:bg-orange-200 border border-orange-300",
  },
  URGENT: {
    label: "Urgent",
    icon: Zap,
    className: "bg-red-100 text-red-700 hover:bg-red-200 border border-red-300",
  },
};

export const PriorityBadge = ({ priority }) => {
  const config = priorityConfig[priority];
  const Icon = config.icon;

  return (
    <Badge className={cn("font-medium gap-1", config.className)}>
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};
