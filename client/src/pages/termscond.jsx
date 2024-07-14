import React from 'react';

const TermsAndConditions = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Terms and Conditions</h1>
      <p className="mb-4">
        By accessing or using the zaja Blog, you agree to the following terms:
      </p>
      <h2 className="text-2xl font-semibold mb-2">1. Use of Content</h2>
      <p className="mb-4">
        You may read and share our blog content, but not for commercial purposes without our permission.
      </p>
      <h2 className="text-2xl font-semibold mb-2">2. User Conduct</h2>
      <p className="mb-4">
        You must not post offensive or harmful content. You are responsible for your comments and posts.
      </p>
      <h2 className="text-2xl font-semibold mb-2">3. Disclaimers</h2>
      <p className="mb-4">
        We do not guarantee the accuracy of the information on our blog. We are not liable for any damages resulting from the use of our blog.
      </p>
      <h2 className="text-2xl font-semibold mb-2">4. Governing Law</h2>
      <p className="mb-4">
        These terms are governed by the laws of Kenya.
      </p>
      <p>
        If you have any questions about these Terms and Conditions, please contact us at <a href="mailto:zajablog25@gmail.com" className="text-blue-600">zajablog25@gmail.com</a>.
      </p>
    </div>
  );
};

export default TermsAndConditions;
