import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import Sidebar from './sidebarHome';
import PostCard from './PostCard';
import GroupedPostCard from './GroupedPostCard';
import { HiMenu } from 'react-icons/hi';
import { Button, Modal } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';

export default function AllPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const limit = 10;
  const fetchedPostIds = useRef(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser && currentUser.userId) {
      fetchPosts(0, currentUser.userId); // Fetch initial posts for this user
    }
  }, [currentUser]);

  const fetchPosts = async (index, userId) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/files/user/${userId}`);
      const data = await res.json();
      if (res.ok) {
        const newPosts = data.filter(post => !fetchedPostIds.current.has(post._id));
        newPosts.forEach(post => fetchedPostIds.current.add(post._id));
        setPosts((prevPosts) => [...prevPosts, ...newPosts]);
        setShowMore(false); // No pagination for user-specific posts
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
    if (currentUser && currentUser.userId) {
      fetchPosts(startIndex, currentUser.userId);
    }
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Group posts by main category (exams, marking_scheme, others), then by year-term-examType for exams/marking_scheme
  const grouped = { exams: {}, marking_scheme: {}, others: [] };
  posts.forEach(post => {
    if (post.category === 'exams') {
      const key = `${post.year}-${post.term}-${post.examType}`;
      if (!grouped.exams[key]) grouped.exams[key] = { year: post.year, term: post.term, examType: post.examType, files: [] };
      grouped.exams[key].files.push(post);
    } else if (post.category === 'marking_scheme') {
      const key = `${post.year}-${post.term}-${post.examType}`;
      if (!grouped.marking_scheme[key]) grouped.marking_scheme[key] = { year: post.year, term: post.term, examType: post.examType, files: [] };
      grouped.marking_scheme[key].files.push(post);
    } else {
      grouped.others.push(post);
    }
  });

  return (
    <div className="flex">
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
                {Object.keys(grouped).length > 0 ? (
                  <div>
                    {/* Exams Group */}
                    {Object.keys(grouped.exams).length > 0 && (
                      <>
                        <h2 className="text-xl font-bold uppercase mb-4 mt-8">Exams</h2>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                          {Object.entries(grouped.exams).map(([key, groupInfo]) => (
                            <GroupedPostCard
                              key={key}
                              groupKey={key}
                              groupInfo={groupInfo}
                              onClick={() => navigate('/group-files', { state: { groupInfo } })}
                            />
                          ))}
                        </div>
                      </>
                    )}
                    {/* Marking Scheme Group */}
                    {Object.keys(grouped.marking_scheme).length > 0 && (
                      <>
                        <h2 className="text-xl font-bold uppercase mb-4 mt-8">Marking Schemes</h2>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                          {Object.entries(grouped.marking_scheme).map(([key, groupInfo]) => (
                            <GroupedPostCard
                              key={key}
                              groupKey={key}
                              groupInfo={groupInfo}
                              onClick={() => navigate('/group-files', { state: { groupInfo } })}
                            />
                          ))}
                        </div>
                      </>
                    )}
                    {/* Other Categories */}
                    {grouped.others.length > 0 && (
                      <>
                        <h2 className="text-xl font-bold uppercase mb-4 mt-8">Other Files</h2>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                          {grouped.others.map((post) => (
                            <PostCard key={post._id} post={post} />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
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
