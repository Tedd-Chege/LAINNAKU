import React from 'react';
import { Footer } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { BsFacebook, BsInstagram, BsTwitter } from 'react-icons/bs';

export default function FooterCom() {
  return (
    <div className='z-19 w-full font-serif'>
      <Footer container className="border-t-8 border-[#bfa76a] bg-[#f5f5f3] text-[#183153]">
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid w-full justify-between sm:flex md:grid-cols-3 gap-8 mt-4 sm:gap-6">
            <div className="mt-5">
              <Link
                to="/"
                className="self-center whitespace-nowrap text-lg sm:text-2xl font-bold text-[#183153] tracking-wider"
              >
                <span className="px-2 py-1 bg-gradient-to-r from-[#183153] to-[#2d4739] rounded-lg text-[#bfa76a]">
                  Zaja Files
                </span>
              </Link>
            </div>
            <div>
              <Footer.Title title="Links" className="text-[#183153]" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="/about"
                  rel="noopener noreferrer"
                  className="text-[#2d4739] font-bold "
                >
                  About Zaja Files
                </Footer.Link>
                <Footer.Link
                  as={Link}
                  to="/privacy-policy"
                  className="text-[#2d4739] font-bold"
                >
                  Privacy Policy
                </Footer.Link>
                <Footer.Link
                  as={Link}
                  to="/terms-and-conditions"
                  className="text-[#2d4739] font-bold"
                >
                  Terms and Conditions
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Follow Us" className="text-[#183153]" />
              <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-start">
                <Footer.Icon href="#" icon={BsFacebook} className="text-[#183153]" />
                <Footer.Icon href="#" icon={BsInstagram} className="text-[#183153]" />
                <Footer.Icon href="#" icon={BsTwitter} className="text-[#183153]" />
              </div>
            </div>
          </div>
          <Footer.Divider className="border-[#bfa76a]" />
          <div className="w-full sm:flex sm:items-center sm:justify-center">
            <Footer.Copyright
              href="#"
              by="Zaja Files"
              year={new Date().getFullYear()}
              className="text-[#183153]"
            />
          </div>
        </div>
      </Footer>
    </div>
  );
}
