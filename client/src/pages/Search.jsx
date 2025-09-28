import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashSidebar from '../components/DashSidebar';
import PostCard from '../components/PostCard';
import StyledInput from '../components/StyledInput';

export default function SearchPage() {
  // Responsive sidebar logic (matches Dashboard/GroupFiles)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [sidebarExpanded, setSidebarExpanded] = useState(window.innerWidth >= 1024);
  const sidebarWidthCollapsed = 64; // px (w-16)
  const sidebarWidthExpanded = 224; // px (w-56)

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 1024) {
        setSidebarExpanded(true);
      } else {
        setSidebarExpanded(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isDesktop = windowWidth >= 1024;
  const sidebarWidth = sidebarExpanded ? sidebarWidthExpanded : sidebarWidthCollapsed;
  // 18px gap when sidebar is collapsed on desktop, 10px gap when collapsed on mobile, 0px when expanded
  const mainMarginLeft = isDesktop
    ? `${(sidebarExpanded ? sidebarWidthExpanded : sidebarWidthCollapsed) + (sidebarExpanded ? 0 : 18)}px`
    : `${(sidebarExpanded ? sidebarWidthExpanded : sidebarWidthCollapsed) + (sidebarExpanded ? 0 : 0)}px`;

  const [sidebarData, setSidebarData] = useState({
    category: '',
    form: '',
    subject: '',
    year: '',
    term: '',
  });

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const categoryFromUrl = urlParams.get('category') || '';
    const formFromUrl = urlParams.get('form') || '';
    const subjectFromUrl = urlParams.get('subject') || '';
    const yearFromUrl = urlParams.get('year') || '';
    const termFromUrl = urlParams.get('term') || '';

    setSidebarData({
      category: categoryFromUrl,
      form: formFromUrl,
      subject: subjectFromUrl,
      year: yearFromUrl,
      term: termFromUrl,
    });

    const fetchPosts = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/files/search?${searchQuery}`);
      if (!res.ok) {
        setLoading(false);
        return;
      }
      const data = await res.json();
      setPosts(data.posts);
      setLoading(false);
      setShowMore(data.posts.length === 9);
    };

    fetchPosts();
  }, [location.search]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setSidebarData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('category', sidebarData.category);
    urlParams.set('form', sidebarData.form);
    urlParams.set('subject', sidebarData.subject);
    urlParams.set('year', sidebarData.year);
    urlParams.set('term', sidebarData.term);
    navigate(`/search?${urlParams.toString()}`);
  };

  const handleShowMore = async () => {
    const numberOfPosts = posts.length;
    const startIndex = numberOfPosts;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/files/search?${searchQuery}`);
    if (!res.ok) {
      return;
    }
    const data = await res.json();
    setPosts([...posts, ...data.posts]);
    setShowMore(data.posts.length === 9);
  };


return (
  <div className="bg-[#fafafa] min-h-screen font-sans pt-16 flex ">
    {/* Sidebar overlay for mobile */}
    {!isDesktop && sidebarExpanded && (
      <div
        className="fixed inset-0 z-20 bg-black/30 backdrop-blur-sm lg:hidden"
        onClick={() => setSidebarExpanded(false)}
        aria-label="Close sidebar overlay"
      />
    )}
    {/* Sidebar */}
    <aside
      className={`
        fixed top-16 left-0 h-[calc(100vh-4rem)] z-30
        transition-all duration-300 border-r border-[#ececec] backdrop-blur-lg
        ${sidebarExpanded ? 'w-56 shadow-2xl bg-white' : 'w-16 bg-white/80'}
        ${!isDesktop && sidebarExpanded ? 'lg:hidden' : ''}
      `}
      style={{
        minHeight: 'calc(100vh - 4rem)',
        flexShrink: 0,
      }}
    >
      <DashSidebar
        expanded={sidebarExpanded || isDesktop}
        onToggle={() => {
          if (!isDesktop) setSidebarExpanded(e => !e);
        }}
      />
    </aside>

    {/* Main Content */}
    <main
      className="flex-1 transition-all duration-300 px-2 sm:px-6 md:px-10 py-8 md:py-10"
      style={{
        marginLeft: mainMarginLeft,
        transition: 'margin-left 0.3s cubic-bezier(.4,0,.2,1)',
      }}
    >
     
      <div className="flex flex-col md:flex-row gap-1 md:gap-2">
        {/* --- Search Sidebar --- */}
        <aside className="w-full md:w-80 p-0 md:pl-4 md:pr-2 md:py-8 border-b md:border-r border-[#ececec] bg-white flex-shrink-0">
          <div className="w-full h-full p-4 rounded-2xl shadow-lg border border-[#ececec]">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              {/* Category */}
              <div className="flex flex-col">
                <label htmlFor="category" className="text-[#ff385c] font-semibold">Category</label>
                <select
                  id="category"
                  value={sidebarData.category}
                  onChange={handleChange}
                  className="bg-white border-2 border-[#ececec] text-[#222] rounded-xl px-4 py-2 focus:border-[#ff385c] focus:ring-2 focus:ring-[#ff385c]/20 outline-none transition"
                  aria-label="Select category"
                >
                  <option value="">All</option>
                  <option value="notes">Notes</option>
                  <option value="exams">Exams</option>
                  <option value="results">Results</option>
                  <option value="marking_scheme">Marking Schemes</option>
                </select>
              </div>
              {/* Form */}
              <div className="flex flex-col gap-1">
                <label htmlFor="form" className="text-[#ff385c] font-semibold">Form</label>
                <select
                  id="form"
                  value={sidebarData.form}
                  onChange={handleChange}
                  className="bg-white border-2 border-[#ececec] text-[#222] rounded-xl px-4 py-2 focus:border-[#ff385c] focus:ring-2 focus:ring-[#ff385c]/20 outline-none transition"
                  aria-label="Select form"
                >
                  <option value="">All</option>
                  <option value="1">Form 1</option>
                  <option value="2">Form 2</option>
                  <option value="3">Form 3</option>
                  <option value="4">Form 4</option>
                </select>
              </div>
              {/* Subject */}
              <div className="flex flex-col gap-1">
                <label htmlFor="subject" className="text-[#ff385c] font-semibold">Subject</label>
                <select
                  id="subject"
                  value={sidebarData.subject}
                  onChange={handleChange}
                  className="bg-white border-2 border-[#ececec] text-[#222] rounded-xl px-4 py-2 focus:border-[#ff385c] focus:ring-2 focus:ring-[#ff385c]/20 outline-none transition"
                  aria-label="Select subject"
                >
                  <option value="">All</option>
                  <option value="math">Math</option>
                  <option value="english">English</option>
                  <option value="Kiswahili">Kiswahili</option>
                  <option value="biology">Biology</option>
                  <option value="chemistry">Chemistry</option>
                  <option value="physics">Physics</option>
                  <option value="history">History</option>
                  <option value="geography">Geography</option>
                  <option value="cre">CRE</option>
                  <option value="computer">Computer</option>
                  <option value="french">French</option>
                  <option value="german">German</option>
                  <option value="aviation">Aviation</option>
                  <option value="agriculture">Agriculture</option>
                  <option value="music">Music</option>
                  <option value="homescience">Home Science</option>
                  <option value="electricity">Electricity</option>
                  <option value="business">Business</option>
                  <option value="woodwork">Woodwork</option>
                  <option value="art">Art</option>
                  <option value="drawing_design">Drawing and design</option>
                  <option value="building_construction">Building & Construction</option>
                    <option value="power_mechanics">Power Mechanics</option>
  <option value="metal_work">Metal Work</option>
                  <option value="all_subjects">All subjects</option>
                </select>
              </div>
              {/* Year/Term */}
              {sidebarData.category !== 'notes' && (
                <>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="year" className="text-[#ff385c] font-semibold">Year</label>
                    <StyledInput
                      id="year"
                      type="number"
                      value={sidebarData.year}
                      onChange={handleChange}
                      placeholder="e.g. 2023"
                      aria-label="Enter year"
                      className="border-2 border-[#ececec] focus:border-[#ff385c] focus:ring-2 focus:ring-[#ff385c]/20 text-[#222] bg-white rounded-xl"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="term" className="text-[#ff385c] font-semibold">Term</label>
                    <select
                      id="term"
                      value={sidebarData.term}
                      onChange={handleChange}
                      className="bg-white border-2 border-[#ececec] text-[#222] rounded-xl px-4 py-2 focus:border-[#ff385c] focus:ring-2 focus:ring-[#ff385c]/20 outline-none transition"
                      aria-label="Select term"
                    >
                      <option value="">All</option>
                      <option value="1">Term 1</option>
                      <option value="2">Term 2</option>
                      <option value="3">Term 3</option>
                    </select>
                  </div>
                </>
              )}
              <button
                type="submit"
                className="mt-3 w-full rounded-xl bg-[#ff385c] hover:bg-[#e31c5f] transition text-white text-lg font-bold py-3 shadow focus:ring-2 focus:ring-[#ff385c]/30 active:scale-95"
                aria-label="Search"
              >
                Search
              </button>
            </form>
          </div>
        </aside>

        {/* --- Main Results --- */}
        <section className="flex-grow p-4 md:p-6 bg-[#fafafa]">
          {loading ? (
            <div className="text-center text-[#ff385c] animate-pulse">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )}
          {showMore && (
            <div className="text-center mt-6">
              <button
                onClick={handleShowMore}
                className="w-40 rounded-xl bg-[#ff385c] hover:bg-[#e31c5f] transition text-white text-lg font-bold py-3 shadow focus:ring-2 focus:ring-[#ff385c]/30 active:scale-95"
                aria-label="Show more results"
              >
                Show More
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  </div>
);

}
