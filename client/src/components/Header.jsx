import React, { useState } from 'react';
import { Avatar, Button, Dropdown, Navbar } from 'flowbite-react';
import { HiHome } from 'react-icons/hi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { signoutSuccess } from '../redux/user/userSlice';

export default function Header() {
  const path = useLocation().pathname;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSignout = async () => {
    try {
      const res = await fetch('/api/user/signout', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?searchTerm=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <div className="fixed w-full z-20 top-0 font-sans">
      <Navbar className="bg-slate-200 text-[#222] shadow border-b border-[#ececec] px-4 py-2 flex items-center justify-between">
        
        {/* Left: Logo + Username */}
        <div className="flex items-center flex-shrink-0">
          <Link
            to="/"
            className="self-center text-2xl md:text-3xl font-extrabold tracking-tight text-[#e23131] hover:underline flex items-center gap-2"
          >
            {/* "Zaja Files" hidden on small screens */}
            <span className="hidden sm:inline">
              Zaja<span className="text-[#222]"> Files</span>
            </span>

            {/* Show username when logged in */}
     {currentUser && (
  <span className="text-base md:text-lg font-bold text-[#222] ml-2 truncate max-w-[120px] sm:max-w-[150px]">
    {currentUser.username}
  </span>
)}

          </Link>
        </div>

        {/* Right: Links and Profile */}
        <div className="flex items-center gap-2 md:gap-4 ml-auto">
          <Link
            to="/"
            className="flex items-center gap-1 text-[#222] hover:text-[#ff385c] transition duration-200 text-lg font-semibold mr-1 md:mr-3"
          >
            <HiHome className="text-xl" /> Home
          </Link>

          {currentUser && (
            <Link to={'/dashboard?tab=profile'}>
              <Button className="bg-[#ff385c] hover:bg-[#e31c5f] text-white rounded-xl text-sm font-semibold shadow border-none transition active:scale-95 mr-1 md:mr-3">
                Profile
              </Button>
            </Link>
          )}

          {currentUser ? (
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar
                  alt="user"
                  img={currentUser.profilePicture}
                  rounded
                  className="header-avatar"
                />
              }
            >
              <Dropdown.Header>
                <span className="block text-sm font-semibold">{currentUser.username}</span>
                <span className="block text-sm font-medium truncate">{currentUser.email}</span>
              </Dropdown.Header>
              <Link to={'/dashboard?tab=profile'}>
                <Dropdown.Item>Profile</Dropdown.Item>
              </Link>
              <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
            </Dropdown>
          ) : (
            <div className="flex gap-2">
              <Link to="/sign-in">
                <Button className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold rounded-xl shadow border-none transition active:scale-95">
                  Sign In
                </Button>
              </Link>
              <Link to="/sign-up">
                <Button className="border-2 border-[#2563eb] text-[#2563eb] font-semibold rounded-xl shadow transition hover:bg-[#2563eb] hover:text-white active:scale-95">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </Navbar>
    </div>
  );
}
