import React, { useState } from 'react';
import { Avatar, Button, Dropdown, Navbar } from 'flowbite-react';
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
      <Navbar className="bg-white text-[#222] shadow border-b border-[#ececec] px-4 py-2">
        <Link
          to="/"
          className="self-center whitespace-nowrap text-2xl md:text-3xl font-extrabold tracking-tight text-[#ff385c] hover:underline"
        >
          Zaja<span className="text-[#222]"> Files</span>
        </Link>

        {/* Optional: search bar */}
        {/* 
        <form onSubmit={handleSubmit} className="hidden md:flex ml-6">
          <input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-xl px-4 py-2 border border-[#ececec] focus:ring-2 focus:ring-[#ff385c]/20 mr-2"
          />
          <Button
            type="submit"
            className="bg-[#ff385c] hover:bg-[#e31c5f] text-white rounded-xl px-5 py-2 font-semibold shadow-sm"
          >
            Search
          </Button>
        </form>
        */}

        <div className="flex gap-2 md:order-2 items-center">
          {currentUser && (
            <Link to={'/dashboard?tab=profile'}>
              <Button className="bg-[#ff385c] hover:bg-[#e31c5f] text-white rounded-xl text-sm font-semibold shadow border-none px-5 py-2 transition active:scale-95">
                Profile
              </Button>
            </Link>
          )}

          {currentUser ? (
            <Dropdown
              arrowIcon={false}
              inline
              label={<Avatar alt="user" img={currentUser.profilePicture} rounded />}
            >
              <Dropdown.Header>
                <span className="block text-sm font-semibold">@{currentUser.username}</span>
                <span className="block text-sm font-medium truncate">{currentUser.email}</span>
              </Dropdown.Header>
              <Link to={'/dashboard?tab=profile'}>
                <Dropdown.Item>Profile</Dropdown.Item>
              </Link>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
            </Dropdown>
          ) : (
            <div className="flex gap-2">
              <Link to="/sign-in">
                <Button className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold rounded-xl px-6 py-2 shadow border-none transition active:scale-95">
                  Sign In
                </Button>
              </Link>
              <Link to="/sign-up">
                <Button className=" border-2 border-[#2563eb] text-[#2563eb] font-semibold rounded-xl px-6 py-2 shadow transition hover:bg-[#2563eb] hover:text-white active:scale-95">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
          <Navbar.Toggle />
        </div>
        <Navbar.Collapse>
          <Navbar.Link active={path === '/'} as="div">
            <Link
              to="/"
              className="text-[#222] hover:text-[#ff385c] transition duration-200 text-lg font-semibold"
            >
              Home
            </Link>
          </Navbar.Link>
          <Navbar.Link active={path === '/about'} as="div">
            <Link
              to="/about"
              className="text-[#222] hover:text-[#ff385c] transition duration-200 text-lg font-semibold"
            >
              About
            </Link>
          </Navbar.Link>
          {(currentUser?.isAdmin || currentUser?.isOverallAdmin || currentUser?.isNormalAdmin) && (
            <Navbar.Link as="div">
              <Link
                to="/search"
                className="text-[#ff385c] font-semibold hover:underline text-lg"
              >
                Search Files
              </Link>
            </Navbar.Link>
          )}
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}
