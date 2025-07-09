import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import DashSidebar from '../components/DashSidebar'; // Import your actual component
import PostCard from '../components/PostCard';
import GroupedPostCard from '../components/GroupedPostCard';
import { Button } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';

export default function AllPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  // Sidebar expanded by default on large screens
  const [sidebarExpanded, setSidebarExpanded] = useState(() => window.innerWidth >= 1024);
  const [startIndex, setStartIndex] = useState(0);
  const limit = 10;
  const fetchedPostIds = useRef(new Set());
  const navigate = useNavigate();

  // Sidebar width
  const sidebarWidthCollapsed = 64;
  const sidebarWidthExpanded = 224;

  useEffect(() => {
    if (currentUser && currentUser.userId) {
      fetchPosts(0, currentUser.userId);
    }
    // eslint-disable-next-line
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
        setShowMore(false);
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

  // Group logic
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

  // Glass card utility
  const glassCardClass = "backdrop-blur-[6px] bg-white/60 rounded-2xl shadow-lg border border-white/20 p-4 mb-8";

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans pt-16 flex">
      {/* Sidebar */}
      <aside
        className={`
          fixed top-16 left-0 h-[calc(100vh-4rem)] z-30
          transition-all duration-300 border-r border-[#ececec] backdrop-blur-lg
          ${sidebarExpanded ? 'w-56 shadow-2xl bg-white/90' : 'w-16 bg-white/80'}
        `}
        style={{
          minHeight: 'calc(100vh - 4rem)',
          flexShrink: 0,
        }}
      >
        <DashSidebar
          expanded={sidebarExpanded}
          onToggle={() => setSidebarExpanded(e => !e)}
        />
      </aside>

      {/* Main Content */}
      <main
        className={`
          flex-1 transition-all duration-300
          px-2 sm:px-6 md:px-10 py-8 md:py-10 
        `}
        style={{
          marginLeft: sidebarExpanded
            ? `${sidebarWidthExpanded + 40}px` // 224 + 40 = 264px
            : `${sidebarWidthCollapsed + 10}px`, // 64 + 40 = 104px
          transition: 'margin-left 0.3s cubic-bezier(.4,0,.2,1)',
        }}
      >
        <div className="w-full max-w-6xl mx-auto">
          {loading ? (
            <div className="text-center text-gray-500 font-medium animate-pulse">Loading...</div>
          ) : (
            <div>
              {Object.keys(grouped).length > 0 ? (
                <div>
                  {/* Exams Group */}
                  {Object.keys(grouped.exams).length > 0 && (
                    <>
                      <h2 className="text-2xl font-extrabold uppercase mb-4 mt-10 text-black tracking-wide">
                        Exams
                      </h2>
                      <div className={glassCardClass}>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {Object.entries(grouped.exams).map(([key, groupInfo]) => (
                            <GroupedPostCard
                              key={key}
                              groupKey={key}
                              groupInfo={groupInfo}
                              onClick={() => navigate('/group-files', { state: { groupInfo } })}
                            />
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                  {/* Marking Scheme Group */}
                  {Object.keys(grouped.marking_scheme).length > 0 && (
                    <>
                      <h2 className="text-2xl font-extrabold uppercase mb-4 mt-10 text-black tracking-wide">
                        Marking Schemes
                      </h2>
                      <div className={glassCardClass}>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {Object.entries(grouped.marking_scheme).map(([key, groupInfo]) => (
                            <GroupedPostCard
                              key={key}
                              groupKey={key}
                              groupInfo={groupInfo}
                              onClick={() => navigate('/group-files', { state: { groupInfo } })}
                            />
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                  {/* Other Categories */}
                  {grouped.others.length > 0 && (
                    <>
                      <h2 className="text-2xl font-extrabold uppercase mb-4 mt-10 text-black tracking-wide">
                        Other Files
                      </h2>
                      <div className={glassCardClass}>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {grouped.others.map((post) => (
                            <PostCard key={post._id} post={post} />
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <p className="text-center text-gray-500">No posts available!</p>
              )}
              {showMore && (
                <div className="text-center mt-4">
                  <Button
                    className="bg-[#ff385c] hover:bg-[#e31c5f] text-white font-bold px-6 py-2 rounded-xl shadow-md transition active:scale-95"
                    onClick={fetchMorePosts}
                  >
                    Show More
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
