import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashSidebar from '../components/DashSidebar';
import DashProfile from '../components/DashProfile';
import DashPosts from '../components/DashPosts';
import DashUsers from '../components/DashUsers';
import DashComments from '../components/DashComments';
import UsersDashboard from '../components/UsersDashboard';

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState('');
  // Expanded on desktop by default, collapsed on mobile/tablet
  const [sidebarExpanded, setSidebarExpanded] = useState(() => window.innerWidth >= 1024);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) setTab(tabFromUrl);
  }, [location.search]);

  // Responsive: update expanded/collapsed state on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setSidebarExpanded(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sidebar width (matches Tailwind classes: w-16 = 64px, w-56 = 224px)
  const sidebarWidthCollapsed = 64;
  const sidebarWidthExpanded = 224;
  const isDesktop = windowWidth >= 1024;

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans pt-16 flex overflow-x-hidden">
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
          onToggle={() => setSidebarExpanded((prev) => !prev)}
        />
      </aside>

      {/* Main Content */}
      <main
        className={`
          flex-1 transition-all duration-300
          px-2 sm:px-6 md:px-10 py-8 md:py-10
          flex flex-col items-center
        `}
        style={{
          marginLeft: isDesktop
            ? (sidebarExpanded ? `${sidebarWidthExpanded}px` : `${sidebarWidthCollapsed}px`)
            : `${(sidebarExpanded ? sidebarWidthExpanded : sidebarWidthCollapsed) + (sidebarExpanded ? 0 : 0)}px`, // 10px margin when collapsed on mobile
          transition: 'margin-left 0.3s cubic-bezier(.4,0,.2,1)',
          width: windowWidth < 1024 ? '100vw' : undefined, // Prevents overflow on mobile
          maxWidth: '100vw',
        }}
      >
        <div className="w-full max-w-full sm:max-w-md md:max-w-4xl lg:max-w-6xl xl:max-w-7xl 2xl:max-w-[120rem] px-0 sm:px-2 md:px-1">
          {!tab && (
            <div className="flex flex-col items-center justify-center w-full h-full">
              <h1 className="text-3xl font-bold mb-2 text-[#ff385c]">Welcome to Zaja Files Dashboard</h1>
              <p className="text-lg text-[#484848] mb-8">Storing files has never been easier.</p>
            </div>
          )}
          {tab && (
            <section className="w-full flex-1 ">
              {tab === 'profile' && <DashProfile />}
              {tab === 'posts' && <DashPosts />}
              {tab === 'users' && <DashUsers />}
              {tab === 'comments' && <DashComments />}
              {tab === 'usersDashboard' && <UsersDashboard />}
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
