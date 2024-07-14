import { Modal } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Sidebar from './sidebarHome'; // Import the Sidebar component
import PostCard from './PostCard'; // Import the new PostCard component
import { HiMenu } from 'react-icons/hi';

export default function AllPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

    fetchPosts(); // Fetch posts unconditionally
  }, []); // Empty dependency array ensures it runs once when the component mounts

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
        // Concatenate new posts and sort again by uploadDate in descending order
        const updatedPosts = [...posts, ...data.posts];
        const sortedPosts = updatedPosts.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
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

  // Group posts by category
  const groupedPosts = posts.reduce((acc, post) => {
    acc[post.category] = acc[post.category] || [];
    acc[post.category].push(post);
    return acc;
  }, {});

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-0 md:ml-80' : 'ml-5 md:ml-80'}`}>
        <div className="p-4">
          <button className="md:hidden mb-4" onClick={toggleSidebar}>
            <HiMenu className="h-6 w-6 text-gray-700" />
          </button>
          <div className="p-1">
            {loading ? (
              <p className="text-center">Loading...</p>
            ) : Object.keys(groupedPosts).length > 0 ? (
              <>
                {Object.keys(groupedPosts).map((category) => (
                  <div key={category} className="mb-6">
                    <h2 className="text-xl font-bold uppercase mb-4 mt-16">{category}</h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {groupedPosts[category].map((post) => (
                        <PostCard key={post._id} post={post} /> // Use PostCard component
                      ))}
                    </div>
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
              <p className="text-center">No posts available!</p>
            )}
            <Modal
              show={showModal}
              onClose={() => setShowModal(false)}
              popup
              size="md"
            >
              <Modal.Header />
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
}
