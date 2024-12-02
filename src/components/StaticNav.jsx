import React, { useState } from 'react';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Profile', href: '#profile' },
  { name: 'Achievements', href: '#achievements' },
  { name: 'Colleges', href: '#colleges' },
  { name: 'Review', href: '#StaticReviews' },
  { name: 'Contact Us', href: '#contact' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const StaticNav = ({ activeLink }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  return (
    <Disclosure as="nav" className="fixed w-full top-0 z-50 text-white">
      {({ open }) => (
        <>
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#0a0b1e] via-[#1c0f2e] to-[#0a0b1e] backdrop-blur-md bg-opacity-50 shadow-lg">
            <div className="flex items-center">
              <img className="h-20 w-20 rounded-full shadow-xl" src="/images/SETHU_LOGO1.png" alt="sethu Company" />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden sm:flex ml-auto space-x-10">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={classNames(
                    item.href.slice(1) === activeLink
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-indigo-500 hover:text-white',
                    'px-4 py-2 rounded-lg text-base font-semibold transition duration-300 ease-in-out transform hover:scale-105 shadow-md'
                  )}
                  aria-current={item.href.slice(1) === activeLink ? 'page' : undefined}
                >
                  {item.name}
                </a>
              ))}

              {/* Login Button with Dropdown */}
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center px-4 py-2 bg-gray-800 text-gray-300 hover:bg-indigo-500 hover:text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out"
                >
                  Login <ChevronDownIcon className="w-5 h-5 ml-2" />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gradient-to-b from-indigo-700 via-indigo-800 to-indigo-900 text-white rounded-lg shadow-lg transition-all duration-300 transform origin-top-right">
                    <a
                      href="/login"
                      className="flex items-center px-4 py-2 hover:bg-indigo-600 rounded-md transition duration-200 space-x-2"
                    >
                      <span className="bg-blue-500 p-1 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">A</span>
                      <span>Admin Login</span>
                    </a>
                    <a
                      href="/employee-login"
                      className="flex items-center px-4 py-2 hover:bg-indigo-600 rounded-md transition duration-200 space-x-2"
                    >
                      <span className="bg-green-500 p-1 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">E</span>
                      <span>Employee Login</span>
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="absolute inset-y-0 right-0 flex items-center sm:hidden">
              <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-indigo-200 hover:text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-900">
                <span className="sr-only">Open main menu</span>
                {open ? (
                  <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                )}
              </Disclosure.Button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          <Disclosure.Panel className="sm:hidden">
            <div className="px-2 pt-2 pb-3 bg-gradient-to-r from-[#0a0b1e] via-[#1c0f2e] to-[#0a0b1e] bg-opacity-50">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.href.slice(1) === activeLink
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-blue-500 hover:text-white',
                    'block px-3 py-2 rounded-md text-base font-medium shadow-md'
                  )}
                  aria-current={item.href.slice(1) === activeLink ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}

              {/* Login Dropdown in Mobile */}
              <div className="mt-4">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center px-3 py-2 bg-gray-800 text-gray-300 hover:bg-indigo-500 rounded-md text-base font-medium"
                >
                  Login <ChevronDownIcon className="w-5 h-5 ml-2" />
                </button>
                {isDropdownOpen && (
                  <div className="pl-4 mt-2">
                    <a
                      href="/login"
                      className="flex items-center px-4 py-2 text-gray-300 hover:bg-indigo-600 rounded-md transition duration-200 space-x-2"
                    >
                      <span className="bg-blue-500 p-1 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">A</span>
                      <span>Admin Login</span>
                    </a>
                    <a
                      href="/employee-login"
                      className="flex items-center px-4 py-2 text-gray-300 hover:bg-indigo-600 rounded-md transition duration-200 space-x-2"
                    >
                      <span className="bg-green-500 p-1 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">E</span>
                      <span>Employee Login</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default StaticNav;
