import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; 2026 AlgoRecall. All rights reserved.</p>
        <div className="mt-4 space-x-4">
          <Link href="#" className="hover:text-blue-400">Privacy Policy</Link>
          <Link href="#" className="hover:text-blue-400">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}