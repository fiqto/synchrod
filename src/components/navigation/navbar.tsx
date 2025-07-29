'use client';

import Link from 'next/link';
import { useState } from 'react';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-foreground hover:text-primary transition-colors">
              Synchrod
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            <div className="relative group">
              <div className="text-foreground-muted hover:text-foreground px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-secondary-light flex items-center gap-1 cursor-pointer">
                Tools
                <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <div className="absolute top-full left-0 mt-1 w-48 bg-background border border-border rounded-lg shadow-lg py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <Link
                  href="/json-merge"
                  className="block px-4 py-2 text-foreground-muted hover:text-foreground hover:bg-secondary-light transition-all duration-200"
                >
                  JSON Merge
                </Link>
                <Link
                  href="/json-replacer"
                  className="block px-4 py-2 text-foreground-muted hover:text-foreground hover:bg-secondary-light transition-all duration-200"
                >
                  JSON Replacer
                </Link>
              </div>
            </div>
            <Link
              href="/#how-it-works"
              className="text-foreground-muted hover:text-foreground px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-secondary-light"
            >
              How it Works
            </Link>
            <Link
              href="/#about"
              className="text-foreground-muted hover:text-foreground px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-secondary-light"
            >
              About
            </Link>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-foreground-muted hover:text-foreground p-2 rounded-lg transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden animate-fade-in">
            <div className="px-2 pt-2 pb-4 space-y-2 border-t border-border">
              <div className="space-y-1">
                <div className="text-foreground-muted px-4 py-2 text-base font-medium">Tools</div>
                <Link
                  href="/json-merge"
                  className="text-foreground-muted hover:text-foreground block px-8 py-2 rounded-lg text-sm transition-all duration-200 hover:bg-secondary-light"
                  onClick={() => setIsMenuOpen(false)}
                >
                  JSON Merge
                </Link>
                <Link
                  href="/json-replacer"
                  className="text-foreground-muted hover:text-foreground block px-8 py-2 rounded-lg text-sm transition-all duration-200 hover:bg-secondary-light"
                  onClick={() => setIsMenuOpen(false)}
                >
                  JSON Replacer
                </Link>
              </div>
              <Link
                href="/#how-it-works"
                className="text-foreground-muted hover:text-foreground block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 hover:bg-secondary-light"
                onClick={() => setIsMenuOpen(false)}
              >
                How it Works
              </Link>
              <Link
                href="/#about"
                className="text-foreground-muted hover:text-foreground block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 hover:bg-secondary-light"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}