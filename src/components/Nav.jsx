import React, { useEffect, useState } from 'react';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Curriculums', href: '#curriculums' },
  { name: 'Employees', href: '#employee' },
  { name: 'Achievements', href: '#achievements' },
  { name: 'Colleges', href: '#colleges' },
  { name: 'Contact Us', href: '#contact' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const EnhancedNav = () => {
  const [activeSection, setActiveSection] = useState('Home');

  useEffect(() => {
    const sectionIds = navigation.map((item) => item.href.slice(1)); // Extract section IDs from href
    const sections = sectionIds.map((id) => document.getElementById(id));

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.6, // Adjust the threshold for when the section is considered "active"
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  return (
    <Disclosure as="nav" className="fixed w-full top-0 z-50 bg-gray-900 bg-opacity-95 text-white shadow-2xl">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative flex h-20 items-center justify-between">
              {/* Mobile menu button */}
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <img
                    className="h-16 w-16 rounded-full shadow-lg"
                    src="/images/SETHU_LOGO1.png"
                    alt="Your Company"
                  />
                </div>
                <div className="hidden sm:ml-8 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          activeSection === item.href.slice(1)
                            ? 'text-white bg-indigo-600'
                            : 'text-gray-300 hover:bg-indigo-500 hover:text-white',
                          'px-4 py-3 rounded-md text-base font-semibold transition duration-300 ease-in-out transform hover:scale-110'
                        )}
                        aria-current={activeSection === item.href.slice(1) ? 'page' : undefined}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          <Disclosure.Panel className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-800">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    activeSection === item.href.slice(1)
                      ? 'bg-indigo-500 text-white'
                      : 'text-gray-300 hover:bg-indigo-500 hover:text-white',
                    'block px-3 py-2 rounded-md text-base font-medium'
                  )}
                  aria-current={activeSection === item.href.slice(1) ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default EnhancedNav;
