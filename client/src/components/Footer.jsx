import React from 'react';
import { Footer } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { BsFacebook, BsInstagram, BsTwitter } from 'react-icons/bs';

export default function FooterCom() {
  return (
    <div className="w-full font-sans bg-[#fafafa]">
      <Footer container className="border-t border-[#ececec] bg-[#fafafa] text-[#222] shadow-none">
        <div className="w-full max-w-7xl mx-auto">
          <div className="w-full flex flex-col sm:flex-row items-center gap-8 mt-4 sm:gap-6 px-4 sm:px-10 md:px-20 relative">
            {/* Logo centered absolutely */}
            <div className="absolute left-1/2 top-0 transform -translate-x-1/2 z-10 w-max">
              <Link
                to="/"
                className="whitespace-nowrap text-2xl sm:text-3xl font-extrabold text-[#ff385c] tracking-tight hover:underline text-center"
                style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}
              >
                Zaja <span className="text-[#222]">Files</span>
              </Link>
            </div>
            {/* Links on the right */}
            <div className="flex-1 flex justify-end w-full mt-20 sm:mt-0">
              <div className="bg-white/80 border border-[#ececec] rounded-2xl shadow-md px-6 py-4 flex flex-col items-end min-w-[180px]">
                <div
                  className="text-[#000000] underline underline-offset-8 decoration-2 mb-4 text-3xl font-extrabold tracking-wide font-serif text-center w-full py-2 px-2"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  Links
                </div>
                <Footer.LinkGroup col>
                  <Footer.Link
                    as={Link}
                    to="/about"
                    className="mb-2 px-3 py-1.5 rounded-lg bg-[#ff385c] text-white text-sm font-bold shadow hover:bg-[#e31c5f] transition-all border-none focus:outline-none focus:ring-2 focus:ring-[#ff385c]/30 active:scale-95"
                  >
                    About Zaja Files
                  </Footer.Link>
                  <Footer.Link
                    as={Link}
                    to="/privacy-policy"
                    className="mb-2 px-3 py-1.5 rounded-lg bg-[#ff385c] text-white text-sm font-bold shadow hover:bg-[#e31c5f] transition-all border-none focus:outline-none focus:ring-2 focus:ring-[#ff385c]/30 active:scale-95"
                  >
                    Privacy Policy
                  </Footer.Link>
                  <Footer.Link
                    as={Link}
                    to="/terms-and-conditions"
                    className="px-3 py-1.5 rounded-lg bg-[#ff385c] text-white text-sm font-bold shadow hover:bg-[#e31c5f] transition-all border-none focus:outline-none focus:ring-2 focus:ring-[#ff385c]/30 active:scale-95"
                  >
                    Terms and Conditions
                  </Footer.Link>
                </Footer.LinkGroup>
              </div>
            </div>
          </div>
          <Footer.Divider className="border-[#ececec]" />
          <div className="w-full sm:flex sm:items-center sm:justify-center">
            <Footer.Copyright
              href="/"
              by="Zaja Files"
              year={new Date().getFullYear()}
              className="text-[#888]"
            />
          </div>
        </div>
      </Footer>
    </div>
  );
}
