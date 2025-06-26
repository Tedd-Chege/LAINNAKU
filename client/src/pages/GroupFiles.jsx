import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';

export default function GroupFiles() {
  const location = useLocation();
  const navigate = useNavigate();
  const { groupInfo } = location.state || {};

  if (!groupInfo) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-md p-6 text-center text-[#222]">
          No files found for this group.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] px-2 py-10">
      <div className="max-w-5xl mx-auto">
        <button
          className="
            mb-6 flex items-center gap-2 text-[#ff385c] font-semibold 
            bg-white rounded-full px-4 py-2 shadow-sm border border-[#ececec]
            hover:bg-[#ffe3ea] hover:underline active:scale-95 transition
          "
          onClick={() => navigate(-1)}
        >
          <span className="text-xl">&larr;</span> Back
        </button>
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#222] mb-7 tracking-tight">
          Files for {groupInfo.year} – Term {groupInfo.term} – {groupInfo.examType}
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {groupInfo.files.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
