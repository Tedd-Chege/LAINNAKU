// AllPosts.jsx
import { Modal, Table, Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function AllPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingShowMore, setLoadingShowMore] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        let res;
        if (currentUser.isOverallAdmin && currentUser.userId) {
          res = await fetch(`/api/files/user/${currentUser.userId}`);
        } else {
          setPosts([]);
          setShowMore(false);
          setLoading(false);
          return;
        }
        const data = await res.json();
        const postsData = res.ok ? (data.posts || data) : [];
        const sortedPosts = postsData.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
        setPosts(sortedPosts);
        setShowMore(sortedPosts.length >= 9);
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.isOverallAdmin && currentUser.userId) {
      fetchPosts();
    }
  }, [currentUser]);

  const handleShowMore = async () => {
    setLoadingShowMore(true);
    const startIndex = posts.length;
    try {
      const res = await fetch(`/api/files/getallposts?startIndex=${startIndex}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        const newPosts = data.posts.filter(
          (post) => !posts.some((existingPost) => existingPost._id === post._id)
        );
        const updatedPosts = [...posts, ...newPosts];
        const sortedPosts = updatedPosts.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
        setPosts(sortedPosts);
        setShowMore(newPosts.length >= 9);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoadingShowMore(false);
    }
  };

  const handleDeletePost = async () => {
    setLoadingDelete(true);
    setShowModal(false);
    try {
      const res = await fetch(`/api/files/deletepost/${postIdToDelete}/${currentUser._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setPosts((prev) => prev.filter((post) => post._id !== postIdToDelete));
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoadingDelete(false);
    }
  };

  const groupedPosts = posts.reduce((acc, post) => {
    acc[post.category] = acc[post.category] || [];
    acc[post.category].push(post);
    return acc;
  }, {});

  return (
    <div className="w-full max-w-6xl mx-auto px-2 py-4">
      {loading ? (
        <p>Loading...</p>
      ) : currentUser?.isOverallAdmin && Object.keys(groupedPosts).length > 0 ? (
        Object.keys(groupedPosts).map((category) => (
          <div key={category} className="mb-8">
            <h2 className="text-xl font-bold my-4 capitalize">{category.replace('_', ' ')}</h2>

            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto rounded-2xl shadow bg-white">
              <Table hoverable className="w-full min-w-[600px]">
                <Table.Head>
                  <Table.HeadCell>Title</Table.HeadCell>
                  <Table.HeadCell>Form</Table.HeadCell>
                  <Table.HeadCell>Subject</Table.HeadCell>
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
                      <Table.Cell>{post.form}</Table.Cell>
                      <Table.Cell>{post.subject}</Table.Cell>
                      {category !== 'notes' && (
                        <>
                          <Table.Cell>{post.term}</Table.Cell>
                          <Table.Cell>{post.year}</Table.Cell>
                          <Table.Cell>{post.examType}</Table.Cell>
                        </>
                      )}
                      {category === 'exams' && (
                        <Table.Cell>
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${post.status === 'past_exams' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                            {post.status === 'past_exams' ? 'Past Exam' : 'In Progress'}
                          </span>
                        </Table.Cell>
                      )}
                      <Table.Cell>
                        <div className="flex gap-2">
                          <Link to={`/update-post/${post._id}`} className="text-blue-500 underline">Edit</Link>
                          <button onClick={() => { setShowModal(true); setPostIdToDelete(post._id); }} className="text-red-500 hover:underline">Delete</button>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="sm:hidden grid gap-4">
              {groupedPosts[category].map((post) => (
                <div key={post._id} className="bg-white p-4 rounded-xl shadow">
                  <h3 className="font-bold text-lg mb-1">{post.title}</h3>
                  <p><strong>Form:</strong> {post.form}</p>
                  <p><strong>Subject:</strong> {post.subject}</p>
                  {category !== 'notes' && (
                    <>
                      <p><strong>Term:</strong> {post.term}</p>
                      <p><strong>Year:</strong> {post.year}</p>
                      <p><strong>Exam Type:</strong> {post.examType}</p>
                    </>
                  )}
                  {category === 'exams' && (
                    <p><strong>Status:</strong> <span className={`text-sm font-semibold ${post.status === 'past_exams' ? 'text-red-600' : 'text-green-600'}`}>{post.status === 'past_exams' ? 'Past Exam' : 'In Progress'}</span></p>
                  )}
                  <div className="mt-3 flex justify-between">
                    <Link to={`/update-post/${post._id}`} className="text-blue-500 underline">Edit</Link>
                    <button onClick={() => { setShowModal(true); setPostIdToDelete(post._id); }} className="text-red-500 hover:underline">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p>No posts found.</p>
      )}

      {showMore && !loadingShowMore && (
        <div className="flex justify-center mt-4">
          <Button onClick={handleShowMore}>Show More</Button>
        </div>
      )}

      {/* Delete Modal */}
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
