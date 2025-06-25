import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Modal } from 'flowbite-react';

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

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;
  if (!post) return <div className="text-center mt-10">Post not found</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
      <p><strong>Category:</strong> {post.category}</p>
      <p><strong>Form:</strong> {post.form}</p>
      <p><strong>Subject:</strong> {post.subject}</p>
      {post.category !== 'notes' && (
        <>
          <p><strong>Term:</strong> {post.term}</p>
          <p><strong>Year:</strong> {post.year}</p>
          <p><strong>Exam Type:</strong> {post.examType}</p>
        </>
      )}
      <p><strong>Description:</strong> {post.description}</p>
      <p><strong>Upload Date:</strong> {new Date(post.uploadDate).toLocaleDateString()}</p>
      <a
        href={post.fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-teal-500 underline mt-2 block"
      >
        Download
      </a>
      {currentUser && currentUser.isOverallAdmin && (
        <Button color="failure" className="mt-6" onClick={() => setShowModal(true)}>
          Delete Post
        </Button>
      )}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <p className="mb-5 text-lg text-gray-500">Are you sure you want to delete this post?</p>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDelete}>
                Yes, delete
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
