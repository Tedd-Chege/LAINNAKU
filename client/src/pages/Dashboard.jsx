import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashSidebar from '../components/DashSidebar';
import { HiOutlineUpload, HiOutlineDocumentText } from 'react-icons/hi';
import DashProfile from '../components/DashProfile';
import DashPosts from '../components/DashPosts';
import DashUsers from '../components/DashUsers';
import DashComments from '../components/DashComments';
import UsersDashboard from '../components/UsersDashboard';

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  // Dashboard Main Layout
  if (!tab) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex flex-col md:flex-row mt-16 font-sans">
        <aside className="md:w-56 bg-white border-r border-[#ececec]">
          <DashSidebar />
        </aside>
        <main className="flex-grow flex flex-col items-center px-4 py-12">
          <h1 className="text-3xl font-bold mb-2 text-[#ff385c]">Welcome to Zaja Files Dashboard</h1>
          <p className="text-lg text-[#484848] mb-8">Storing files has never been easier.</p>

          {/* Upload Section */}
          <div className="w-full max-w-2xl mb-10 rounded-2xl shadow-xl border border-[#ececec] bg-white p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <input
                type="file"
                className="flex-1 px-5 py-3 bg-[#fafafa] border-2 border-[#ececec] rounded-xl text-[#222] focus:border-[#ff385c] focus:ring-2 focus:ring-[#ff385c]/20 outline-none transition"
                aria-label="Upload file"
              />
              <button
                className="flex gap-2 items-center mt-4 md:mt-0 rounded-xl bg-[#ff385c] hover:bg-[#e31c5f] transition text-white text-lg font-semibold px-6 py-3 shadow focus:ring-2 focus:ring-[#ff385c]/30 active:scale-95"
                aria-label="Upload"
              >
                <HiOutlineUpload className="text-2xl" title="Upload" />
                Upload File
              </button>
            </div>
          </div>

          {/* Recent Files Example */}
          <div className="space-y-4 w-full max-w-2xl">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex items-center gap-4 rounded-2xl shadow border border-[#ececec] bg-white px-6 py-4"
              >
                <HiOutlineDocumentText className="text-[#ff385c] text-3xl" title="File icon" />
                <div>
                  <div className="font-medium text-[#222]">File_{item}.pdf</div>
                  <div className="text-sm text-[#767676]">Uploaded 2025-06-25</div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // Tabs/Sections
  return (
    <div className="min-h-screen flex flex-col md:flex-row mt-16 bg-[#fafafa] font-sans">
      <aside className="md:w-56 bg-white border-r border-[#ececec]">
        <DashSidebar />
      </aside>
      <section className="flex-grow bg-transparent px-4 py-8">
        {tab === 'profile' && <DashProfile />}
        {tab === 'posts' && <DashPosts />}
        {tab === 'users' && <DashUsers />}
        {tab === 'comments' && <DashComments />}
        {tab === 'usersDashboard' && <UsersDashboard />}
      </section>
    </div>
  );
}
