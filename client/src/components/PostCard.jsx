// AllPosts.jsx
import { Modal, Table, Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle, HiDownload } from 'react-icons/hi';
import PostCard from './PostCard';

export default function AllPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/files/user/${currentUser.userId}`);
        const data = await res.json();
        const sortedPosts = data.posts.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
        setPosts(sortedPosts);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (currentUser?.isOverallAdmin && currentUser?.userId) {
      fetchPosts();
    }
  }, [currentUser]);

  const handleDeletePost = async () => {
    setLoadingDelete(true);
    try {
      const res = await fetch(`/api/files/deletepost/${postIdToDelete}/${currentUser._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p._id !== postIdToDelete));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingDelete(false);
      setShowModal(false);
    }
  };

  const groupedPosts = posts.reduce((acc, post) => {
    acc[post.category] = acc[post.category] || [];
    acc[post.category].push(post);
    return acc;
  }, {});

  return (
    <div className="w-full max-w-6xl mx-auto px-2 py-3">
      {loading ? (
        <p>Loading...</p>
      ) : (
        Object.keys(groupedPosts).map((category) => (
          <div key={category} className="mb-10">
            <h2 className="text-xl font-bold my-4">{category}</h2>

            {/* Large screen table */}
            <div className="hidden sm:block overflow-x-auto rounded-2xl shadow bg-white">
              <Table hoverable className="w-full min-w-[600px]">
                <Table.Head>
                  <Table.HeadCell>Title</Table.HeadCell>
                  <Table.HeadCell>Subject</Table.HeadCell>
                  <Table.HeadCell>Form</Table.HeadCell>
                  {category !== 'notes' && (
                    <>
                      <Table.HeadCell>Term</Table.HeadCell>
                      <Table.HeadCell>Year</Table.HeadCell>
                      <Table.HeadCell>Exam Type</Table.HeadCell>
                    </>
                  )}
                  {category === 'exams' && <Table.HeadCell>Status</Table.HeadCell>}
                  <Table.HeadCell>Actions</Table.HeadCell>
                </Table.Head>
                <Table.Body>
                  {groupedPosts[category].map((post) => (
                    <Table.Row key={post._id}>
                      <Table.Cell>{post.title}</Table.Cell>
                      <Table.Cell>{post.subject}</Table.Cell>
                      <Table.Cell>{post.form}</Table.Cell>
                      {category !== 'notes' && (
                        <>
                          <Table.Cell>{post.term}</Table.Cell>
                          <Table.Cell>{post.year}</Table.Cell>
                          <Table.Cell>{post.examType}</Table.Cell>
                        </>
                      )}
                      {category === 'exams' && (
                        <Table.Cell>
                          <span className={`font-semibold text-sm px-3 py-1 rounded-full shadow-sm ${post.status === 'past_exams' ? 'text-red-700' : 'text-green-700'}`}>
                            {post.status === 'past_exams' ? 'Past' : 'In Progress'}
                          </span>
                        </Table.Cell>
                      )}
                      <Table.Cell>
                        <div className="flex gap-2">
                          <Link to={`/update-post/${post._id}`} className="text-blue-500 hover:underline">Edit</Link>
                          <button
                            onClick={() => {
                              setPostIdToDelete(post._id);
                              setShowModal(true);
                            }}
                            className="text-red-500 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>

            {/* Small screen cards */}
            <div className="sm:hidden flex flex-col gap-6">
              {groupedPosts[category].map((post) => (
                <div key={post._id} className="glass-card p-4 rounded-xl shadow bg-white">
                  <PostCard post={post} />
                  <div className="flex justify-between mt-3">
                    <Link to={`/update-post/${post._id}`} className="text-blue-500 hover:underline">Edit</Link>
                    <button
                      onClick={() => {
                        setPostIdToDelete(post._id);
                        setShowModal(true);
                      }}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {/* Delete confirmation */}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500">Are you sure you want to delete this post?</h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeletePost} disabled={loadingDelete}>
                {loadingDelete ? 'Deleting...' : `Yes, I'm sure`}
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)} disabled={loadingDelete}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
