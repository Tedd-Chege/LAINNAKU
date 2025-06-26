import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure('Please fill all the fields'));
    }
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
      }
      if (res.ok) {
        dispatch(signInSuccess(data));
        if (data.isOverallAdmin) {
          navigate("/dashboard?tab=usersDashboard");
        } else {
          navigate('/logged');
        }
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center px-4 pt-16 pb-10">
      <div className="flex flex-col md:flex-row gap-10 w-full max-w-3xl bg-white border border-[#ececec] shadow-2xl rounded-3xl p-8 md:p-12">
        {/* Left */}
        <div className="flex-1 flex flex-col justify-center mb-6 md:mb-0">
          <Link to='/' className='font-extrabold text-4xl text-[#222] hover:underline'>
            <span className='px-2 py-1 bg-[#ff385c] rounded-xl text-white mr-2'>Zaja</span>
            Files
          </Link>
          <p className="text-base mt-7 text-[#484848] leading-relaxed">
            Welcome to Zaja Files! Sign in with your email and password or use Google for fast access.
          </p>
        </div>

        {/* Right */}
        <div className="flex-1">
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div>
              <Label value="Your email" className="text-[#ff385c] font-semibold" />
              <TextInput
                type="email"
                placeholder="name@school.com"
                id="email"
                onChange={handleChange}
                className="border-2 border-[#ececec] rounded-xl text-[#222] bg-white focus:border-[#ff385c] focus:ring-2 focus:ring-[#ff385c]/20"
              />
            </div>
            <div>
              <Label value="Your password" className="text-[#ff385c] font-semibold" />
              <TextInput
                type="password"
                placeholder="**********"
                id="password"
                onChange={handleChange}
                className="border-2 border-[#ececec] rounded-xl text-[#222] bg-white focus:border-[#ff385c] focus:ring-2 focus:ring-[#ff385c]/20"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-1 rounded-xl bg-[#ff385c] hover:bg-[#e31c5f] transition text-white text-lg font-bold py-3 shadow focus:ring-2 focus:ring-[#ff385c]/30 active:scale-95 border-none"
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign In"
              )}
            </Button>
           
          </form>
          <div className="flex gap-2 text-sm mt-7">
            <span>Don't have an account?</span>
            <Link to="/sign-up" className="text-[#ff385c] font-semibold hover:underline">
              Sign Up
            </Link>
          </div>
          {errorMessage && (
            <Alert className="mt-6" color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
