import { SignUpButton } from '@clerk/nextjs';
import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="bg-[#222222] text-[#FAF3E1] py-16 text-center">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl lg:text-4xl font-bold">Stop Forgetting. Start Recognizing.</h2>
        <p className="mt-4 text-lg lg:text-xl text-[#F5E7C6] leading-relaxed">
          Interviews reward pattern recognition, not memorization. AlgoRecall trains exactly that.
        </p>
        <div className="mt-6">
            <Link href="/dashboard"  className="bg-[#FA8112] text-[#222222] px-8 py-3 rounded-lg font-medium shadow hover:bg-[#E9720F] transition-colors duration-200">
              🚀 Get Started Free
            </Link>
        </div>
      </div>
    </section>
  );
}