import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Github, Linkedin, Sparkles } from 'lucide-react';

export default function FooterGlow() {
  return (
    <footer className="relative z-10 w-full overflow-hidden mt-24 pb-8">
      <div className="pointer-events-none absolute top-0 left-1/2 z-0 h-full w-full -translate-x-1/2 select-none">
        <div className="absolute -top-32 left-1/4 h-72 w-72 rounded-full bg-indigo-600/20 blur-3xl"></div>
        <div className="absolute right-1/4 -bottom-24 h-80 w-80 rounded-full bg-purple-600/20 blur-3xl"></div>
      </div>
      <div 
        className="relative mx-auto flex max-w-6xl flex-col items-center gap-8 rounded-3xl px-6 py-10 md:flex-row md:items-start md:justify-between md:gap-12 backdrop-blur-[3px] bg-white/40 dark:bg-black/40 border border-white/20 dark:border-white/10 shadow-2xl saturate-[180%] transition-all duration-300"
      >
        <div className="flex flex-col items-center md:items-start">
          <Link to="/" className="mb-4 flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md transition-transform group-hover:scale-110 group-hover:rotate-6">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-br from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent">
              VibeLoop
            </span>
          </Link>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-xs text-center text-sm md:text-left">
            VibeLoop provides a set of reusable components and utilities to
            help you create beautiful and responsive user interfaces quickly and
            efficiently.
          </p>
          <div className="mt-2 flex gap-4 text-indigo-500 dark:text-indigo-400">
            <a
              href="#"
              aria-label="Twitter"
              className="hover:text-indigo-700 dark:hover:text-indigo-300 hover:scale-110 transition"
            >
              <Twitter className="h-6 w-6" />
            </a>
            <a
              href="#"
              aria-label="GitHub"
              className="hover:text-indigo-700 dark:hover:text-indigo-300 hover:scale-110 transition"
            >
              <Github className="h-6 w-6" />
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="hover:text-indigo-700 dark:hover:text-indigo-300 hover:scale-110 transition"
            >
              <Linkedin className="h-6 w-6" />
            </a>
          </div>
        </div>
        <nav className="flex w-full flex-col gap-9 text-center md:w-auto md:flex-row md:justify-end md:text-left sm:gap-14">
          <div>
            <div className="mb-4 text-xs font-bold tracking-widest text-indigo-500 dark:text-indigo-400 uppercase">
              Product
            </div>
            <ul className="space-y-3">
              <li>
                <Link to="#" className="text-neutral-600 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition">
                  Features
                </Link>
              </li>
              <li>
                <Link to="#" className="text-neutral-600 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="#" className="text-neutral-600 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition">
                  Integrations
                </Link>
              </li>
              <li>
                <Link to="#" className="text-neutral-600 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition">
                  Updates
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="mb-4 text-xs font-bold tracking-widest text-indigo-500 dark:text-indigo-400 uppercase">
              Company
            </div>
            <ul className="space-y-3">
              <li>
                <Link to="#" className="text-neutral-600 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition">
                  About
                </Link>
              </li>
              <li>
                <Link to="#" className="text-neutral-600 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="#" className="text-neutral-600 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="#" className="text-neutral-600 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="mb-4 text-xs font-bold tracking-widest text-indigo-500 dark:text-indigo-400 uppercase">
              Resources
            </div>
            <ul className="space-y-3">
              <li>
                <Link to="#" className="text-neutral-600 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition">
                  Docs
                </Link>
              </li>
              <li>
                <Link to="#" className="text-neutral-600 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition">
                  Community
                </Link>
              </li>
              <li>
                <Link to="#" className="text-neutral-600 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition">
                  Support
                </Link>
              </li>
              <li>
                <Link to="#" className="text-neutral-600 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition">
                  Security
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
      <div className="text-neutral-500 relative z-10 mt-10 text-center text-sm font-medium">
        <span>&copy; 2026 VibeLoop. All rights reserved.</span>
      </div>
    </footer>
  );
}
