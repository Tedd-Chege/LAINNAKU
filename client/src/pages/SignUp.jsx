import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage('Please fill out all fields.');
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        return setErrorMessage(data.message);
      }
      setLoading(false);
      if (res.ok) {
        navigate('/sign-in');
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center px-4 pt-16 pb-10">
      <div className="flex flex-col md:flex-row gap-10 w-full max-w-3xl bg-white border border-[#ececec] shadow-2xl rounded-3xl p-8 md:p-12">
        {/* Left */}
        <div className="flex-1 flex flex-col justify-center mb-6 md:mb-0">
          <Link to="/" className="font-extrabold text-4xl text-[#222] hover:underline">
            <span className="px-2 py-1 bg-[#ff385c] rounded-xl text-white mr-2">Zaja</span>
            Files
          </Link>
          <p className="text-base mt-7 text-[#484848] leading-relaxed">
            Welcome to Zaja Files! Sign up with your institution name, email, and password, or use Google for fast access.
          </p>
        </div>

        {/* Right */}
        <div className="flex-1">
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div>
              <Label value="Institution name" className="text-[#ff385c] font-semibold" />
              <TextInput
                type="text"
                placeholder="Institution name"
                id="username"
                onChange={handleChange}
                className="border-2 border-[#ececec] rounded-xl text-[#222] bg-white focus:border-[#ff385c] focus:ring-2 focus:ring-[#ff385c]/20"
              />
            </div>
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
                placeholder="Password"
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
                "Sign Up"
              )}
            </Button>
          
          </form>
          <div className="flex gap-2 text-sm mt-7">
            <span>Have an account?</span>
            <Link to="/sign-in" className="text-[#ff385c] font-semibold hover:underline">
              Sign In
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
