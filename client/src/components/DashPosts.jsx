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
          res = await fetch(`/api/files/user/${currentUser.userId}`, { method: 'GET' });
        } else {
          setPosts([]);
          setShowMore(false);
          setLoading(false);
          return;
        }
        if (!res) return;
        const data = await res.json();
        let postsData = res.ok ? (data.posts || data) : [];
        const sortedPosts = postsData.sort(
          (a, b) => new Date(b.uploadDate) - new Date(a.uploadDate)
        );
        setPosts(sortedPosts);
        setShowMore(sortedPosts.length >= 9);
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser && currentUser.isOverallAdmin && currentUser.userId) {
      fetchPosts();
    }
  }, [currentUser.isOverallAdmin, currentUser.userId]);

  const handleShowMore = async () => {
    setLoadingShowMore(true);
    const startIndex = posts.length;
    try {
      const res = await fetch(`/api/files/getallposts?startIndex=${startIndex}`, {
        method: 'GET',
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
        const sortedPosts = updatedPosts.sort(
          (a, b) => new Date(b.uploadDate) - new Date(a.uploadDate)
        );
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

  const groupedPosts = posts.reduce((acc, post) => {
    acc[post.category] = acc[post.category] || [];
    acc[post.category].push(post);
    return acc;
  }, {});

  const truncateText = (text, length) => {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
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

  return (
    <div className="w-full max-w-6xl mx-auto px-1 sm:px-4 py-3">
      {loading ? (
        <p>Loading...</p>
      ) : currentUser.isOverallAdmin && Object.keys(groupedPosts).length > 0 ? (
        <>
          {Object.keys(groupedPosts).map((category) => (
            <div key={category} className="mb-10">
              <h2 className="text-xl font-bold my-4">{category}</h2>
              <div className="hidden sm:block overflow-x-auto rounded-2xl shadow bg-white">
                <Table hoverable className="w-full min-w-[600px]">
                  <Table.Head>
                    <Table.HeadCell>Title</Table.HeadCell>
                    <Table.HeadCell className="hidden sm:table-cell">Category</Table.HeadCell>
                    <Table.HeadCell>Form</Table.HeadCell>
                    <Table.HeadCell>Subject</Table.HeadCell>
                    {category !== 'notes' && (
                      <>
                        <Table.HeadCell className="hidden md:table-cell">Term</Table.HeadCell>
                        <Table.HeadCell>Year</Table.HeadCell>
                        <Table.HeadCell className="hidden md:table-cell">Exam Type</Table.HeadCell>
                      </>
                    )}
                    {category === 'exams' && (
                      <Table.HeadCell>Status</Table.HeadCell>
                    )}
                    <Table.HeadCell>Delete</Table.HeadCell>
                    <Table.HeadCell className="hidden sm:table-cell">Edit</Table.HeadCell>
                  </Table.Head>
                  <Table.Body>
                    {groupedPosts[category].map((post) => (
                      <Table.Row key={post._id} className="bg-white">
                        <Table.Cell>{truncateText(post.title || ' ', 30)}</Table.Cell>
                        <Table.Cell className="hidden sm:table-cell">{truncateText(post.category || ' ', 20)}</Table.Cell>
                        <Table.Cell>{truncateText(post.form || ' ', 20)}</Table.Cell>
                        <Table.Cell>{truncateText(post.subject || ' ', 20)}</Table.Cell>
                        {category !== 'notes' && (
                          <>
                            <Table.Cell className="hidden md:table-cell">{post.term || ' '}</Table.Cell>
                            <Table.Cell>{post.year || ' '}</Table.Cell>
                            <Table.Cell className="hidden md:table-cell">{truncateText(post.examType || ' ', 18)}</Table.Cell>
                          </>
                        )}
                        {category === 'exams' && (
                          <Table.Cell>
                            <span
                              className={`font-bold text-xs px-3 py-1 rounded-full shadow-sm ${post.status === 'past_exams' ? 'text-red-700' : ''} ${post.status === 'exam_in_progress' ? 'text-green-700' : ''}`}
                            >
                              {post.status === 'past_exams'
                                ? 'Past Exam'
                                : post.status === 'exam_in_progress'
                                ? 'In Progress'
                                : 'Unknown'}
                            </span>
                          </Table.Cell>
                        )}
                        <Table.Cell>
                          <span
                            onClick={() => {
                              setShowModal(true);
                              setPostIdToDelete(post._id);
                            }}
                            className={`font-medium text-red-500 hover:underline cursor-pointer ${loadingDelete ? 'opacity-50 pointer-events-none' : ''}`}
                          >
                            {loadingDelete && postIdToDelete === post._id ? 'Deleting...' : 'Delete'}
                          </span>
                        </Table.Cell>
                        <Table.Cell className="hidden sm:table-cell">
                          <Link className="text-teal-500 hover:underline" to={`/update-post/${post._id}`}>
                            Edit
                          </Link>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </div>
            </div>
          ))}
        </>
      ) : (
        <p>No posts available!</p>
      )}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this post?
            </h3>
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
