import React from 'react';
import GlassCard from './GlassCard';
import PrimaryButton from './PrimaryButton';

const UserDashboard = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] font-sans">
      <GlassCard className="container mx-auto max-w-3xl p-8 rounded-3xl shadow-2xl border border-gray-200">
        <h1 className="text-4xl font-extrabold mb-4 text-center text-black tracking-wide">
          Zaja Files
        </h1>
        <p className="text-xl mb-6 text-gray-700 text-center italic font-normal">
          Timeless File Storage for Schools & Institutions
        </p>
        <div className="mt-8">
          <h3 className="text-2xl font-bold mb-4 text-black">Why Zaja Files?</h3>
          <ul className="text-base mb-6 text-black list-disc list-inside text-left space-y-2">
            <li>
              <span className="font-semibold">Secure Cloud Storage:</span> Your institution’s files are encrypted and safely stored for access anytime, anywhere.
            </li>
            <li>
              <span className="font-semibold">Organized & Reliable:</span> Keep all your documents, exams, and resources in one place, organized by school and department.
            </li>
            <li>
              <span className="font-semibold">Easy Access:</span> Authorized staff and students can access files from any device, on or off campus.
            </li>
            <li>
              <span className="font-semibold">Professional Support:</span> Our team is ready to help your institution transition to the future of file management.
            </li>
          </ul>
          <div className="flex flex-col items-center mt-8">
            
            <p className="mt-4 text-gray-500 text-center text-sm">
              For schools and institutions only
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default UserDashboard;
