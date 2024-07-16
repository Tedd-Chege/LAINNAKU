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

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/files/getallposts`, {
          method: 'GET',
        });
        const data = await res.json();
        if (res.ok) {
          // Sort posts by uploadDate in descending order
          const sortedPosts = data.posts.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
          setPosts(sortedPosts);
          setShowMore(sortedPosts.length >= 9);
        } else {
          console.log(data.message);
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser.isOverallAdmin) {
      fetchPosts();
    }
  }, [currentUser.isOverallAdmin]);

  const handleShowMore = async () => {
    setLoading(true);
    const startIndex = posts.length;
    try {
      const res = await fetch(
        `/api/files/getallposts?startIndex=${startIndex}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        // Check for duplicates before adding new posts
        const newPosts = data.posts.filter(post => !posts.some(existingPost => existingPost._id === post._id));
        // Concatenate new posts and sort again by uploadDate in descending order
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
      setLoading(false);
    }
  };

  // Group posts by category
  const groupedPosts = posts.reduce((acc, post) => {
    acc[post.category] = acc[post.category] || [];
    acc[post.category].push(post);
    return acc;
  }, {});

  const truncateText = (text, length) => {
    if (text.length <= length) {
      return text;
    }
    return text.substring(0, length) + '...';
  };

  const handleDeletePost = async () => {
    setLoading(true);
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/files/deletepost/${postIdToDelete}/${currentUser._id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        setPosts((prev) =>
          prev.filter((post) => post._id !== postIdToDelete)
        );
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {loading ? (
        <p>Loading...</p>
      ) : currentUser.isOverallAdmin && Object.keys(groupedPosts).length > 0 ? (
        <>
          {Object.keys(groupedPosts).map((category) => (
            <div key={category}>
              <h2 className="text-xl font-bold my-4">{category}</h2>
              <Table hoverable className="shadow-md">
                <Table.Head>
                  <Table.HeadCell>Title</Table.HeadCell>
                  <Table.HeadCell>Category</Table.HeadCell>
                  <Table.HeadCell>Form</Table.HeadCell>
                  <Table.HeadCell>Subject</Table.HeadCell>
                  {category !== 'notes' && (
                    <>
                      <Table.HeadCell>Term</Table.HeadCell>
                      <Table.HeadCell>Year</Table.HeadCell>
                    </>
                  )}
                  <Table.HeadCell>Download</Table.HeadCell>
                  <Table.HeadCell>Delete</Table.HeadCell>
                  <Table.HeadCell>Edit</Table.HeadCell>
                </Table.Head>
                {groupedPosts[category].map((post) => (
                  <Table.Body key={post._id} className="divide-y">
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell>{post.title || ' '}</Table.Cell>
                      <Table.Cell>{post.category || ' '}</Table.Cell>
                      <Table.Cell>{post.form || ' '}</Table.Cell>
                      <Table.Cell>{post.subject || ' '}</Table.Cell>
                      {category !== 'notes' && (
                        <>
                          <Table.Cell>{post.term || ' '}</Table.Cell>
                          <Table.Cell>{post.year || ' '}</Table.Cell>
                        </>
                      )}
                      <Table.Cell>
                        <a
                          href={post.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal-500 underline"
                        >
                          Download
                        </a>
                      </Table.Cell>
                      <Table.Cell>
                        <span
                          onClick={() => {
                            setShowModal(true);
                            setPostIdToDelete(post._id);
                          }}
                          className="font-medium text-red-500 hover:underline cursor-pointer"
                        >
                          Delete
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <Link
                          className="text-teal-500 hover:underline"
                          to={`/update-post/${post._id}`}
                        >
                          Edit
                        </Link>
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                ))}
              </Table>
            </div>
          ))}
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p>No posts available!</p>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this post?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeletePost}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
