import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

export default function PostPage() {
  const { id } = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/files/getposts/${id}`);
        const data = await res.json();
        if (res.ok) {
          setPost(data);
        } else {
          setError(data.message || 'Failed to fetch post');
        }
      } catch (err) {
        setError('Failed to fetch post');
      }
      setLoading(false);
    };
    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/files/deletepost/${id}/${currentUser._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      if (res.ok) {
        navigate(-1); // Go back after delete
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to delete post');
      }
    } catch (err) {
      setError('Failed to delete post');
    }
  };

  if (loading)
    return (
      <div className="text-center mt-10 text-lg font-medium text-[#ff385c] animate-pulse">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="max-w-xl mx-auto mt-10 text-center bg-white border border-[#ececec] rounded-2xl shadow p-8 text-[#ff385c]">
        {error}
      </div>
    );
  if (!post)
    return (
      <div className="max-w-xl mx-auto mt-10 text-center bg-white border border-[#ececec] rounded-2xl shadow p-8 text-[#222]">
        Post not found
      </div>
    );

  return (
    <div className="flex justify-center items-center min-h-[70vh] bg-[#fafafa] px-2">
      <div className="w-full max-w-2xl p-8 bg-white rounded-2xl border border-[#ececec] shadow-xl">
        <h1 className="text-3xl font-bold mb-2 text-[#222] tracking-tight">
          {post.title}
        </h1>
        <div className="space-y-2 text-base text-[#484848] mb-4">
          <p>
            <span className="font-semibold text-[#ff385c]">Category:</span> {post.category}
          </p>
          <p>
            <span className="font-semibold text-[#ff385c]">Form:</span> {post.form}
          </p>
          <p>
            <span className="font-semibold text-[#ff385c]">Subject:</span> {post.subject}
          </p>
          {post.category !== 'notes' && (
            <>
              <p>
                <span className="font-semibold text-[#ff385c]">Term:</span> {post.term}
              </p>
              <p>
                <span className="font-semibold text-[#ff385c]">Year:</span> {post.year}
              </p>
              <p>
                <span className="font-semibold text-[#ff385c]">Exam Type:</span> {post.examType}
              </p>
            </>
          )}
          <p>
            <span className="font-semibold text-[#ff385c]">Description:</span> {post.description}
          </p>
          <p>
            <span className="font-semibold text-[#ff385c]">Upload Date:</span>{' '}
            {new Date(post.uploadDate).toLocaleDateString()}
          </p>
        </div>
        <a
          href={post.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <button
            className="w-full rounded-xl bg-[#ff385c] hover:bg-[#e31c5f] transition text-white text-lg font-semibold py-3 shadow-md focus:ring-2 focus:ring-[#ff385c]/30 active:scale-95"
            aria-label="Download file"
          >
            Download
          </button>
        </a>
        {currentUser && currentUser.isOverallAdmin && (
          <button
            className="w-full mt-6 rounded-xl bg-[#e31c5f] hover:bg-[#b91c47] transition text-white text-lg font-semibold py-3 shadow focus:ring-2 focus:ring-[#ff385c]/30 active:scale-95"
            onClick={() => setShowModal(true)}
            aria-label="Delete Post"
          >
            Delete Post
          </button>
        )}
        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="max-w-sm w-full p-6 bg-white border border-[#ececec] rounded-2xl shadow-lg text-center">
              <h2 className="text-xl font-bold mb-3 text-[#222]">Confirm Deletion</h2>
              <p className="mb-6 text-[#484848]">
                Are you sure you want to delete this post?
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  className="rounded-xl bg-[#e31c5f] hover:bg-[#b91c47] transition text-white font-semibold px-6 py-2 focus:ring-2 focus:ring-[#ff385c]/30 active:scale-95"
                  onClick={handleDelete}
                  aria-label="Confirm delete"
                >
                  Yes, delete
                </button>
                <button
                  className="rounded-xl bg-[#f7f7f7] hover:bg-[#ececec] transition text-[#222] font-semibold px-6 py-2 border border-[#ececec] focus:ring-2 focus:ring-[#ff385c]/10 active:scale-95"
                  onClick={() => setShowModal(false)}
                  aria-label="Cancel delete"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
