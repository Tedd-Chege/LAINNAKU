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
      const res = await fetch('/api/user/signout', {
        method: 'POST',
      });
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
    <div className='fixed w-full z-20 top-0 font-serif'>
      <Navbar className='bg-gradient-to-tl from-[#183153] to-[#2d4739] text-[#bfa76a] shadow-lg border-b border-[#bfa76a]'>
        <Link
          to='/'
          className='self-center whitespace-nowrap text-xl sm:text-2xl font-bold tracking-wider'
        >
          Zaja Files
        </Link>

        {currentUser?.isAdmin || currentUser?.isOverallAdmin || currentUser?.isNormalAdmin ? (
          <Link to='/search'>
            <Button type='submit' className='bg-[#bfa76a] text-[#183153] font-bold border border-[#183153] hover:bg-[#2d4739] hover:text-[#bfa76a] transition-all'>
              Search files
            </Button>
          </Link>
        ) : null}

        <div className='flex gap-2 md:order-2'>
          {currentUser && (
            <Link to={'/dashboard?tab=profile'}>
              <Button className='bg-[#2d4739] text-[#bfa76a] text-sm shadow-md border border-[#bfa76a] font-bold'>
                Profile
              </Button>
            </Link>
          )}

          {currentUser ? (
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar alt='user' img={currentUser.profilePicture} rounded />
              }
            >
              <Dropdown.Header>
                <span className='block text-sm'>@{currentUser.username}</span>
                <span className='block text-sm font-medium truncate'>
                  {currentUser.email}
                </span>
              </Dropdown.Header>
              <Link to={'/dashboard?tab=profile'}>
                <Dropdown.Item>Profile</Dropdown.Item>
              </Link>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
            </Dropdown>
          ) : (
            <Link to='/sign-in'>
              <Button className='bg-[#bfa76a] text-[#183153] font-bold border border-[#183153] hover:bg-[#2d4739] hover:text-[#bfa76a] transition-all'>
                Sign In
              </Button>
            </Link>
          )}
          <Navbar.Toggle />
        </div>
        <Navbar.Collapse>
          <Navbar.Link active={path === '/'} as={'div'}>
            <Link
              to='/'
              className='text-[#bfa76a] hover:text-[#2d4739] transition duration-300 text-xl font-serif'
            >
              Home
            </Link>
          </Navbar.Link>
          <Navbar.Link active={path === '/about'} as={'div'}>
            <Link
              to='/about'
              className='text-[#bfa76a] hover:text-[#2d4739] transition duration-300 text-xl font-serif'
            >
              About
            </Link>
          </Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}
