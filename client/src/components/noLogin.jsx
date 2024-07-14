import React from 'react';

const UserDashboard = () => {
  return (
    <div className="container mx-auto p-4">
      <h2>User Dashboard</h2>
      <p>Welcome to LAINNAKU, the organization responsible for creating joint exams for many schools.</p>
      <p>To access the exams, you must log in with a designated account.</p>
      <div className="mt-4">
        <h3>About LAINNAKU</h3>
        <p>
          LAINNAKU is a collaborative organization that aims to provide standardized exams for a consortium of schools.
          Our mission is to enhance educational standards by offering high-quality, joint examinations that are accessible
          to all member schools. Through our efforts, we strive to ensure fairness and uniformity in assessment, thereby
          supporting the academic growth and development of students across the network.
        </p>
        <p>
          For more information or to become a member school, please contact us at{' '}
          <a href="mailto:info@lainnaku.org" className="text-blue-600 hover:underline">info@lainnaku.org</a>.
        </p>
      </div>
    </div>
  );
};

export default UserDashboard;
