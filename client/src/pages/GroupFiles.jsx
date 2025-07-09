import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';
import DashSidebar from '../components/DashSidebar'; // Update path if needed!

export default function GroupFiles() {
  const location = useLocation();
  const navigate = useNavigate();
  const { groupInfo } = location.state || {};

  // Responsive sidebar logic to match Dashboard/logged
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [sidebarExpanded, setSidebarExpanded] = useState(window.innerWidth >= 1024); // expanded by default on large screens
  const sidebarWidthCollapsed = 104; // px (w-16)
  const sidebarWidthExpanded = 224; // px (w-56)

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 1024) {
        setSidebarExpanded(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!groupInfo) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-md p-6 text-center text-[#222]">
          No files found for this group.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans pt-16 flex">
      {/* Sidebar overlay for mobile */}
      {windowWidth < 1024 && sidebarExpanded && (
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
          ${windowWidth < 1024 && sidebarExpanded ? 'lg:hidden' : ''}
        `}
        style={{
          minHeight: 'calc(100vh - 4rem)',
          flexShrink: 0,
        }}
      >
        <DashSidebar
          expanded={sidebarExpanded || windowWidth >= 1024}
          onToggle={() => {
            if (windowWidth < 1024) setSidebarExpanded(e => !e);
          }}
        />
      </aside>

      {/* Main Content */}
      <main
        className={`
          flex-1 transition-all duration-300
          px-2 sm:px-6 md:px-10 py-8 md:py-10
        `}
        style={{
          marginLeft:
            windowWidth >= 1024
              ? `${sidebarWidthExpanded + 40}px` // extra left margin for large screens
              : sidebarExpanded
                ? `${sidebarWidthExpanded}px`
                : `${sidebarWidthCollapsed}px`,
          transition: 'margin-left 0.3s cubic-bezier(.4,0,.2,1)',
        }}
      >
        <div className="max-w-5xl mx-auto">
          <button
            className="
              mb-6 flex items-center gap-2 text-[#ff385c] font-semibold 
              bg-white rounded-full px-4 py-2 shadow-sm border border-[#ececec]
              hover:bg-[#ffe3ea] hover:underline active:scale-95 transition
            "
            onClick={() => navigate(-1)}
          >
            <span className="text-xl">&larr;</span> Back
          </button>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#222] mb-7 tracking-tight">
            Files for {groupInfo.year} – Term {groupInfo.term} – {groupInfo.examType}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {groupInfo.files.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
