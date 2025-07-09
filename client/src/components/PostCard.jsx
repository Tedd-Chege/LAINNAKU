import React from 'react';
import { HiDownload } from "react-icons/hi";

function GlassCard({ children, className = '' }) {
  return (
    <div className={`glass-card p-4 ${className}`}>
      {children}
    </div>
  );
}

const PostCard = ({ post }) => (
  <GlassCard className="mb-4">
    <h3 className="text-2xl font-bold text-[#183153] mb-2">{post.title}</h3>
    <p className="text-base text-[#1e293b]"><strong>Category:</strong> {post.category}</p>
    <p className="text-base text-[#1e293b]"><strong>Form:</strong> {post.form}</p>
    <p className="text-base text-[#1e293b]"><strong>Subject:</strong> {post.subject}</p>
    {post.category !== 'notes' && (
      <>
        <p className="text-base text-[#1e293b]"><strong>Term:</strong> {post.term}</p>
        <p className="text-base text-[#1e293b]"><strong>Year:</strong> {post.year}</p>
        <p className="text-base text-[#1e293b]"><strong>Exam Type:</strong> {post.examType}</p>
      </>
    )}
    <p className="text-base text-[#1e293b]"><strong>Description:</strong> {post.description}</p>
    <p className="text-base text-[#1e293b]"><strong>Upload Date:</strong> {new Date(post.uploadDate).toLocaleDateString()}</p>
  <a
  href={post.fileUrl}
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center gap-2 mt-4 px-6 py-2 bg-[#e42649] hover:bg-[#5a0e22] text-white font-bold rounded-xl shadow-md transition active:scale-95 text-lg"
>
  <HiDownload className="w-5 h-5" />
  Download
</a>
  </GlassCard>
);

export default PostCard;
