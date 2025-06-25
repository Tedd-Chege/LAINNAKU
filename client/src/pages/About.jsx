import { useSelector } from 'react-redux';

export default function About() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-[#f5f5f3] font-serif'>
      <div className='max-w-2xl mx-auto p-8 text-center bg-white rounded-2xl shadow-2xl border border-[#bfa76a]'>
        <h1 className='text-3xl font-bold text-center my-7 text-[#183153] tracking-wide'>
          About Zaja Files
        </h1>
        <div className='text-[#183153]'>
          <p className='mb-4 text-lg'>
            <span className="font-bold">Zaja Files</span> is a secure, cloud-based platform designed exclusively for schools and institutions to store, organize, and access their important files from anywhere in the world.
          </p>
          <p className='mb-4 text-lg'>
            <span className="font-semibold">Our Mission:</span> To empower educational institutions with timeless, reliable, and secure file management—ensuring that knowledge and resources are always within reach, for today and for generations to come.
          </p>
          <p className='mb-4 text-lg'>
            <span className="font-semibold">Security & Privacy:</span> All files are encrypted and protected with industry-leading security standards. Only authorized users from your institution can access your data.
          </p>
          <div className='mb-4 text-lg text-left'>
            <span className="font-semibold">Benefits for Schools:</span>
            <ul className="list-disc list-inside ml-6 mt-2">
              <li>Centralized, organized file storage for all departments</li>
              <li>Easy access for staff and students, on or off campus</li>
              <li>Automatic backups and disaster recovery</li>
              <li>Professional support and onboarding</li>
            </ul>
          </div>
          <div className="mt-8 border-t pt-6">
            <h2 className="text-xl font-bold mb-2 text-[#2d4739]">Contact & Support</h2>
            <p className="text-base text-gray-700 mb-2">For inquiries or support, call <span className="font-semibold text-[#bfa76a]">0741297780</span>.</p>
            <p className="text-base text-gray-700">Zaja Files — Timeless File Storage for Schools & Institutions.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
