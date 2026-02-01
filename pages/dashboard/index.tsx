import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Sidebar from "../../components/dashboard/Sidebar";
import Header from "../../components/dashboard/Header";

export default function DashboardHome() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth(); // Updated for clarity

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      // Redirect user to the sign-in page if not authenticated
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  // Show a loading state while Clerk checks authentication
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  // Return the dashboard only if the user is signed in
  return isSignedIn ? (
    <div className="flex">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content */}
      <div className="grow">
        <Header />
        <div className="container px-6 py-8 mx-auto">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome to the Dashboard!
          </h1>
          <p className="mt-4 text-gray-600">
            This is the place to enhance your problem-solving skills with interactive problem sets and competitive programming quizzes. Choose where to start:
          </p>

          {/* Navigation Cards */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Problems Set Card */}
            <div
              className="p-6 bg-blue-50 border border-blue-200 rounded-lg shadow-sm hover:shadow-lg cursor-pointer transition"
              onClick={() => router.push("/dashboard/problems")}
            >
              <h2 className="text-xl font-semibold text-blue-600">Problems Set</h2>
              <p className="mt-2 text-gray-600">
                Explore and filter a curated list of problems to practice.
              </p>
            </div>

            {/* Quiz Card */}
            <div
              className="p-6 bg-green-50 border border-green-200 rounded-lg shadow-sm hover:shadow-lg cursor-pointer transition"
              onClick={() => router.push("/dashboard/quiz")}
            >
              <h2 className="text-xl font-semibold text-green-600">Quiz</h2>
              <p className="mt-2 text-gray-600">
                Test your knowledge with quizzes and grow your confidence!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div>Sign in to view this page</div>
  );
}