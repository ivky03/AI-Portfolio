/*"use client";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-gray-950 bg-opacity-90 backdrop-blur-sm shadow-md text-white py-3">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6">
        <div className="space-x-6 text-sm md:text-base font-medium">
          <a href="#resume" className="hover:text-blue-400 transition">
            Resume
          </a>
          <a href="#experience" className="hover:text-blue-400 transition">
            Experience
          </a>
          <a href="#projects" className="hover:text-blue-400 transition">
            Projects
          </a>

          <a href="#chatbot" className="hover:text-blue-400 transition">
            VickAI-My AI Assistant
          </a>
          <a href="#contact" className="hover:text-blue-400 transition">
            Contact
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;*/
"use client";
import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="sticky top-0 z-50 bg-gray-950 bg-opacity-90 backdrop-blur-sm shadow-md text-white py-3">
      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
        {/* Optional Branding/Logo (Left) */}
        <div className="text-lg font-semibold hidden md:block text-blue-400">
          {/* You can place your name or initials here */}
        </div>

        {/* Centered Navigation Links (Desktop) */}
        <div className="hidden md:flex flex-1 justify-center space-x-6 text-sm md:text-base font-medium">
          <a href="#resume" className="hover:text-blue-400 transition">
            Resume
          </a>
          <a href="#chatbot" className="hover:text-blue-400 transition">
            VickAI
          </a>
          <a href="#experience" className="hover:text-blue-400 transition">
            Experience
          </a>
          <a href="#projects" className="hover:text-blue-400 transition">
            Projects
          </a>

          <a href="#contact" className="hover:text-blue-400 transition">
            Contact
          </a>
        </div>

        {/* Hamburger Icon (Mobile) */}
        <div className="md:hidden">
          <button onClick={toggleMenu}>
            {isOpen ? (
              <XMarkIcon className="w-6 h-6 text-white" />
            ) : (
              <Bars3Icon className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden px-6 pt-2 pb-4 space-y-3 text-sm font-medium text-center bg-gray-950 bg-opacity-95">
          <a
            href="#resume"
            onClick={toggleMenu}
            className="block hover:text-blue-400"
          >
            Resume
          </a>
          <a
            href="#chatbot"
            onClick={toggleMenu}
            className="block hover:text-blue-400"
          >
            VickAI
          </a>
          <a
            href="#experience"
            onClick={toggleMenu}
            className="block hover:text-blue-400"
          >
            Experience
          </a>
          <a
            href="#projects"
            onClick={toggleMenu}
            className="block hover:text-blue-400"
          >
            Projects
          </a>

          <a
            href="#contact"
            onClick={toggleMenu}
            className="block hover:text-blue-400"
          >
            Contact
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
