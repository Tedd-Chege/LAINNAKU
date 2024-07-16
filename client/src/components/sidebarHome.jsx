import React from 'react';
import { HiMenu, HiX } from 'react-icons/hi';
import CommentSection from './CommentSection';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      <div className={`fixed mt-16  left-0 h-full bg-gray-900 text-white transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 w-64 md:w-80`}>
        <div className="p-1">
          <button className="md:hidden absolute top-13 right-[-40px] bg-gray-900 rounded-full p-2" onClick={toggleSidebar}>
            <HiX className="h-6 w-6 text-white" />
          </button>
          
          <h2 className="text-xl font-bold mb-1 text-center">Admin Notifications</h2>
          <div className=" overflow-y-auto h-[calc(100vh-8rem)]">
            <CommentSection />
          </div>
        </div>
      </div>
      {!isOpen && (
        <button
          className="fixed top-4 left-4 md:hidden bg-gray-900 rounded-full p-2"
          onClick={toggleSidebar}
        >
          <HiMenu className="h-6 w-6 text-white" />
        </button>
      )}
    </>
  );
};

export default Sidebar;
