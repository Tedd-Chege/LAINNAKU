import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-4">
        This Privacy Policy explains how zaja Blog collects, uses, and protects your personal information when you visit our blog.
      </p>
      <h2 className="text-2xl font-semibold mb-2">1. Information We Collect</h2>
      <p className="mb-4">
        We may collect the following information:
        <ul className="list-disc list-inside">
          <li>Email addresses for newsletters.</li>
          <li>Cookies for site analytics.</li>
        </ul>
      </p>
      <h2 className="text-2xl font-semibold mb-2">2. How We Use Your Information</h2>
      <p className="mb-4">
        We use your information to:
        <ul className="list-disc list-inside">
          <li>Send updates and newsletters.</li>
          <li>Analyze site traffic and improve our blog.</li>
        </ul>
      </p>
      <h2 className="text-2xl font-semibold mb-2">3. Data Protection</h2>
      <p className="mb-4">
        We use secure servers to store your data and do not share your data with third parties except for our analytics provider.
      </p>
      <h2 className="text-2xl font-semibold mb-2">4. User Rights</h2>
      <p className="mb-4">
        You can:
        <ul className="list-disc list-inside">
          <li>Unsubscribe from our newsletters at any time.</li>
          <li>Request the deletion of your personal data.</li>
        </ul>
      </p>
      <p>
        If you have any questions about this Privacy Policy, please contact us at <a href="mailto:email@example.com" className="text-blue-600">email@example.com</a>.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
