import React from 'react';

const UserDashboard = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="container mx-auto p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold mb-4 text-center text-blue-600">User Dashboard</h2>
        <p className="text-lg mb-6 text-gray-700 text-center">
          Welcome to <span className="font-bold">LAINNAKU</span>, the organization responsible for creating joint exams for many schools.
        </p>
        <p className="text-lg mb-6 text-gray-700 text-center">
          To access the exams, you must log in with a designated account.
        </p>
        <div className="mt-8">
          <h3 className="text-2xl font-semibold mb-4 text-green-600">About LAINNAKU</h3>
          <p className="text-base mb-4 text-gray-700">
            <span className="font-semibold">LAINNAKU</span> is a collaborative organization that aims to provide standardized exams for a consortium of schools.
            Our mission is to enhance educational standards by offering high-quality, joint examinations that are accessible
            to all member schools. Through our efforts, we strive to ensure fairness and uniformity in assessment, thereby
            supporting the academic growth and development of students across the network.
          </p>
          <p className="text-base text-gray-700">
            For more information or to become a member school, please contact us at{' '}
            <a href="mailto:info@lainnaku.org" className="text-blue-600 hover:underline">info@lainnaku.org</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
