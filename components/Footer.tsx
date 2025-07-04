import React from "react";
import IconGitHub from "./IconGitHub";
import IconTwitter from "./IconTwitter";

export default function Footer() {
  return (
    <footer className="site-footer w-full bg-white py-8 border-t border-gray-200">
      <div className="wrapper max-w-4xl mx-auto px-4">
        <ul className="social-media-list flex flex-wrap items-center justify-center gap-6 text-gray-700">
          <li>
            <a
              href="https://github.com/APIs-guru"
              className="flex items-center gap-2 hover:text-amber-600 transition-colors"
              aria-label="GitHub"
            >
              <span className="w-5 h-5">
                <IconGitHub />
              </span>
              <span className="hidden sm:inline">APIs-guru</span>
            </a>
          </li>
          <li>
            <a
              href="https://twitter.com/APIs_guru"
              className="flex items-center gap-2 hover:text-amber-600 transition-colors"
              aria-label="Twitter"
            >
              <span className="w-5 h-5">
                <IconTwitter />
              </span>
              <span className="hidden sm:inline">@APIs_guru</span>
            </a>
          </li>
          <li className="text-sm text-gray-600">
            © {new Date().getFullYear()} APIs.guru All rights reserved.
          </li>
        </ul>
      </div>
    </footer>
  );
}
