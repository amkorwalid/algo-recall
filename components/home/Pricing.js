import Link from "next/link";

export default function Pricing() {
  return (
    <section id="pricing" className="bg-[#2A2A2A] text-[#FAF3E1] py-16">
      <div className="container mx-auto px-6 lg:px-12">
        <h2 className="text-3xl lg:text-4xl font-bold">Start Free. Upgrade When You’re Ready.</h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Free Plan */}
          <div className="bg-[#303030] p-6 rounded-lg border border-[#FA8112]">
            <h3 className="text-xl font-bold text-[#FA8112]">Free Plan</h3>
            <ul className="mt-4 space-y-2 text-[#F5E7C6]">
              <li>Limited quizzes per day</li>
              <li>Access to core patterns</li>
              <li>Progress tracking</li>
              <li>Static problems</li>
            </ul>
            <p className="mt-4 text-2xl font-bold">0 USD/month</p>
          </div>
          {/* Pro Plan */}
          <div className="bg-[#303030] p-6 rounded-lg">
            <h3 className="text-xl font-bold text-[#FA8112]">Pro Plan</h3>
            <ul className="mt-4 space-y-2 text-[#F5E7C6]">
              <li>Unlimited quizzes</li>
              <li>Dynamic quizzes powered by AI</li>
              <li>Advanced analytics</li>
              <li>Spaced repetition system</li>
              <li>Priority features</li>
            </ul>
            <p className="mt-4 text-2xl font-bold">7 USD/month</p>
          </div>
        </div>
        <div className="mt-8 text-center">
            <Link href="/dashboard"  className="bg-[#FA8112] text-[#222222] px-6 py-3 rounded-lg font-medium shadow hover:bg-[#E9720F] transition-colors duration-200">
              👉 Start Free Now
            </Link>
        </div>
      </div>
    </section>
  );
}