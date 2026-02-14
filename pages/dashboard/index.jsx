import { useAuth, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabaseBrowser } from "@/lib/supabase/client";
import Sidebar from "../../components/dashboard/Sidebar";
import Header from "../../components/dashboard/Header";

export default function DashboardHome() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();

  const [stats, setStats] = useState({
    totalProblems: 0,
    completed: 0,
    inProgress: 0,
    favorites: 0,
  });

  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user?.id) return;
    const run = async () => {
      const supabase = supabaseBrowser();
      const [{ data: problemsData, error: problemsError }, { data: favoritesData, error: favoritesError }, { data: quizSetsData, error: quizSetsError }] =
        await Promise.all([
          supabase.from("generated_questions").select("id"),
          supabase.from("favorites").select("problem_id").eq("user_id", user.id),
          supabase.from("quizzes_set").select("id").eq("user_id", user.id),
        ]);

      if (problemsError) console.error(problemsError);
      if (favoritesError) console.error(favoritesError);
      if (quizSetsError) console.error(quizSetsError);

      const problemStatus = JSON.parse(localStorage.getItem("problemStatus") || "{}");
      const completed = Object.values(problemStatus).filter((s) => s === "completed").length;


      setStats({
        totalProblems: (problemsData ?? []).length,
        favorites: (favoritesData ?? []).length,
        quizSets: (quizSetsData ?? []).length,
      });

      setRecentActivity([
        { type: "quiz", problem: "Longest Substring Without Repeating Characters", result: "completed", time: "2 hours ago" },
        { type: "favorite", problem: "Valid Anagram", time: "5 hours ago" },
        { type: "quiz", problem: "Top K Frequent Elements", result: "in_progress", time: "1 day ago" },
      ]);
    };
    run();
  }, [isLoaded, isSignedIn, user?.id]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: '#222222' }}>
        <div className="text-xl" style={{ color: '#FAF3E1' }}>Loading...</div>
      </div>
    );
  }

  return isSignedIn ? (
    <div className="flex min-h-screen" style={{ backgroundColor: '#222222' }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content - Add padding on mobile for menu button */}
      <div className="grow w-full md:w-auto relative">
        <Header />
        <div className="container px-4 md:px-6 py-8 mx-auto pt-20 md:pt-8">
          {/* Welcome Section */}
          {/* <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold" style={{ color: '#FAF3E1' }}>
              Welcome to AlgoRecall Dashboard! 👋
            </h1>
            <p className="mt-2 text-sm md:text-base" style={{ color: '#F5E7C6' }}>
              Track your progress, practice problems, and master algorithms with intelligent quizzes.
            </p>
          </div> */}

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-6 mb-8">
            <div 
              className="p-4 md:p-6 rounded-lg border transition duration-300 hover:shadow-lg"
              style={{ 
                backgroundColor: '#2A2A2A', 
                borderColor: 'rgba(255,255,255,0.08)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(250,129,18,0.35)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm" style={{ color: 'rgba(245,231,198,0.6)' }}>Total Problems</p>
                  <p className="text-2xl md:text-3xl font-bold" style={{ color: '#FA8112' }}>{stats.totalProblems}</p>
                </div>
                <div className="text-2xl md:text-4xl">📚</div>
              </div>
            </div>

            <div 
              className="p-4 md:p-6 rounded-lg border transition duration-300 hover:shadow-lg"
              style={{ 
                backgroundColor: '#2A2A2A', 
                borderColor: 'rgba(255,255,255,0.08)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(250,129,18,0.35)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm" style={{ color: 'rgba(245,231,198,0.6)' }}>Quiz Sets</p>
                  <p className="text-2xl md:text-3xl font-bold" style={{ color: '#FA8112' }}>{stats.quizSets}</p>
                </div>
                <div className="text-2xl md:text-4xl">📋</div>
              </div>
            </div>
            <div 
              className="p-4 md:p-6 rounded-lg border transition duration-300 hover:shadow-lg"
              style={{ 
                backgroundColor: '#2A2A2A', 
                borderColor: 'rgba(255,255,255,0.08)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(250,129,18,0.35)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm" style={{ color: 'rgba(245,231,198,0.6)' }}>Favorites</p>
                  <p className="text-2xl md:text-3xl font-bold" style={{ color: '#FA8112' }}>{stats.favorites}</p>
                </div>
                <div className="text-2xl md:text-4xl">⭐</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl md:text-2xl font-bold mb-4" style={{ color: '#FAF3E1' }}>Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <button
                onClick={() => router.push("/dashboard/quiz?mode=random")}
                className="p-4 md:p-6 rounded-lg border transition duration-300"
                style={{ 
                  backgroundColor: '#2A2A2A', 
                  borderColor: 'rgba(255,255,255,0.08)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(250,129,18,0.35)';
                  e.currentTarget.style.backgroundColor = '#303030';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.backgroundColor = '#2A2A2A';
                }}
              >
                <div className="text-3xl md:text-4xl mb-2">🎲</div>
                <h3 className="text-lg md:text-xl font-semibold" style={{ color: '#FA8112' }}>
                  Random Quiz
                </h3>
                <p className="text-xs md:text-sm mt-2" style={{ color: 'rgba(245,231,198,0.6)' }}>
                  Start a quiz with a random problem
                </p>
              </button>

              <button
                onClick={() => router.push("/dashboard/problems")}
                className="p-4 md:p-6 rounded-lg border transition duration-300"
                style={{ 
                  backgroundColor: '#2A2A2A', 
                  borderColor: 'rgba(255,255,255,0.08)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(250,129,18,0.35)';
                  e.currentTarget.style.backgroundColor = '#303030';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.backgroundColor = '#2A2A2A';
                }}
              >
                <div className="text-3xl md:text-4xl mb-2">📚</div>
                <h3 className="text-lg md:text-xl font-semibold" style={{ color: '#FA8112' }}>
                  Browse Problems
                </h3>
                <p className="text-xs md:text-sm mt-2" style={{ color: 'rgba(245,231,198,0.6)' }}>
                  Explore and filter the problem set
                </p>
              </button>

              <button
                onClick={() => router.push("/dashboard/quiz-sets")}
                className="p-4 md:p-6 rounded-lg border transition duration-300"
                style={{ 
                  backgroundColor: '#2A2A2A', 
                  borderColor: 'rgba(255,255,255,0.08)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(250,129,18,0.35)';
                  e.currentTarget.style.backgroundColor = '#303030';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.backgroundColor = '#2A2A2A';
                }}
              >
                <div className="text-3xl md:text-4xl mb-2">📋</div>
                <h3 className="text-lg md:text-xl font-semibold" style={{ color: '#FA8112' }}>
                  Quiz sets
                </h3>
                <p className="text-xs md:text-sm mt-2" style={{ color: 'rgba(245,231,198,0.6)' }}>
                  Practice your custom quiz sets
                </p>
              </button>
            </div>
          </div>

          {/* Navigation Cards */}
          <div className="mb-8">
            <h2 className="text-xl md:text-2xl font-bold mb-4" style={{ color: '#FAF3E1' }}>Explore</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div
                className="p-4 md:p-6 rounded-lg border shadow-sm transition duration-300 cursor-pointer"
                style={{ 
                  backgroundColor: 'rgba(250,129,18,0.15)', 
                  borderColor: 'rgba(250,129,18,0.35)',
                }}
                onClick={() => router.push("/dashboard/problems")}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(250,129,18,0.3)'}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0,0,0,0.1)'}
              >
                <h2 className="text-lg md:text-xl font-semibold" style={{ color: '#FA8112' }}>
                  📚 Problems Set
                </h2>
                <p className="mt-2 text-sm md:text-base" style={{ color: '#F5E7C6' }}>
                  Explore and filter a curated list of problems to practice. Improve your coding skills with structured practice.
                </p>
              </div>

              <div
                className="p-4 md:p-6 rounded-lg border shadow-sm transition duration-300 cursor-pointer"
                style={{ 
                  backgroundColor: 'rgba(250,129,18,0.15)', 
                  borderColor: 'rgba(250,129,18,0.35)',
                }}
                onClick={() => router.push("/dashboard/quiz")}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(250,129,18,0.3)'}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0,0,0,0.1)'}
              >
                <h2 className="text-lg md:text-xl font-semibold" style={{ color: '#FA8112' }}>
                  🧠 Quiz
                </h2>
                <p className="mt-2 text-sm md:text-base" style={{ color: '#F5E7C6' }}>
                  Test your knowledge with competitive programming quizzes. Revise concepts and grow your confidence!
                </p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          {/* <div>
            <h2 className="text-xl md:text-2xl font-bold mb-4" style={{ color: '#FAF3E1' }}>Recent Activity</h2>
            <div 
              className="rounded-lg border overflow-hidden"
              style={{ 
                backgroundColor: '#2A2A2A', 
                borderColor: 'rgba(255,255,255,0.08)',
              }}
            >
              {recentActivity.length > 0 ? (
                <div>
                  {recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="p-3 md:p-4 transition duration-300"
                      style={{ 
                        borderBottom: index < recentActivity.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#303030'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center space-x-3">
                          <div className="text-xl md:text-2xl">
                            {activity.type === "quiz" && activity.result === "completed" && "✅"}
                            {activity.type === "quiz" && activity.result === "in_progress" && "⚠️"}
                            {activity.type === "favorite" && "⭐"}
                          </div>
                          <div>
                            <p className="font-medium text-sm md:text-base" style={{ color: '#FAF3E1' }}>
                              {activity.type === "quiz" ? "Completed Quiz" : "Added to Favorites"}
                            </p>
                            <p className="text-xs md:text-sm" style={{ color: 'rgba(245,231,198,0.6)' }}>{activity.problem}</p>
                          </div>
                        </div>
                        <div className="text-xs md:text-sm" style={{ color: 'rgba(245,231,198,0.6)' }}>{activity.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p style={{ color: 'rgba(245,231,198,0.6)' }}>No recent activity yet. Start practicing to see your progress here!</p>
                </div>
              )}
            </div>
          </div> */}
        </div>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: '#222222' }}>
      <div style={{ color: '#FAF3E1' }}>Sign in to view this page</div>
    </div>
  );
}