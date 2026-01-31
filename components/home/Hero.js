import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-blue-50 py-20" id="home">
      <div className="container mx-auto px-4 flex flex-col-reverse lg:flex-row items-center">
        <div className="text-center lg:text-left lg:w-1/2">
          <h2 className="text-4xl font-extrabold text-blue-600">
            Master Competitive Programming in a Smarter Way!
          </h2>
          <p className="text-gray-700 mt-4">
            Turn LeetCode and Codeforces practice into interactive quizzes that help you revise solutions quickly.
          </p>
          <Link href="/dashboard/">
            <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700">
              Get Started
            </button>
          </Link>
        </div>
        <div className="lg:w-1/2">
          <img src="/images/hero-placeholder.svg" alt="Hero illustration" />
        </div>
      </div>
    </section>
  );
}