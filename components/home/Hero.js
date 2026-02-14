import { SignUpButton, useAuth, useUser } from '@clerk/nextjs';
import Link from "next/link";

export default function Hero() {
  const { isSignedIn } = useAuth();
  return (
    <section className="bg-[#222222] text-[#FAF3E1] py-20">
      <div className="container mx-auto px-6 lg:px-12 text-center">
        <h1 className="text-4xl lg:text-6xl font-extrabold">
          Remember Algorithms. Not Just Solve Them.
        </h1>
        <p className="mt-4 text-lg lg:text-2xl text-[#F5E7C6]">
          AlgoRecall helps you retain LeetCode solutions by turning problems
          into fast, intelligent quizzes that lock in patterns and core ideas.
        </p>
        <div className="mt-6 flex justify-center space-x-4">
            <Link href="/dashboard" className="bg-[#FA8112] text-[#222222] px-6 py-3 rounded-lg font-medium shadow hover:bg-[#E9720F] transition-colors duration-200">
                {isSignedIn ? "Dashboard" : "👉 Start Free"}
            </Link>
        </div>
        <p className="mt-3 text-sm text-muted text-[#F5E7C699] italic">
          Develop problem-solving skills and coding interview preparation.
        </p>
      </div>
    </section>
  );
}