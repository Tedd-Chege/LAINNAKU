import React from 'react';

const UserDashboard = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f3] font-serif">
      <div className="container mx-auto p-10 bg-white shadow-2xl rounded-2xl border border-[#bfa76a] max-w-3xl">
        <h1 className="text-4xl font-bold mb-4 text-center text-[#183153] tracking-wide">Zaja Files</h1>
        <p className="text-xl mb-6 text-[#183153] text-center italic font-light">
          Timeless File Storage for Schools & Institutions
        </p>
        <div className="mt-8">
          <h3 className="text-2xl font-semibold mb-4 text-[#2d4739]">Why Zaja Files?</h3>
          <ul className="text-base mb-6 text-gray-800 list-disc list-inside text-left">
            <li className="mb-2"><span className="font-semibold">Secure Cloud Storage:</span> Your institution’s files are encrypted and safely stored for access anytime, anywhere.</li>
            <li className="mb-2"><span className="font-semibold">Organized & Reliable:</span> Keep all your documents, exams, and resources in one place, organized by school and department.</li>
            <li className="mb-2"><span className="font-semibold">Easy Access:</span> Authorized staff and students can access files from any device, on or off campus.</li>
            <li className="mb-2"><span className="font-semibold">Professional Support:</span> Our team is ready to help your institution transition to the future of file management.</li>
          </ul>
          <div className="flex flex-col items-center mt-8">
            <a href="/sign-up" className="bg-[#183153] hover:bg-[#2d4739] text-[#bfa76a] font-bold py-3 px-8 rounded-lg shadow-lg transition-all duration-200 text-lg uppercase tracking-wider border border-[#bfa76a]">
              Get Started
            </a>
            <p className="mt-4 text-gray-600 text-center text-sm">For schools and institutions only</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
