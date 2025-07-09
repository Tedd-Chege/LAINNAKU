import React from 'react';
import { Card } from 'flowbite-react';

const GroupedPostCard = ({ groupKey, groupInfo, onClick }) => {
  const { year, term, examType, files } = groupInfo;
  const subjects = [...new Set(files.map(f => f.subject))].join(', ');
  const forms = [...new Set(files.map(f => f.form))];

  return (
    <Card
      className="
        backdrop-blur-[6px] bg-white/60 rounded-2xl shadow-lg border border-white/20 p-5 
        transition-all duration-300 ease-in-out cursor-pointer
        hover:scale-105 hover:shadow-2xl hover:border-[#ff385c]/50 hover:bg-white/80
        active:scale-100
      "
      onClick={onClick}
    >
      <h3 className="text-xl font-extrabold text-blue-700 mb-2">
        {year} - Term {term} - {examType}
      </h3>
      <p className="text-base text-gray-800"><span className="font-bold">Files:</span> {files.length}</p>
      <p className="text-base text-gray-800"><span className="font-bold">Subjects:</span> {subjects}</p>
      <p className="text-base text-gray-800"><span className="font-bold">Form:</span> {forms.length}</p>
    </Card>
  );
};

export default GroupedPostCard;
