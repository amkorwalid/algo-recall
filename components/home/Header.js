import Link from "next/link";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

export default function Header() {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-5 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">AlgoRecall</h1>
        <nav className="hidden md:flex space-x-8">
          <Link href="#home" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">Home</Link>
          <Link href="#features" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">Features</Link>
          <Link href="#pricing" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">Pricing</Link>
          <Link href="#faq" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">FAQ</Link>
        </nav>
        <div>
          <SignedOut>
            <SignUpButton>
              <button className="bg-blue-600 text-white px-4 py-2 mx-3 rounded-md hover:bg-blue-700 transition-colors duration-200">
                Sign Up
              </button>
            </SignUpButton>
            <SignInButton>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
        
      </div>
    </header>
  );
}