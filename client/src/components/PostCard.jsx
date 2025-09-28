import React from 'react';
import { HiDownload } from "react-icons/hi";

function GlassCard({ children, className = '' }) {
  return (
    <div
      className={[
        "glass-card relative rounded-2xl p-6",
        "bg-white/60 backdrop-blur-lg border border-white/40 shadow-lg",
        "hover:shadow-2xl transition-all duration-300",
        className,
      ].join(' ')}
    >
      {children}
    </div>
  );
}

const PostCard = ({ post }) => {
  const safeDate = post.uploadDate ? new Date(post.uploadDate).toLocaleDateString() : "—";

  return (
    <GlassCard className="mb-6">
      {/* Title */}
      <h3 className="text-xl sm:text-2xl font-extrabold text-[#183153] mb-3 line-clamp-2">
        {post.title || "Untitled"}
      </h3>

      {/* Meta info grid */}
      <div className="space-y-1 text-sm sm:text-base text-[#1e293b] mb-4">
        <p><span className="font-semibold">Category:</span> {post.category || "—"}</p>
        <p><span className="font-semibold">Form:</span> {post.form || "—"}</p>
        <p><span className="font-semibold">Subject:</span> {post.subject || "—"}</p>

        {post.category !== 'notes' && (
          <>
            <p><span className="font-semibold">Term:</span> {post.term || "—"}</p>
            <p><span className="font-semibold">Year:</span> {post.year || "—"}</p>
            <p><span className="font-semibold">Exam Type:</span> {post.examType || "—"}</p>
          </>
        )}

        {post.description && (
          <p className="italic text-gray-600"><span className="font-semibold not-italic">Description:</span> {post.description}</p>
        )}

        <p><span className="font-semibold">Uploaded:</span> {safeDate}</p>
      </div>

      {/* Download button */}
      {post.fileUrl && (
        <a
          href={post.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#e42649] to-[#b91c3a] hover:from-[#5a0e22] hover:to-[#701c2d] text-white font-bold rounded-xl shadow-md transition transform active:scale-95 text-sm sm:text-base"
        >
          <HiDownload className="w-5 h-5 shrink-0" />
          Download
        </a>
      )}
    </GlassCard>
  );
};

export default PostCard;
