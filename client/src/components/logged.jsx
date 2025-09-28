import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useSelector } from 'react-redux';
import DashSidebar from '../components/DashSidebar';
import PostCard from '../components/PostCard';
import GroupedPostCard from '../components/GroupedPostCard';
import { Button } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';

export default function AllPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(() => window.innerWidth >= 1024);
  const [startIndex, setStartIndex] = useState(0);
  const limit = 10;
  const fetchedPostIds = useRef(new Set());
  const navigate = useNavigate();

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

  // ---------- helpers ----------
  const norm = (v) => (v == null ? '' : String(v)).trim();
  const normUnderscore = (v) => norm(v).toLowerCase().replace(/[-\s]+/g, '_');
  const newestDate = (arr) =>
    arr.reduce((max, p) => {
      const d = new Date(p.uploadDate || 0).getTime();
      return d > max ? d : max;
    }, 0);

  // ---------- group + sort (memoized) ----------
  const {
    examGroupsSorted,
    markingGroupsSorted,
    notesGroupsSorted,
    resultGroupsSorted,
    othersSorted,
  } = useMemo(() => {
    // Build maps
    const exams = {};
    const marking = {};
    const notes = {};
    const results = {};
    const others = [];

    for (const post of posts) {
      const cat = norm(post.category);
      if (cat === 'exams') {
        // group key: status + identity; status normalized for safety
        const status = normUnderscore(post.status); // 'exam_in_progress' | 'past_exams' | ...
        const key = `${status}|${post.form}|${post.year}|${post.term}|${post.examType}`;
        if (!exams[key]) {
          exams[key] = {
            category: 'exams',
            status,
            form: post.form,
            year: post.year,
            term: post.term,
            examType: post.examType,
            files: [],
            _newest: 0,
          };
        }
        exams[key].files.push(post);
      } else if (cat === 'marking_scheme') {
        const key = `${post.year}|${post.term}|${post.examType}`;
        if (!marking[key]) {
          marking[key] = {
            category: 'marking_scheme',
            year: post.year,
            term: post.term,
            examType: post.examType,
            files: [],
            _newest: 0,
          };
        }
        marking[key].files.push(post);
      } else if (cat === 'notes') {
        const key = `${post.form}`;
        if (!notes[key]) {
          notes[key] = {
            category: 'notes',
            form: post.form,
            files: [],
            _newest: 0,
          };
        }
        notes[key].files.push(post);
      } else if (cat === 'results') {
        const key = `${post.year}|${post.term}|${post.examType}`;
        if (!results[key]) {
          results[key] = {
            category: 'results',
            year: post.year,
            term: post.term,
            examType: post.examType,
            files: [],
            _newest: 0,
          };
        }
        results[key].files.push(post);
      } else {
        others.push(post);
      }
    }

    // Sort files inside each group by newest first, and compute group newest
    const finalizeGroup = (g) => {
      g.files.sort((a, b) => new Date(b.uploadDate || 0) - new Date(a.uploadDate || 0));
      g._newest = newestDate(g.files);
      return g;
    };

    const examGroups = Object.values(exams).map(finalizeGroup);
    const markingGroups = Object.values(marking).map(finalizeGroup);
    const notesGroups = Object.values(notes).map(finalizeGroup);
    const resultGroups = Object.values(results).map(finalizeGroup);

    // Sort groups:
    // - Exams: IN PROGRESS first, then by newest group date desc
    const rankStatus = (s) => (s === 'exam_in_progress' ? 0 : 1);
    examGroups.sort((a, b) => {
      const r = rankStatus(a.status) - rankStatus(b.status);
      if (r !== 0) return r;
      return b._newest - a._newest;
    });

    // - Others: by newest group date desc
    markingGroups.sort((a, b) => b._newest - a._newest);
    notesGroups.sort((a, b) => b._newest - a._newest);
    resultGroups.sort((a, b) => b._newest - a._newest);

    // - Other single posts: newest first
    const othersSortedLocal = [...others].sort(
      (a, b) => new Date(b.uploadDate || 0) - new Date(a.uploadDate || 0)
    );

    return {
      examGroupsSorted: examGroups,
      markingGroupsSorted: markingGroups,
      notesGroupsSorted: notesGroups,
      resultGroupsSorted: resultGroups,
      othersSorted: othersSortedLocal,
    };
  }, [posts]);

  const glassCardClass =
    'backdrop-blur-[6px] bg-white/60 rounded-2xl shadow-lg border border-white/20 p-4 mb-8';

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
          onToggle={() => setSidebarExpanded((e) => !e)}
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
            ? `${sidebarWidthExpanded + 30}px`
            : `${sidebarWidthCollapsed + 10}px`,
          transition: 'margin-left 0.3s cubic-bezier(.4,0,.2,1)',
        }}
      >
        <div className="w-full max-w-6xl mx-auto">
          {loading ? (
            <div className="text-center text-gray-500 font-medium animate-pulse">
              Loading...
            </div>
          ) : (
            <div>
              {/* Exams Section */}
              {examGroupsSorted.length > 0 && (
                <>
                  <h2 className="text-2xl font-extrabold uppercase mb-4 mt-10 text-black tracking-wide">
                    Exams
                  </h2>
                  <div className={glassCardClass}>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {examGroupsSorted.map((groupInfo, idx) => (
                        <GroupedPostCard
                          key={`ex-${idx}-${groupInfo.year}-${groupInfo.term}-${groupInfo.examType}-${groupInfo.status}`}
                          groupKey={`ex-${idx}`}
                          groupInfo={groupInfo}
                          onClick={() =>
                            navigate('/group-files', { state: { groupInfo } })
                          }
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Marking Schemes */}
              {markingGroupsSorted.length > 0 && (
                <>
                  <h2 className="text-2xl font-extrabold uppercase mb-4 mt-10 text-black tracking-wide">
                    Marking Schemes
                  </h2>
                  <div className={glassCardClass}>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {markingGroupsSorted.map((groupInfo, idx) => (
                        <GroupedPostCard
                          key={`mk-${idx}-${groupInfo.year}-${groupInfo.term}-${groupInfo.examType}`}
                          groupKey={`mk-${idx}`}
                          groupInfo={groupInfo}
                          onClick={() =>
                            navigate('/group-files', { state: { groupInfo } })
                          }
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Notes */}
              {notesGroupsSorted.length > 0 && (
                <>
                  <h2 className="text-2xl font-extrabold uppercase mb-4 mt-10 text-black tracking-wide">
                    Notes
                  </h2>
                  <div className={glassCardClass}>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {notesGroupsSorted.map((groupInfo, idx) => (
                        <GroupedPostCard
                          key={`nt-${idx}-${groupInfo.form}`}
                          groupKey={`nt-${idx}`}
                          groupInfo={groupInfo}
                          onClick={() =>
                            navigate('/group-files', { state: { groupInfo } })
                          }
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Results */}
              {resultGroupsSorted.length > 0 && (
                <>
                  <h2 className="text-2xl font-extrabold uppercase mb-4 mt-10 text-black tracking-wide">
                    Results
                  </h2>
                  <div className={glassCardClass}>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {resultGroupsSorted.map((groupInfo, idx) => (
                        <GroupedPostCard
                          key={`rs-${idx}-${groupInfo.year}-${groupInfo.term}-${groupInfo.examType}`}
                          groupKey={`rs-${idx}`}
                          groupInfo={groupInfo}
                          onClick={() =>
                            navigate('/group-files', { state: { groupInfo } })
                          }
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Other Files */}
              {othersSorted.length > 0 && (
                <>
                  <h2 className="text-2xl font-extrabold uppercase mb-4 mt-10 text-black tracking-wide">
                    Other Files
                  </h2>
                  <div className={glassCardClass}>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {othersSorted.map((post) => (
                        <PostCard key={post._id} post={post} />
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* No content */}
              {examGroupsSorted.length === 0 &&
                markingGroupsSorted.length === 0 &&
                notesGroupsSorted.length === 0 &&
                resultGroupsSorted.length === 0 &&
                othersSorted.length === 0 && (
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
