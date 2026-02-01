import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isSignedIn } = useUser();

  return (
    <nav className="bg-[#222222] text-[#FAF3E1] shadow-lg">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-[#FA8112] hover:text-[#E9720F] transition-colors duration-200">
          AlgoRecall
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-6">
          <Link href="/#how-it-works" className="text-[#FAF3E1] hover:text-[#FA8112] transition-colors duration-200">
            How It Works
          </Link>
          <Link href="/#features" className="text-[#FAF3E1] hover:text-[#FA8112] transition-colors duration-200">
            Features
          </Link>
          <Link href="/#pricing" className="text-[#FAF3E1] hover:text-[#FA8112] transition-colors duration-200">
            Pricing
          </Link>
          {!isSignedIn ? (
            <SignInButton>
              <button className="bg-[#FA8112] text-[#222222] px-4 py-2 rounded-lg font-medium hover:bg-[#E9720F] transition-colors duration-200">
                Sign In
              </button>
            </SignInButton>
          ) : (
            <UserButton />
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          className="lg:hidden text-[#FAF3E1] focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-[#2A2A2A] text-[#FAF3E1] px-6 py-4 space-y-4">
          <Link href="/#how-it-works" onClick={() => setIsMenuOpen(false)} className="block text-[#FAF3E1] hover:text-[#FA8112] transition-colors duration-200">
            How It Works
          </Link>
          <Link href="/#features" onClick={() => setIsMenuOpen(false)} className="block text-[#FAF3E1] hover:text-[#FA8112] transition-colors duration-200">
            Features
          </Link>
          <Link href="/#pricing" onClick={() => setIsMenuOpen(false)} className="block text-[#FAF3E1] hover:text-[#FA8112] transition-colors duration-200">
            Pricing
          </Link>
          <Link href="/#about" onClick={() => setIsMenuOpen(false)} className="block text-[#FAF3E1] hover:text-[#FA8112] transition-colors duration-200">
            About
          </Link>
          {!isSignedIn ? ( 
            <SignInButton>
                <button
                    onClick={() => setIsMenuOpen(false)}
                    className="block bg-[#FA8112] text-[#222222] px-4 py-2 rounded-lg font-medium hover:bg-[#E9720F] transition-colors duration-200"
                >
                    Sign In
                </button>
            </SignInButton>
          ) : (
            <div>
              <UserButton />
            </div>
          )}
        </div>
      )}
    </nav>
  );
}