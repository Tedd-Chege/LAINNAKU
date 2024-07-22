import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import Sidebar from './sidebarHome';
import PostCard from './PostCard';
import { HiMenu } from 'react-icons/hi';
import { Button } from 'flowbite-react';

export default function AllPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const limit = 10;
  const fetchedPostIds = useRef(new Set());

  useEffect(() => {
    fetchPosts(0); // Fetch initial posts
  }, []); // Empty dependency array ensures it runs once when the component mounts

  const fetchPosts = async (index) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/files/getallposts?startIndex=${index}&limit=${limit}`);
      const data = await res.json();
      if (res.ok) {
        const newPosts = data.posts.filter(post => !fetchedPostIds.current.has(post._id));
        newPosts.forEach(post => fetchedPostIds.current.add(post._id));
        setPosts((prevPosts) => [...prevPosts, ...newPosts]);
        setShowMore(newPosts.length >= limit);
        setStartIndex(index + limit);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error(error.message);
    }
    setLoading(false);
  };

  const fetchMorePosts = () => {
    fetchPosts(startIndex);
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Group posts by category
  const groupedPosts = posts.reduce((acc, post) => {
    acc[post.category] = acc[post.category] || [];
    acc[post.category].push(post);
    return acc;
  }, {});

  return (
    <div className="flex">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className={`flex-1 mt-4 transition-all duration-300 ${sidebarOpen ? 'ml-0 md:ml-80' : 'ml-5 md:ml-80'}`}>
        <div className="p-4">
          <button className="md:hidden mb-4" onClick={toggleSidebar}>
            <HiMenu className="h-6 w-6 text-gray-700" />
          </button>
          <div className="p-1">
            {loading ? (
              <div className="text-center text-orange-600">Loading...</div>
            ) : (
              <div>
                {Object.keys(groupedPosts).length > 0 ? (
                  <>
                    {Object.keys(groupedPosts).map((category) => (
                      <div key={category} className="mb-6">
                        <h2 className="text-xl font-bold uppercase mb-4 mt-16">{category}</h2>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                          {groupedPosts[category].map((post) => (
                            <PostCard key={post._id} post={post} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <p className="text-center">No posts available!</p>
                )}
                {showMore && (
                  <div className="text-center mt-4">
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white" onClick={fetchMorePosts}>
                      Show More
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
