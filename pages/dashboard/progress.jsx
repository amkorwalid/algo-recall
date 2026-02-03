import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@clerk/nextjs";
import Sidebar from "../../components/dashboard/Sidebar";
import Header from "../../components/dashboard/Header";

export default function ProgressPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();

  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    notAttempted: 0,
    byDifficulty: { easy: 0, medium: 0, hard: 0 },
    completedByDifficulty: { easy: 0, medium: 0, hard: 0 },
    byTopic: {},
  });

  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((data) => {
        const problemStatus = JSON.parse(localStorage.getItem("problemStatus") || "{}");
        const problems = data.problems;

        const completed = Object.values(problemStatus).filter((s) => s === "completed").length;
        const inProgress = Object.values(problemStatus).filter((s) => s === "in_progress").length;
        const notAttempted = problems.length - completed - inProgress;

        const byDifficulty = { easy: 0, medium: 0, hard: 0 };
        const completedByDifficulty = { easy: 0, medium: 0, hard: 0 };
        
        problems.forEach((p) => {
          byDifficulty[p.difficulty]++;
          if (problemStatus[p.id] === "completed") {
            completedByDifficulty[p.difficulty]++;
          }
        });

        const byTopic = {};
        problems.forEach((p) => {
          p.topics.forEach((topic) => {
            if (!byTopic[topic]) {
              byTopic[topic] = { total: 0, completed: 0 };
            }
            byTopic[topic].total++;
            if (problemStatus[p.id] === "completed") {
              byTopic[topic].completed++;
            }
          });
        });

        setStats({
          total: problems.length,
          completed,
          inProgress,
          notAttempted,
          byDifficulty,
          completedByDifficulty,
          byTopic,
        });

        const recentProblems = Object.entries(problemStatus)
          .slice(-5)
          .reverse()
          .map(([id, status]) => {
            const problem = problems.find((p) => p.id === id);
            return { problem, status };
          })
          .filter((item) => item.problem);

        setRecentActivity(recentProblems);
      });
  }, []);

  const getProgressPercentage = () => {
    return stats.total > 0 ? ((stats.completed / stats.total) * 100).toFixed(1) : 0;
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
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold" style={{ color: '#FAF3E1' }}>
              Your Progress 📊
            </h1>
            <p className="mt-2 text-sm md:text-base" style={{ color: '#F5E7C6' }}>
              Track your learning journey and identify areas for improvement
            </p>
          </div>

          {/* Overall Progress */}
          <div 
            className="p-4 md:p-6 rounded-lg border mb-6 md:mb-8"
            style={{ 
              backgroundColor: '#2A2A2A',
              borderColor: 'rgba(255,255,255,0.08)'
            }}
          >
            <h2 className="text-lg md:text-xl font-bold mb-4" style={{ color: '#FA8112' }}>
              Overall Progress
            </h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
              <span className="text-sm md:text-base" style={{ color: '#F5E7C6' }}>
                {stats.completed} / {stats.total} problems completed
              </span>
              <span className="text-xl md:text-2xl font-bold" style={{ color: '#FA8112' }}>
                {getProgressPercentage()}%
              </span>
            </div>
            <div className="w-full rounded-full h-3 md:h-4" style={{ backgroundColor: '#303030' }}>
              <div
                className="h-3 md:h-4 rounded-full transition-all duration-500"
                style={{ 
                  width: `${getProgressPercentage()}%`,
                  backgroundColor: '#FA8112'
                }}
              ></div>
            </div>
          </div>

          {/* Status Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
            <div 
              className="p-4 md:p-6 rounded-lg border"
              style={{ 
                backgroundColor: '#2A2A2A',
                borderColor: 'rgba(255,255,255,0.08)'
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm" style={{ color: 'rgba(245,231,198,0.6)' }}>Completed</p>
                  <p className="text-2xl md:text-3xl font-bold" style={{ color: '#22c55e' }}>{stats.completed}</p>
                </div>
                <div className="text-3xl md:text-4xl">✅</div>
              </div>
            </div>

            <div 
              className="p-4 md:p-6 rounded-lg border"
              style={{ 
                backgroundColor: '#2A2A2A',
                borderColor: 'rgba(255,255,255,0.08)'
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm" style={{ color: 'rgba(245,231,198,0.6)' }}>In Progress</p>
                  <p className="text-2xl md:text-3xl font-bold" style={{ color: '#eab308' }}>{stats.inProgress}</p>
                </div>
                <div className="text-3xl md:text-4xl">⚠️</div>
              </div>
            </div>

            <div 
              className="p-4 md:p-6 rounded-lg border sm:col-span-3 md:col-span-1"
              style={{ 
                backgroundColor: '#2A2A2A',
                borderColor: 'rgba(255,255,255,0.08)'
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm" style={{ color: 'rgba(245,231,198,0.6)' }}>Not Attempted</p>
                  <p className="text-2xl md:text-3xl font-bold" style={{ color: 'rgba(245,231,198,0.6)' }}>{stats.notAttempted}</p>
                </div>
                <div className="text-3xl md:text-4xl">❌</div>
              </div>
            </div>
          </div>

          {/* Progress by Difficulty */}
          <div 
            className="p-4 md:p-6 rounded-lg border mb-6 md:mb-8"
            style={{ 
              backgroundColor: '#2A2A2A',
              borderColor: 'rgba(255,255,255,0.08)'
            }}
          >
            <h2 className="text-lg md:text-xl font-bold mb-4" style={{ color: '#FA8112' }}>
              Progress by Difficulty
            </h2>
            <div className="space-y-4">
              {['easy', 'medium', 'hard'].map((difficulty) => {
                const total = stats.byDifficulty[difficulty];
                const completed = stats.completedByDifficulty[difficulty];
                const percentage = total > 0 ? ((completed / total) * 100).toFixed(1) : 0;
                const colors = {
                  easy: '#22c55e',
                  medium: '#eab308',
                  hard: '#ef4444',
                };

                return (
                  <div key={difficulty}>
                    <div className="flex items-center justify-between mb-2">
                      <span 
                        className="text-sm md:text-base font-medium capitalize"
                        style={{ color: '#F5E7C6' }}
                      >
                        {difficulty}
                      </span>
                      <span className="text-xs md:text-sm" style={{ color: 'rgba(245,231,198,0.6)' }}>
                        {completed} / {total} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full rounded-full h-2 md:h-3" style={{ backgroundColor: '#303030' }}>
                      <div
                        className="h-2 md:h-3 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: colors[difficulty]
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Progress by Topic */}
          <div 
            className="p-4 md:p-6 rounded-lg border mb-6 md:mb-8"
            style={{ 
              backgroundColor: '#2A2A2A',
              borderColor: 'rgba(255,255,255,0.08)'
            }}
          >
            <h2 className="text-lg md:text-xl font-bold mb-4" style={{ color: '#FA8112' }}>
              Progress by Topic
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {Object.entries(stats.byTopic).map(([topic, data]) => {
                const percentage = data.total > 0 ? ((data.completed / data.total) * 100).toFixed(1) : 0;

                return (
                  <div 
                    key={topic}
                    className="p-3 md:p-4 rounded-lg border"
                    style={{ 
                      backgroundColor: '#303030',
                      borderColor: 'rgba(255,255,255,0.08)'
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm md:text-base" style={{ color: '#F5E7C6' }}>
                        {topic.replace('_', ' ')}
                      </span>
                      <span className="text-xs md:text-sm" style={{ color: 'rgba(245,231,198,0.6)' }}>
                        {data.completed}/{data.total}
                      </span>
                    </div>
                    <div className="w-full rounded-full h-2" style={{ backgroundColor: '#2A2A2A' }}>
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: '#FA8112'
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div 
            className="p-4 md:p-6 rounded-lg border"
            style={{ 
              backgroundColor: '#2A2A2A',
              borderColor: 'rgba(255,255,255,0.08)'
            }}
          >
            <h2 className="text-lg md:text-xl font-bold mb-4" style={{ color: '#FA8112' }}>
              Recent Activity
            </h2>
            {recentActivity.length > 0 ? (
              <div className="space-y-3">
                {recentActivity.map((item, index) => (
                  <div
                    key={index}
                    className="p-3 md:p-4 rounded-lg border transition duration-300"
                    style={{ 
                      backgroundColor: '#303030',
                      borderColor: 'rgba(255,255,255,0.08)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(250,129,18,0.35)'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center space-x-3 flex-1">
                        <span className="text-xl md:text-2xl flex-shrink-0">
                          {item.status === "completed" ? "✅" : "⚠️"}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm md:text-base truncate" style={{ color: '#FAF3E1' }}>
                            {item.problem.title}
                          </p>
                          <p className="text-xs md:text-sm" style={{ color: 'rgba(245,231,198,0.6)' }}>
                            {item.status === "completed" ? "Completed" : "In Progress"}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => router.push(`/dashboard/quiz?problemId=${item.problem.id}`)}
                        className="w-full sm:w-auto px-4 py-2 rounded-lg text-xs md:text-sm transition duration-300 whitespace-nowrap"
                        style={{ backgroundColor: '#FA8112', color: '#222222' }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#E9720F'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#FA8112'}
                      >
                        Review
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-sm md:text-base" style={{ color: 'rgba(245,231,198,0.6)' }}>
                No activity yet. Start solving problems to track your progress!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  ) : null;
}