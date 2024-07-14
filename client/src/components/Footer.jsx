import React from 'react';
import { Footer } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { BsFacebook, BsInstagram, BsTwitter } from 'react-icons/bs';

export default function FooterCom() {
  return (
    <div className='z-19 w-full'>
      <Footer container className="border border-t-8 border-green-500 bg-white text-black">
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid w-full justify-between sm:flex md:grid-cols-3 gap-8 mt-4 sm:gap-6">
            <div className="mt-5">
              <Link
                to="/"
                className="self-center whitespace-nowrap text-lg sm:text-xl font-semibold text-black"
              >
                <span className="px-2 py-1 bg-gradient-to-r from-orange-500 to-green-400  rounded-lg text-white">
                  LAINNAKU
                </span>
              </Link>
            </div>
            <div>
              <Footer.Title title="Links"  />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="/about"
                  rel="noopener noreferrer"
                  className="text-blue-600 font-bold "
                  
                >
                  About LAINNAKU
                </Footer.Link>
                <Footer.Link
                  as={Link}
                  to="/privacy-policy"
                  className="text-blue-600 font-bold"
                >
                  Privacy Policy
                </Footer.Link>
                <Footer.Link
                  as={Link}
                  to="/terms-and-conditions"
                  className="text-blue-600 font-bold"
                >
                  Terms and Conditions
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Follow Us" className="text-black" />
              <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-start">
                <Footer.Icon href="#" icon={BsFacebook} className="text-black" />
                <Footer.Icon href="#" icon={BsInstagram} className="text-black" />
                <Footer.Icon href="#" icon={BsTwitter} className="text-black" />
              </div>
            </div>
          </div>
          <Footer.Divider className="border-gray-300" />
          <div className="w-full sm:flex sm:items-center sm:justify-center">
            <Footer.Copyright
              href="#"
              by="LAINNAKU"
              year={new Date().getFullYear()}
              className="text-black"
            />
          </div>
        </div>
      </Footer>
    </div>
  );
}
