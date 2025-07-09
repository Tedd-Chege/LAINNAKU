import {
  HiMenu, HiPlusCircle, HiDocumentText, HiOutlineFolder, HiOutlineUserGroup, HiOutlineSearch,
} from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

const navItems = [
  { icon: HiPlusCircle, label: "Add Files", to: "/create-post1", admin: true },
  { icon: HiOutlineSearch, label: "Search Files", to: "/search" },
  { icon: HiDocumentText, label: "All Files", to: "/", admin: true },
  { icon: HiOutlineFolder, label: "File Management", to: "/dashboard?tab=posts", overallAdmin: true },
  { icon: HiOutlineUserGroup, label: "User Management", to: "/dashboard?tab=usersDashboard", overallAdmin: true },
];

export default function DashSidebar({ expanded, onToggle }) {
  const { currentUser } = useSelector((state) => state.user);
  // Local expanded state if not provided by parent
  const [internalExpanded, setInternalExpanded] = useState(() => window.innerWidth >= 1024);
  const isControlled = typeof expanded === 'boolean' && typeof onToggle === 'function';
  const [windowWidth, setWindowWidth] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 1024));
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(typeof window !== 'undefined' ? window.innerWidth : 1024);
      if (!isControlled) {
        setInternalExpanded(window.innerWidth >= 1024);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isControlled]);
  // Always expanded on large screens, controlled/collapsible on small screens
  const realExpanded = windowWidth >= 1024 ? true : (isControlled ? expanded : internalExpanded);

  useEffect(() => {
    const handleResize = () => {
      if (!isControlled) {
        setInternalExpanded(window.innerWidth >= 1024);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isControlled]);

  const handleToggle = () => {
    if (isControlled) {
      onToggle();
    } else {
      setInternalExpanded((prev) => !prev);
    }
  };

  return (
    <>
      <div
        className={`
          fixed z-50 left-0 h-full
          flex flex-col items-center py-4
          bg-white/90 backdrop-blur-lg shadow-2xl border-r border-[#ececec]
          transition-all duration-300
          ${realExpanded ? "w-56" : "w-16"}
        `}
        style={{ minHeight: '100vh' }}
      >
        {/* Hamburger */}
        <button
          onClick={handleToggle}
          className={`
            mb-8 p-2 rounded-lg transition
            ${realExpanded ? "bg-[#ff385c] text-white" : "bg-transparent text-[#ff385c]"}
            shadow-lg hover:bg-[#ff385c] hover:text-white
            z-50
          `}
          style={{ outline: "none", border: "none" }}
          aria-label={realExpanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          <HiMenu className="h-7 w-7" />
        </button>

        {/* Nav icons & labels */}
        <nav className="flex flex-col items-center w-full gap-2">
          {navItems.map((item) => {
            if (item.admin && !currentUser?.isAdmin) return null;
            if (item.overallAdmin && !currentUser?.isOverallAdmin) return null;
            // Only show one "File Management" link for overallAdmin, and one "All Files" for admin
            if (item.label === "File Management" && currentUser?.isAdmin && !currentUser?.isOverallAdmin) return null;
            if (item.label === "All Files" && !currentUser?.isAdmin) return null;
            return (
              <Link
                to={item.to}
                key={item.label}
                className="w-full"
              >
                <div className={`
                  flex items-center gap-3 w-full px-3 py-3 my-1
                  rounded-xl cursor-pointer
                  hover:bg-[#ff385c]/20 transition
                  ${realExpanded ? "justify-start" : "justify-center"}
                `}>
                  <item.icon className="w-6 h-6 text-[#222]" />
                  {realExpanded && <span className="text-[#222] font-medium">{item.label}</span>}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
      {/* Overlay for mobile only when expanded */}
      {realExpanded && typeof window !== 'undefined' && window.innerWidth < 1024 && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
          onClick={handleToggle}
        />
      )}
    </>
  );
}
