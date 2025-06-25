import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';

export default function GroupFiles() {
  const location = useLocation();
  const navigate = useNavigate();
  const { groupInfo } = location.state || {};

  if (!groupInfo) {
    return <div className="p-4">No files found for this group.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <button className="mb-4 text-blue-600 underline" onClick={() => navigate(-1)}>
        &larr; Back
      </button>
      <h2 className="text-2xl font-bold mb-4">
        Files for {groupInfo.year} - Term {groupInfo.term} - {groupInfo.examType}
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {groupInfo.files.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
}
