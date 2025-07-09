import React from 'react';
import DashSidebar from '../components/DashSidebar'; // Adjust the path if needed

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-[#fafafa] flex mt-14">
      {/* Sidebar */}
      <div className="hidden md:block w-56 min-h-screen">
        <DashSidebar />
      </div>
      {/* Main Content */}
      <div className="flex-1 flex items-start justify-center px-2 ">
        <div className="mt-16 w-full max-w-2xl bg-white shadow-lg rounded-md p-6">
          <h1 className="text-3xl font-bold mb-4 text-gray-800">Terms and Conditions</h1>
          <p className="mb-4 text-gray-600">
            By accessing or using Lainnaku, you agree to the following terms:
          </p>
          <h2 className="text-2xl font-semibold mb-2 text-gray-700">1. Use of Content</h2>
          <p className="mb-4 text-gray-600">
            You may read and share our blog content, but not for commercial purposes without our permission.
          </p>
          <h2 className="text-2xl font-semibold mb-2 text-gray-700">2. User Conduct</h2>
          <p className="mb-4 text-gray-600">
            You must not post offensive or harmful content. You are responsible for your comments and posts.
          </p>
          <h2 className="text-2xl font-semibold mb-2 text-gray-700">3. Disclaimers</h2>
          <p className="mb-4 text-gray-600">
            We do not guarantee the accuracy of the information on our blog. We are not liable for any damages resulting from the use of our blog.
          </p>
          <h2 className="text-2xl font-semibold mb-2 text-gray-700">4. Governing Law</h2>
          <p className="mb-4 text-gray-600">
            These terms are governed by the laws of Kenya.
          </p>
          <p className="text-gray-600">
            If you have any questions about these Terms and Conditions, please contact us at{' '}
            <a href="mailto:email@example.com" className="text-blue-600 underline">
              email@example.com
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
