import React from 'react';
import { Card } from 'flowbite-react';

const GroupedPostCard = ({ groupKey, groupInfo, onClick }) => {
  const { year, term, examType, files } = groupInfo;
  return (
    <Card className="shadow-2xl cursor-pointer" onClick={onClick}>
      <div className="p-2">
        <h3 className="text-xl font-bold text-blue-600 mb-2">
          {year} - Term {term} - {examType}
        </h3>
        <p className="text-base">Files: {files.length}</p>
        <p className="text-base">Subjects: {[...new Set(files.map(f => f.subject))].join(', ')}</p>
        <p className="text-base">Forms: {[...new Set(files.map(f => f.form))].join(', ')}</p>
      </div>
    </Card>
  );
};

export default GroupedPostCard;
