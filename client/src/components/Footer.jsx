import React from 'react';
import { Footer } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { BsFacebook, BsInstagram, BsTwitter } from 'react-icons/bs';

export default function FooterCom() {
  return (
    <div className="w-full font-sans bg-[#fafafa]">
      <Footer container className="border-t border-[#ececec] bg-[#fafafa] text-[#222] shadow-none">
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid w-full justify-between sm:flex md:grid-cols-3 gap-8 mt-4 sm:gap-6">
            <div className="mt-5">
              <Link
                to="/"
                className="self-center whitespace-nowrap text-lg sm:text-2xl font-extrabold text-[#ff385c] tracking-tight hover:underline"
              >
                Zaja <span className="text-[#222]">Files</span>
              </Link>
            </div>
            <div>
              <Footer.Title title="Links" className="text-[#222]" />
              <Footer.LinkGroup col>
                <Footer.Link
                  as={Link}
                  to="/about"
                  className="text-[#222] hover:text-[#ff385c] font-semibold transition"
                >
                  About Zaja Files
                </Footer.Link>
                <Footer.Link
                  as={Link}
                  to="/privacy-policy"
                  className="text-[#222] hover:text-[#ff385c] font-semibold transition"
                >
                  Privacy Policy
                </Footer.Link>
                <Footer.Link
                  as={Link}
                  to="/terms-and-conditions"
                  className="text-[#222] hover:text-[#ff385c] font-semibold transition"
                >
                  Terms and Conditions
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Follow Us" className="text-[#222]" />
              <div className="flex gap-6 mt-4 sm:mt-0 sm:justify-start">
                <a href="#" aria-label="Facebook" className="text-[#ff385c] hover:scale-110 transition-transform">
                  <BsFacebook size={24} />
                </a>
                <a href="#" aria-label="Instagram" className="text-[#ff385c] hover:scale-110 transition-transform">
                  <BsInstagram size={24} />
                </a>
                <a href="#" aria-label="Twitter" className="text-[#ff385c] hover:scale-110 transition-transform">
                  <BsTwitter size={24} />
                </a>
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
