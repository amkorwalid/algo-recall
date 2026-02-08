import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@clerk/nextjs";
import { supabaseBrowser } from "@/lib/supabase/client";
import Sidebar from "../../components/dashboard/Sidebar";
import Header from "../../components/dashboard/Header";
import QuizCard from "../../components/dashboard/QuizCard";

export default function QuizPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const [problem, setProblem] = useState(null);
  const [data, setData] = useState({ problems: [], solvedQuizzes: [] });
  const [quizStats, setQuizStats] = useState({ total: 0, completed: 0 });

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  const loadRandomQuiz = (data) => {
    const problems = Array.isArray(data) ? data : [];
    const solvedQuizzes = [];
    const unsolvedQuizzes = data;

    setQuizStats({
      total: problems.length,
      completed: solvedQuizzes.length,
    });

    if (unsolvedQuizzes.length > 0) {
      const randomProblem =
        unsolvedQuizzes[Math.floor(Math.random() * unsolvedQuizzes.length)];
      setProblem(randomProblem);
    } else {
      setProblem(null);
    }
  };


  useEffect(() => {
    const run = async () => {
      const supabase = supabaseBrowser();
      const { data, error } = await supabase.from("genai_problems").select("*");
      if (error) console.error(error);
      setData(data ?? []);
      loadRandomQuiz(data ?? []);
    };
    run();
  }, []);

  const handleNextQuiz = () => {
    loadRandomQuiz(data);
  };

  if (!isLoaded) {
    return (
      <div 
        className="flex items-center justify-center min-h-screen"
        style={{ backgroundColor: '#222222' }}
      >
        <div style={{ color: '#FAF3E1' }}>Loading...</div>
      </div>
    );
  }

  return isSignedIn ? (
    <div className="flex min-h-screen" style={{ backgroundColor: '#222222' }}>
      <Sidebar />
      <div className="flex-grow w-full md:w-auto overflow-x-hidden">
        <Header />
        <div className="container mx-auto px-4 md:px-6 py-6 md:py-8 pt-20 md:pt-8">
          {/* Header Section */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold" style={{ color: '#FAF3E1' }}>
              Quiz Time 🧠
            </h1>
            <p className="mt-2 text-sm md:text-base" style={{ color: '#F5E7C6' }}>
              Test your knowledge and master algorithmic patterns
            </p>
          </div>

          {/* Progress Stats */}
          {quizStats.total > 0 && (
            <div 
              className="p-4 md:p-6 rounded-lg border mb-6"
              style={{ 
                backgroundColor: '#2A2A2A',
                borderColor: 'rgba(255,255,255,0.08)'
              }}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm md:text-base" style={{ color: '#F5E7C6' }}>
                    Your Progress
                  </p>
                  <p className="text-xl md:text-2xl font-bold" style={{ color: '#FA8112' }}>
                    {quizStats.completed} / {quizStats.total} completed
                  </p>
                </div>
                <div className="w-full sm:w-auto">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 sm:w-48 h-3 rounded-full" style={{ backgroundColor: '#303030' }}>
                      <div
                        className="h-3 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${(quizStats.completed / quizStats.total) * 100}%`,
                          backgroundColor: '#FA8112'
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium whitespace-nowrap" style={{ color: '#F5E7C6' }}>
                      {((quizStats.completed / quizStats.total) * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quiz Content */}
          <div className="mt-6">
            {problem ? (
              <QuizCard problem={problem} onNext={handleNextQuiz} />
            ) : (
              <div 
                className="text-center py-12 md:py-16 rounded-lg border"
                style={{ 
                  backgroundColor: '#2A2A2A',
                  borderColor: 'rgba(255,255,255,0.08)'
                }}
              >
                <div className="text-5xl md:text-6xl mb-4">🎉</div>
                <h2 className="text-xl md:text-2xl font-bold mb-2" style={{ color: '#FAF3E1' }}>
                  All Quizzes Completed!
                </h2>
                <p className="mb-6 text-sm md:text-base px-4" style={{ color: 'rgba(245,231,198,0.6)' }}>
                  Congratulations! You've completed all available quizzes.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center px-4">
                  <button
                    onClick={() => router.push("/dashboard/problems")}
                    className="px-6 py-3 rounded-lg font-medium transition duration-300"
                    style={{ backgroundColor: '#FA8112', color: '#222222' }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#E9720F'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#FA8112'}
                  >
                    Browse Problems
                  </button>
                  <button
                    onClick={() => router.push("/dashboard/progress")}
                    className="px-6 py-3 rounded-lg font-medium transition duration-300"
                    style={{ backgroundColor: '#303030', color: '#F5E7C6' }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#FA8112';
                      e.target.style.color = '#222222';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#303030';
                      e.target.style.color = '#F5E7C6';
                    }}
                  >
                    View Progress
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  ) : null;
}