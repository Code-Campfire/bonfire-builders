import React from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Calendar, Camera, MessageSquare, User, CheckCircle } from 'lucide-react';
import { Link } from "react-router-dom";
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { mockIssue } from '../data/mockIssues';
import { getDaysAgo } from '@/utils/dateUtils';
import { formatCategory } from '@/utils/categoryUtils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { iconColors } from '../styles/colors';
import { issueCard } from '../styles/cards';

const IssueCard = ({ issue = mockIssue }) => {
  function standardizeIssueDescriptionLength(issueDescription){
    const descriptionCharacterLimit = 47;
    let shortenedDescription = "";

    if(issueDescription.length < descriptionCharacterLimit) {
      return issueDescription
    }
    for(let i = 0; i < descriptionCharacterLimit; i++){
      shortenedDescription += issueDescription[i]
    }

    return shortenedDescription + "...";
  }
  return (
    <Link to={`/issues/${issue.id}`}>
      <Card className={issue.status === 'CLOSED' ? issueCard.containerClosed : issueCard.container}>
        <CardHeader className="pb-3">
          <div className={issueCard.header}>
            <div className={issueCard.headerContent}>
              <h3 className={issueCard.title}>{issue.title}</h3>
              <p className={issueCard.description}>{standardizeIssueDescriptionLength(issue.description)}</p>
            </div>
            <div className={issueCard.badgeColumn}>
              <StatusBadge status={issue.status} />
              <PriorityBadge priority={issue.priority} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className={issueCard.metaRow}>
            <span className={issueCard.metaItem}>
              <Calendar className="h-4 w-4" />
              {new Date(issue.createdAt).toLocaleDateString()}
            </span>
            <span className={issueCard.metaItem}>
              <MessageSquare className="h-4 w-4" />
              {issue._count?.messages || 0}
            </span>
            <span className={issueCard.metaItem}>
              <Camera className="h-4 w-4" />
              {issue._count?.photos || 0}
            </span>
            {issue.acknowledged_date && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className={issueCard.metaItem + ' cursor-pointer'}>
                      <CheckCircle className={'h-4 w-4 ' + iconColors.acknowledged} />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Seen {getDaysAgo(issue.acknowledged_date)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>

          <div className={issueCard.metaItem + ' text-sm'}>
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">
              {issue.user?.first_name} {issue.user?.last_name}
            </span>
            <span className="text-muted-foreground">• {issue.complex?.address || 'N/A'}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className={issueCard.categoryBadge}>
              {formatCategory(issue.category)}
            </span>
            <div className={issueCard.dateInfo}>
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
