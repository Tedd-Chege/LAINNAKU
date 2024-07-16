import { Modal } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Sidebar from './sidebarHome'; // Import the Sidebar component
import PostCard from './PostCard'; // Import the new PostCard component
import { HiMenu } from 'react-icons/hi';
import InfiniteScroll from 'react-infinite-scroll-component';

export default function AllPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const limit = 10;

  useEffect(() => {
    fetchPosts();
  }, []); // Empty dependency array ensures it runs once when the component mounts

  const fetchPosts = async () => {
    try {
      const res = await fetch(`/api/files/getallposts?startIndex=${startIndex}&limit=${limit}`);
      const data = await res.json();
      if (res.ok) {
        // Check for duplicates before adding posts
        const newPosts = data.posts.filter(post => !posts.some(existingPost => existingPost._id === post._id));
        setPosts((prevPosts) => [...prevPosts, ...newPosts]);
        setHasMore(newPosts.length >= limit);
        setStartIndex((prevIndex) => prevIndex + limit);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
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
    <div className="flex ">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className={`flex-1 mt-4 transition-all duration-300 ${sidebarOpen ? 'ml-0 md:ml-80' : 'ml-5 md:ml-80'}`}>
        <div className="p-4">
          <button className="md:hidden mb-4" onClick={toggleSidebar}>
            <HiMenu className="h-6 w-6 text-gray-700" />
          </button>
          <div className="p-1">
            <InfiniteScroll
              dataLength={posts.length}
              next={fetchPosts}
              hasMore={hasMore}
              loader={<p className="text-center">Loading...</p>}
              endMessage={<p className="text-center">No more posts available!</p>}
            >
              {Object.keys(groupedPosts).length > 0 ? (
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
                </>
              ) : (
                <p className="text-center">No posts available!</p>
              )}
            </InfiniteScroll>
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
