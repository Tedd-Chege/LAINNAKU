import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';

const UpdatePost = () => {
  const {postId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState('');
  const [category, setCategory] = useState('notes');
  const [subject, setSubject] = useState('math');
  const [year, setYear] = useState('');
  const [term, setTerm] = useState('');
  const [form, setForm] = useState('1');
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await axios.get(`/api/files/getposts/${postId}`);
        const post = response.data;
        setFileUrl(post.fileUrl);
        setCategory(post.category);
        setSubject(post.subject);
        setYear(post.year);
        setTerm(post.term);
        setForm(post.form);
        setDescription(post.description);
        setTitle(post.title);
      } catch (error) {
        console.error('Error fetching post data:', error);
      }
    };

    fetchPostData();
  }, [postId]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const storeFile = async (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        () => {},
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((url) => {
              resolve(url);
            })
            .catch(reject);
        }
      );
    });
  };

  const handleFileSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const url = await storeFile(file);
      setFileUrl(url);
      setFile(null);
      setUploading(false);
    } catch (error) {
      setError('File upload failed (10MB max per file)');
      setUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setFileUrl('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fileUrl) {
      setError('You must upload a file');
      return;
    }

    const formData = {
      fileUrl,
      category,
      subject,
      year: category === 'notes' ? '' : year,
      term: category === 'notes' ? '' : term,
      form,
      description,
      title,
    };

    try {
      await axios.put(`/api/files/updatepost/${postId}`, formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`, // Assuming currentUser has a token property
        },
      });

      alert('Post updated successfully');
      navigate('/dashboard?tab=profile');
    } catch (error) {
      console.error(error);
      setError('Failed to update post');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Update Post</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700">Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700">Select File:</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          
          />
          <button
            type="button"
            onClick={handleFileSubmit}
            disabled={uploading}
            className="mt-2 w-full py-2 px-4 bg-green-600 text-white font-bold rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
          {error && <p className="text-red-700 mt-2">{error}</p>}
        </div>
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700">Uploaded File:</label>
          {fileUrl && (
            <div className="flex justify-between border items-center p-3">
              <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {file ? file.name : 'Uploaded File'}
              </a>
              <button
                type="button"
                className="p-2 text-red-700 rounded-lg hover:opacity-80"
                onClick={handleRemoveFile}
              >
                Delete
              </button>
            </div>
          )}
        </div>
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700">Category:</label>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              if (e.target.value === 'notes') {
                setYear('');
                setTerm('');
              }
            }}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          >
            <option value="notes">Notes</option>
            <option value="exams">Exams</option>
            <option value="results">Results</option>
            <option value="marking_scheme">Marking Scheme</option>
          </select>
        </div>
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700">Subject:</label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          >
            <option value="math">Math</option>
            <option value="english">English</option>
            <option value="Kiswahili">Kiswahili</option>
            <option value="biology">Biology</option>
            <option value="chemistry">Chemistry</option>
            <option value="physics">Physics</option>
            <option value="geography">Geography</option>
            <option value="history">History</option>
            <option value="cre">CRE</option>
            <option value="business">Business</option>
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
            <option value="drawing_design">Drawing and design</option>
            <option value="art">Art</option>
            <option value="building_construction">Building & Construction</option>
            <option value="all_subjects">all subjects</option>
          </select>
        </div>
        {category !== 'notes' && (
          <>
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700">Year:</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700">Term:</label>
              <select
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
            </div>
          </>
        )}
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700">Form:</label>
          <select
            value={form}
            onChange={(e) => setForm(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </div>
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700">Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white font-bold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Update Post
        </button>
        {error && <p className="text-red-700 mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default UpdatePost;
