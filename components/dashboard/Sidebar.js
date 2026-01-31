import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="h-screen bg-gray-800 text-white flex flex-col items-center py-8">
      <h2 className="text-2xl font-semibold mb-6">AlgoRecall</h2>
      <nav className="space-y-4">
        <Link href="/dashboard/problems">
          <span className="block bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700 transition">Problems Set</span>
        </Link>
        <Link href="/dashboard/quiz">
          <span className="block bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700 transition">Quiz</span>
        </Link>
      </nav>
    </div>
  );
}