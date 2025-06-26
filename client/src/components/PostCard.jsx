import React from 'react';

function GlassCard({ children, className = '' }) {
  return (
    <div className={`glass-card ${className}`}>
      {children}
    </div>
  );
}

const PostCard = ({ post }) => {
  return (
    <GlassCard className="mb-4">
      <div className="p-2">
        <h3 className="text-2xl font-bold text-[#183153] mb-2">{post.title}</h3>
        <p className="text-base text-[#1e293b]">
          <strong>Category:</strong> {post.category}
        </p>
        <p className="text-base text-[#1e293b]">
          <strong>Form:</strong> {post.form}
        </p>
        <p className="text-base text-[#1e293b]">
          <strong>Subject:</strong> {post.subject}
        </p>
        {post.category !== 'notes' && (
          <>
            <p className="text-base text-[#1e293b]">
              <strong>Term:</strong> {post.term}
            </p>
            <p className="text-base text-[#1e293b]">
              <strong>Year:</strong> {post.year}
            </p>
            <p className="text-base text-[#1e293b]">
              <strong>Exam Type:</strong> {post.examType}
            </p>
          </>
        )}
        <p className="text-base text-[#1e293b]">
          <strong>Description:</strong> {post.description}
        </p>
        <p className="text-base text-[#1e293b]">
          <strong>Upload Date:</strong> {new Date(post.uploadDate).toLocaleDateString()}
        </p>
        <a
          href={post.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline mt-2 block font-bold"
        >
          Download
        </a>
      </div>
    </GlassCard>
  );
};

export default PostCard;
