import React from 'react';
import IssueCard from '../components/IssueCard';
import { mockIssues } from '../data/mockIssues';

const Issues = () => {
  return (
    <div className='flex flex-row flex-wrap gap-4'>
      {mockIssues.map((issue) => (
        <IssueCard key={issue.id} issue={issue} />
      ))}
    </div>
  );
};

export default Issues;
