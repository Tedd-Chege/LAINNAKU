import React from 'react';
import { Card } from 'flowbite-react';

const GroupedPostCard = ({ groupKey, groupInfo, onClick }) => {
  const { year, term, examType, files } = groupInfo;
  const subjects = [...new Set(files.map(f => f.subject))].join(', ');
  const forms = [...new Set(files.map(f => f.form))];
  const category = files[0]?.category;
  const status = files[0]?.status; // 'past_exams' or 'exam_in_progress'

  // Determine ribbon color and label
  const ribbonColor = status === 'exam_in_progress' ? 'bg-green-600' : 'bg-red-700';
  const ribbonText = status === 'exam_in_progress' ? 'IN PROGRESS' : 'PAST EXAM';

  return (
    <Card
      className="relative backdrop-blur-[6px] bg-white/60 rounded-2xl shadow-lg border border-white/20 p-5 transition-all duration-300 ease-in-out cursor-pointer hover:scale-105 hover:shadow-2xl hover:border-[#ff385c]/50 hover:bg-white/80 active:scale-100 h-full flex flex-col justify-start min-h-[280px]"
      onClick={onClick}
    >
      {/* Ribbon - only if exam */}
      {category === 'exams' && (
        <div className={`absolute top-4 -left-4 transform -rotate-45 ${ribbonColor} text-white font-bold text-[10px] px-2 py-1 shadow-lg z-10 w-24 text-center`}>
          {ribbonText}
        </div>
      )}

      {/* Inner content should also take full height to ensure alignment */}
      <div className="flex flex-col justify-start flex-grow">
        <h3 className="text-xl font-extrabold text-blue-700 mb-2">
          {year} - Term {term} - {examType}
        </h3>
        <p className="text-base text-gray-800">
          <span className="font-bold">Files:</span> {files.length}
        </p>
        <p className="text-base text-gray-800">
          <span className="font-bold">Subjects:</span> {subjects}
        </p>
        <p className="text-base text-gray-800 mt-auto">
            <span className="font-bold">Form:</span> {forms.join(', ')}
        </p>
      </div>
    </Card>
  );
};

export default GroupedPostCard;
