import React from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Calendar, Camera, MessageSquare, User, CheckCircle } from 'lucide-react';
import { Link } from "react-router-dom";
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { mockIssue } from '../data/mockIssues';
import { getDaysAgo } from '@/utils/dateUtils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const IssueCard = ({ issue = mockIssue }) => {
  return (
    <Link to={`/issues/${issue.id}`}>
      <Card className={`hover:border-primary/50 transition-all hover:shadow-md cursor-pointer ${issue.status === 'closed' ? 'opacity-70' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg mb-1 truncate">{issue.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{issue.description}</p>
            </div>
            <div className="flex flex-col gap-2 items-end shrink-0">
              <StatusBadge status={issue.status} />
              <PriorityBadge priority={issue.priority} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(issue.createdAt).toLocaleDateString()}
            </span>
            <span className="inline-flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              {issue.messageCount}
            </span>
            <span className="inline-flex items-center gap-1">
              <Camera className="h-4 w-4" />
              {issue.photoCount}
            </span>
            {issue.acknowledged_date && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex items-center text-green-600 cursor-pointer">
                      <CheckCircle className="h-4 w-4 hover:text-green-800" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Seen {getDaysAgo(issue.acknowledged_date)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{issue.tenantName}</span>
            <span className="text-muted-foreground">• {issue.propertyAddress}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="px-2 py-1 bg-secondary rounded-md text-secondary-foreground">
              {issue.category}
            </span>
            <div className="flex items-center gap-3 text-xs">
              <span className="text-muted-foreground">
                Updated {new Date(issue.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default IssueCard;
