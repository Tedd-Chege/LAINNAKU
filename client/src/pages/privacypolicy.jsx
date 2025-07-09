import React from 'react';
import DashSidebar from '../components/DashSidebar'; // Adjust path if needed

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-[#fafafa] flex mt-14">
      {/* Sidebar */}
      <div className="hidden md:block w-56 min-h-screen">
        <DashSidebar />
      </div>
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-2  pb-10">
        <div className="w-full max-w-2xl bg-white shadow-xl rounded-3xl p-8 md:p-12 border border-[#ececec]">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-6 text-[#222] tracking-tight">
            Privacy Policy
          </h1>
          <p className="mb-5 text-[#484848] leading-relaxed">
            This Privacy Policy explains how Zaja Files collects, uses, and protects your personal information when you use our platform.
          </p>

          <h2 className="text-2xl font-bold mb-3 text-[#ff385c] mt-8">1. Information We Collect</h2>
          <ul className="list-disc list-inside ml-5 mb-5 text-[#484848]">
            <li>Email addresses for newsletters</li>
            <li>Cookies for site analytics</li>
          </ul>

          <h2 className="text-2xl font-bold mb-3 text-[#ff385c] mt-8">2. How We Use Your Information</h2>
          <ul className="list-disc list-inside ml-5 mb-5 text-[#484848]">
            <li>Send updates and newsletters</li>
            <li>Analyze site traffic and improve our platform</li>
          </ul>

          <h2 className="text-2xl font-bold mb-3 text-[#ff385c] mt-8">3. Data Protection</h2>
          <p className="mb-5 text-[#484848]">
            We use secure servers to store your data and do not share your data with third parties except for our analytics provider.
          </p>

          <h2 className="text-2xl font-bold mb-3 text-[#ff385c] mt-8">4. User Rights</h2>
          <ul className="list-disc list-inside ml-5 mb-5 text-[#484848]">
            <li>Unsubscribe from our newsletters at any time</li>
            <li>Request the deletion of your personal data</li>
          </ul>

          <p className="text-[#484848] mt-6">
            If you have any questions about this Privacy Policy, please contact us at{' '}
            <a href="mailto:email@example.com" className="text-[#ff385c] underline font-semibold">
              email@example.com
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
