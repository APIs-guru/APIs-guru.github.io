'use client';
import React, { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      {/* Mobile header */}
      <div className="fixed w-full z-50 bg-white border-b border-gray-200 md:hidden">
        <div className="flex items-center justify-between px-4 h-14">
          <button
            className="toggle-button relative flex-none w-[35px] h-[30px] my-auto mx-2 cursor-pointer"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span
              className={cn(
                "absolute h-[6px] w-full bg-amber-400 rounded-lg opacity-100 left-0 transition-all duration-250 ease-in-out",
                mobileMenuOpen ? "top-3 w-0 left-1/2" : "top-0"
              )}
            ></span>
            <span
              className={cn(
                "absolute h-[6px] w-full bg-amber-400 rounded-lg opacity-100 left-0 top-3 transition-all duration-250 ease-in-out",
                mobileMenuOpen ? "rotate-45" : ""
              )}
            ></span>
            <span
              className={cn(
                "absolute h-[6px] w-full bg-amber-400 rounded-lg opacity-100 left-0 top-3 transition-all duration-250 ease-in-out",
                mobileMenuOpen ? "-rotate-45" : ""
              )}
            ></span>
            <span
              className={cn(
                "absolute h-[6px] w-full bg-amber-400 rounded-lg opacity-100 left-0 transition-all duration-250 ease-in-out",
                mobileMenuOpen ? "top-[18px] w-0 left-1/2" : "top-6"
              )}
            ></span>
          </button>
          <div className="text-center font-bold text-xl leading-[3.5rem]">
            APIS.GURU
          </div>
        </div>
      </div>

      {/* Desktop header */}
      <header
        id="menu"
        className={cn(
          "site-header fixed w-full z-40 bg-white border-b border-gray-200 overflow-hidden hidden md:block",
          mobileMenuOpen ? "slideout-menu block" : ""
        )}
      >
        <nav className="site-nav w-full text-center leading-[3.5rem] px-4">
          <Link
            href="/"
            className={cn(
              "relative inline-block align-middle text-gray-800 leading-normal px-4 mx-2 box-border outline-none",
              "hover:after:transform hover:after:scale-x-100 hover:after:block hover:after:content-[''] hover:after:border-b-2 hover:after:border-amber-500 hover:after:w-full",
              "after:block after:content-[''] after:border-b-2 after:border-amber-500 after:w-full after:transform after:scale-x-0 after:transition-all after:duration-200 after:ease"
            )}
          >
            Browse APIs
          </Link>
          <Link
            href="/about"
            className={cn(
              "relative inline-block align-middle text-gray-800 leading-normal px-4 mx-2 box-border outline-none",
              "hover:after:transform hover:after:scale-x-100 hover:after:block hover:after:content-[''] hover:after:border-b-2 hover:after:border-amber-500 hover:after:w-full",
              "after:block after:content-[''] after:border-b-2 after:border-amber-500 after:w-full after:transform after:scale-x-0 after:transition-all after:duration-200 after:ease"
            )}
          >
            About
          </Link>
          <Link
            href="/api-doc"
            className={cn(
              "relative inline-block align-middle text-gray-800 leading-normal px-4 mx-2 box-border outline-none",
              "hover:after:transform hover:after:scale-x-100 hover:after:block hover:after:content-[''] hover:after:border-b-2 hover:after:border-amber-500 hover:after:w-full",
              "after:block after:content-[''] after:border-b-2 after:border-amber-500 after:w-full after:transform after:scale-x-0 after:transition-all after:duration-200 after:ease"
            )}
          >
            Our API
          </Link>
          <Link
            href="/add-api"
            className={cn(
              "relative inline-block align-middle text-gray-800 leading-normal px-4 mx-2 box-border outline-none",
              "hover:after:transform hover:after:scale-x-100 hover:after:block hover:after:content-[''] hover:after:border-b-2 hover:after:border-amber-500 hover:after:w-full",
              "after:block after:content-[''] after:border-b-2 after:border-amber-500 after:w-full after:transform after:scale-x-0 after:transition-all after:duration-200 after:ease"
            )}
          >
            Add API
          </Link>
          <Link
            href="https://blog.apis.guru/"
            className={cn(
              "relative inline-block align-middle text-gray-800 leading-normal px-4 mx-2 box-border outline-none",
              "hover:after:transform hover:after:scale-x-100 hover:after:block hover:after:content-[''] hover:after:border-b-2 hover:after:border-amber-500 hover:after:w-full",
              "after:block after:content-[''] after:border-b-2 after:border-amber-500 after:w-full after:transform after:scale-x-0 after:transition-all after:duration-200 after:ease"
            )}
          >
            Blog
          </Link>
          <Link
            href="https://apis.guru/awesome-openapi3/"
            className={cn(
              "relative inline-block align-middle text-gray-800 leading-normal px-4 mx-2 box-border outline-none",
              "hover:after:transform hover:after:scale-x-100 hover:after:block hover:after:content-[''] hover:after:border-b-2 hover:after:border-amber-500 hover:after:w-full",
              "after:block after:content-[''] after:border-b-2 after:border-amber-500 after:w-full after:transform after:scale-x-0 after:transition-all after:duration-200 after:ease"
            )}
          
          >
        OpenAPI Tools
          </Link>
        </nav>
      </header>

      {/* Mobile menu slideout panel */}
      <div
        className={cn(
          "fixed inset-0 z-30 w-[255px] overflow-y-auto border-r border-gray-100 bg-white pt-14",
          mobileMenuOpen ? "block" : "hidden"
        )}
      >
        <nav className="w-full">
          <Link
            href="/"
            className="block py-3 px-6 border-b border-gray-100 text-gray-700 hover:bg-gray-50"
            onClick={() => setMobileMenuOpen(false)}
          >
            Browse APIs
          </Link>
          <Link
            href="/about"
            className="block py-3 px-6 border-b border-gray-100 text-gray-700 hover:bg-gray-50"
            onClick={() => setMobileMenuOpen(false)}
          >
            About
          </Link>
          <Link
            href="/api-doc"
            className="block py-3 px-6 border-b border-gray-100 text-gray-700 hover:bg-gray-50"
            onClick={() => setMobileMenuOpen(false)}
          >
            Our API
          </Link>
          <Link
            href="/add-api"
            className="block py-3 px-6 border-b border-gray-100 text-gray-700 hover:bg-gray-50"
            onClick={() => setMobileMenuOpen(false)}
          >
            Add API
          </Link>
          <Link
            href="https://blog.apis.guru/"
            className="block py-3 px-6 border-b border-gray-100 text-gray-700 hover:bg-gray-50"
            onClick={() => setMobileMenuOpen(false)}
          >
            Blog
          </Link>
          <Link
            href="https://apis.guru/awesome-openapi3/"
            className="block py-3 px-6 border-b border-gray-100 text-gray-700 hover:bg-gray-50"
            onClick={() => setMobileMenuOpen(false)}
          >
        OpenAPI Tools
          </Link>
        </nav>
      </div>

      {/* Add overlay for mobile menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Spacer to prevent content from being hidden under fixed header */}
      <div className="h-14"></div>
    </>
  );
}
