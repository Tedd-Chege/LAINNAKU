import { Alert, Button, Modal, ModalBody, TextInput } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { HiOutlineExclamationCircle, HiArrowSmRight } from 'react-icons/hi';
import {
  updateStart, updateSuccess, updateFailure,
  deleteUserStart, deleteUserSuccess, deleteUserFailure, signoutSuccess,
} from '../redux/user/userSlice';
import DashSidebar from '../components/DashSidebar';

export default function DashProfile() {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const filePickerRef = useRef();
  const dispatch = useDispatch();

  // Sidebar responsive state
  const [sidebarExpanded, setSidebarExpanded] = useState(() => window.innerWidth >= 1024);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Sidebar width (you can change these)
  const sidebarWidthCollapsed = 44;
  const sidebarWidthExpanded = 140;
  const isDesktop = windowWidth >= 1024;

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setSidebarExpanded(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Profile logic
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
    // eslint-disable-next-line
  }, [imageFile]);

  const uploadImage = async () => {
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError('Could not upload image (File must be less than 2MB)');
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if (Object.keys(formData).length === 0) {
      setUpdateUserError('No changes made');
      return;
    }
    if (imageFileUploading) {
      setUpdateUserError('Please wait for image to upload');
      return;
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User's profile updated successfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

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

  return (
    
     <main
  className="
    flex-1 transition-all duration-300
    px-2 sm:px-6 md:px-10
    flex flex-col items-center
  "
  style={{
    marginLeft: isDesktop
      ? (sidebarExpanded ? `${sidebarWidthExpanded}px` : `${sidebarWidthCollapsed}px`)
      : 0,
    transition: 'margin-left 0.3s cubic-bezier(.4,0,.2,1)',
    width: windowWidth < 1024 ? '100vw' : undefined,
    maxWidth: '100vw', // never allow overflow
  }}
>
  <div className="
    w-full
    max-w-full
    sm:max-w-md
    md:max-w-2xl
    lg:max-w-3xl
    xl:max-w-4xl
    2xl:max-w-6xl
    px-0 
  ">
          <h1 className="my-7 text-center font-extrabold text-3xl text-[#222]">Profile</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 bg-white border border-[#ececec] rounded-3xl p-7 md:p-10 lg:p-14 shadow-lg transition-all duration-300">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={filePickerRef}
              hidden
            />
            <div
              className="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 self-center cursor-pointer shadow-lg overflow-hidden rounded-full border-4 border-[#ff385c] group transition-all duration-300"
              onClick={() => filePickerRef.current.click()}
            >
              {imageFileUploadProgress && (
                <CircularProgressbar
                  value={imageFileUploadProgress || 0}
                  text={`${imageFileUploadProgress}%`}
                  strokeWidth={6}
                  styles={{
                    root: {
                      width: '100%',
                      height: '100%',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      zIndex: 10,
                    },
                    path: {
                      stroke: `#ff385c`,
                    },
                    text: {
                      fill: '#ff385c',
                      fontSize: '18px',
                      fontWeight: 700,
                    },
                  }}
                />
              )}
              <img
                src={imageFileUrl || currentUser.profilePicture}
                alt="user"
                className={`rounded-full w-full h-full object-cover border-4 border-white transition-all duration-300 ${
                  imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-60'
                } group-hover:opacity-80`}
              />
            </div>
            {imageFileUploadError && <Alert color="failure">{imageFileUploadError}</Alert>}
            <TextInput
              type="text"
              id="username"
              placeholder="username"
              defaultValue={currentUser.username}
              onChange={handleChange}
              className="border-2 border-[#ececec] rounded-xl text-[#222] bg-white focus:border-[#ff385c] focus:ring-2 focus:ring-[#ff385c]/20"
            />
            <TextInput
              type="email"
              id="email"
              placeholder="email"
              defaultValue={currentUser.email}
              onChange={handleChange}
              className="border-2 border-[#ececec] rounded-xl text-[#222] bg-white focus:border-[#ff385c] focus:ring-2 focus:ring-[#ff385c]/20"
            />
            <TextInput
              type="password"
              id="password"
              placeholder="password"
              onChange={handleChange}
              className="border-2 border-[#ececec] rounded-xl text-[#222] bg-white focus:border-[#ff385c] focus:ring-2 focus:ring-[#ff385c]/20"
            />
            <Button
              type="submit"
              className="bg-[#ff385c] hover:bg-[#e31c5f] w-full rounded-xl text-white font-bold py-3 shadow transition active:scale-95 border-none"
              disabled={loading || imageFileUploading}
            >
              {loading ? 'Loading...' : 'Update'}
            </Button>
          </form>

          <div className="flex gap-4 mt-7">
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-[#ffe3ea] text-[#ff385c] font-bold px-4 py-2 rounded-xl shadow hover:bg-[#ff385c] hover:text-white transition active:scale-95 border border-[#ff385c] focus:outline-none"
              type="button"
            >
              <HiOutlineExclamationCircle className="w-5 h-5" />
              Delete Account
            </button>
            <button
              onClick={handleSignout}
              className="flex items-center gap-2 bg-[#e3f0ff] text-[#225bb5] font-bold px-4 py-2 rounded-xl shadow hover:bg-[#225bb5] hover:text-white transition active:scale-95 border border-[#225bb5] focus:outline-none"
              type="button"
            >
              <HiArrowSmRight className="w-5 h-5" />
              Sign Out
            </button>
          </div>

          {updateUserSuccess && (
            <Alert color="success" className="mt-5">
              {updateUserSuccess}
            </Alert>
          )}
          {updateUserError && (
            <Alert color="failure" className="mt-5">
              {updateUserError}
            </Alert>
          )}
          {error && (
            <Alert color="failure" className="mt-5">
              {error}
            </Alert>
          )}
          <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
            <Modal.Header />
            <ModalBody>
              <div className="text-center">
                <HiOutlineExclamationCircle className="h-14 w-14 text-[#ff385c] mb-4 mx-auto" />
                <h3 className="mb-5 text-lg text-gray-500">
                  Are you sure you want to delete your account?
                </h3>
                <div className="flex justify-center gap-4">
                  <Button color="failure" onClick={handleDeleteUser} className="rounded-xl px-5">
                    Yes, I'm sure
                  </Button>
                  <Button color="gray" onClick={() => setShowModal(false)} className="rounded-xl px-5">
                    No, cancel
                  </Button>
                </div>
              </div>
            </ModalBody>
          </Modal>
        </div>
      </main>
   
  );
}
