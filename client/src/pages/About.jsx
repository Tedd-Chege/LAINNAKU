export default function About() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f7f7] px-2 py-10">
      <div
        className="
          w-full max-w-2xl mx-auto
          rounded-3xl shadow-xl
          border border-[#ececec]
          bg-white
          px-6 sm:px-10 py-10 sm:py-14
          flex flex-col items-center
          transition-all duration-200
        "
        // Optional: Add a subtle animation on mount
        // style={{ animation: "fadeIn 0.5s" }}
      >
        <h1 className="text-4xl font-bold text-[#222] mb-6 tracking-tight text-center leading-tight">
          About <span className="text-[#ff385c]">Zaja Files</span>
        </h1>

        <p className="mb-6 text-lg text-[#444] leading-relaxed text-center max-w-xl">
          <span className="font-bold text-[#ff385c]">Zaja Files</span> is a secure, cloud-based platform designed for schools and institutions to store, organize, and access their important files from anywhere in the world.
        </p>

        <div className="w-full mb-7 flex flex-col gap-4">
          <div className="bg-[#fafafa] rounded-2xl px-6 py-4 shadow-sm border border-[#ececec]">
            <span className="font-semibold text-[#222]">Our Mission:</span>{" "}
            <span className="text-[#555]">
              To empower educational institutions with timeless, reliable, and secure file management—ensuring that knowledge and resources are always within reach, for today and for generations to come.
            </span>
          </div>
          <div className="bg-[#fafafa] rounded-2xl px-6 py-4 shadow-sm border border-[#ececec]">
            <span className="font-semibold text-[#222]">Security &amp; Privacy:</span>{" "}
            <span className="text-[#555]">
              All files are encrypted and protected with industry-leading security standards. Only authorized users from your institution can access your data.
            </span>
          </div>
        </div>

        <div className="w-full mb-8 text-left">
          <span className="font-semibold text-[#222] block mb-2">
            Benefits for Schools:
          </span>
          <ul className="space-y-1 ml-5 text-[#555] list-disc text-base">
            <li>Centralized, organized file storage for all departments</li>
            <li>Easy access for staff and students, on or off campus</li>
            <li>Automatic backups and disaster recovery</li>
            <li>Professional support and onboarding</li>
          </ul>
        </div>

        <div className="w-full border-t border-[#ececec] pt-6 text-center">
          <h2 className="text-xl font-bold mb-1 text-[#222]">Contact &amp; Support</h2>
          <p className="text-base text-[#444] mb-1">
            For inquiries or support, call{" "}
            <span className="font-semibold text-[#ff385c]">0741297780</span>.
          </p>
          <p className="text-base text-[#888]">
            Zaja Files — Timeless File Storage for Schools &amp; Institutions.
          </p>
        </div>
      </div>
    </div>
  );
}
