import React from 'react';
import { Button, Select, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';

export default function Search() {
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
    <div className='flex flex-col md:flex-row mt-16'>
      <div className='p-5 border-b md:border-r md:min-h-screen border-gray-500 bg-gray-900'>
        <form className='flex flex-col gap-3' onSubmit={handleSubmit}>
          <div className='flex flex-col gap-2'>
            <label htmlFor='category' className='text-white'>
              Category
            </label>
            <Select
              id='category'
              value={sidebarData.category}
              onChange={handleChange}
              className='border-blue-500 text-black'
            >
              <option value=''>All</option>
              <option value='notes'>Notes</option>
              <option value='exams'>Exams</option>
              <option value='results'>Results</option>
              <option value='marking_scheme'>Marking Schemes</option>
            </Select>
          </div>

          <div className='flex flex-col gap-2'>
            <label htmlFor='form' className='text-white'>
              Form
            </label>
            <Select
              id='form'
              value={sidebarData.form}
              onChange={handleChange}
              className='border-blue-500 text-black'
            >
              <option value=''>All</option>
              <option value='1'>Form 1</option>
              <option value='2'>Form 2</option>
              <option value='3'>Form 3</option>
              <option value='4'>Form 4</option>
            </Select>
          </div>

          <div className='flex flex-col gap-2'>
            <label htmlFor='subject' className='text-white'>
              Subject
            </label>
            <Select
              id='subject'
              value={sidebarData.subject}
              onChange={handleChange}
              className='border-blue-500 text-black'
            >
              <option value=''>All</option>
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
            <option value="all_subjects">all subjects</option>
            </Select>
          </div>

          {sidebarData.category !== 'notes' && (
            <>
              <div className='flex flex-col gap-2'>
                <label htmlFor='year' className='text-white'>
                  Year
                </label>
                <TextInput
                  id='year'
                  type='number'
                  value={sidebarData.year}
                  onChange={handleChange}
                  placeholder='e.g. 2023'
                  className='border-blue-500 text-black'
                />
              </div>

              <div className='flex flex-col gap-2'>
                <label htmlFor='term' className='text-white'>
                  Term
                </label>
                <Select
                  id='term'
                  value={sidebarData.term}
                  onChange={handleChange}
                  className='border-blue-500 text-black'
                >
                  <option value=''>All</option>
                  <option value='1'>Term 1</option>
                  <option value='2'>Term 2</option>
                  <option value='3'>Term 3</option>
                </Select>
              </div>
            </>
          )}

          <Button className='bg-orange-500 hover:bg-blue-600 text-white' type='submit'>Search</Button>
        </form>
      </div>

      <div className='p-7 flex-grow bg-white'>
        {loading ? (
          <div className='text-center text-orange-600'>Loading...</div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
        {showMore && (
          <div className='text-center mt-4'>
            <Button className='bg-blue-500 hover:bg-blue-600 text-white' onClick={handleShowMore}>Show More</Button>
          </div>
        )}
      </div>
    </div>
  );
}
