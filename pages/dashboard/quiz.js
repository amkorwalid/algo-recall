import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth, useUser } from "@clerk/nextjs";
import { supabaseBrowser } from "@/lib/supabase/client";
import Sidebar from "../../components/dashboard/Sidebar";
import Header from "../../components/dashboard/Header";

export default function QuizPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();

  // Quiz configuration state
  const [problemSource, setProblemSource] = useState("all"); // "all", "favorites", "custom"
  const [selectedQuizSet, setSelectedQuizSet] = useState(null);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [timerDuration, setTimerDuration] = useState(30); // minutes
  const [questionCount, setQuestionCount] = useState(10);

  // Data state
  const [allProblems, setAllProblems] = useState([]);
  const [quizSets, setQuizSets] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const supabase = supabaseBrowser();

      // Load all problems
      const { data: problems, error: problemsError } = await supabase
        .from("generated_questions")
        .select("*");
      if (problemsError) console.error(problemsError);
      setAllProblems(problems ?? []);

      // Load user's quiz sets
      if (user) {
        const { data: sets, error: setsError } = await supabase
          .from("quizzes_set")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        if (setsError) console.error(setsError);
        setQuizSets(sets ?? []);
      }

      // Load favorites from localStorage
      const savedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      setFavorites(savedFavorites);

      setLoading(false);
    };

    if (isLoaded && isSignedIn) {
      loadData();
    }
  }, [isLoaded, isSignedIn, user]);

  const getAvailableProblemsCount = () => {
    if (problemSource === "all") return allProblems.length;
    if (problemSource === "favorites") return favorites.length;
    if (problemSource === "custom" && selectedQuizSet) {
      return selectedQuizSet.set?.length || 0;
    }
    return 0;
  };

  const handleStartQuiz = () => {
    let problemIds = [];

    if (problemSource === "all") {
      // Shuffle and pick questionCount problems
      const shuffled = [...allProblems].sort(() => Math.random() - 0.5);
      problemIds = shuffled.slice(0, questionCount).map((p) => p.id);
    } else if (problemSource === "favorites") {
      const shuffled = [...favorites].sort(() => Math.random() - 0.5);
      problemIds = shuffled.slice(0, questionCount);
    } else if (problemSource === "custom" && selectedQuizSet) {
      const shuffled = [...(selectedQuizSet.set || [])].sort(() => Math.random() - 0.5);
      problemIds = shuffled.slice(0, questionCount);
    }

    if (problemIds.length === 0) {
      alert("No problems available for this quiz configuration!");
      return;
    }

    // Store quiz configuration in localStorage
    const quizConfig = {
      problemIds,
      timerEnabled,
      timerDuration: timerEnabled ? timerDuration : null,
      sourceName:
        problemSource === "all"
          ? "All Problems"
          : problemSource === "favorites"
          ? "Favorites"
          : selectedQuizSet?.name || "Custom Set",
    };
    localStorage.setItem("quizSessionConfig", JSON.stringify(quizConfig));

    // Navigate to quiz session
    router.push("/dashboard/quiz/session");
  };

  if (!isLoaded) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ backgroundColor: "#222222" }}
      >
        <div style={{ color: "#FAF3E1" }}>Loading...</div>
      </div>
    );
  }

  return isSignedIn ? (
    <div className="flex min-h-screen" style={{ backgroundColor: "#222222" }}>
      <Sidebar />
      <div className="grow w-full md:w-auto relative">
        <Header />
        <div className="container mx-auto px-4 md:px-6 py-6 md:py-8 pt-20 md:pt-8">
          {/* Header Section */}
          <div className="mb-8">
            <h1
              className="text-2xl md:text-3xl lg:text-4xl font-bold"
              style={{ color: "#FAF3E1" }}
            >
              Quiz Configuration 🧠
            </h1>
            <p className="mt-2 text-sm md:text-base" style={{ color: "#F5E7C6" }}>
              Configure your quiz session and test your knowledge
            </p>
          </div>

          {loading ? (
            <div
              className="p-8 rounded-lg border text-center"
              style={{
                backgroundColor: "#2A2A2A",
                borderColor: "rgba(255,255,255,0.08)",
              }}
            >
              <p style={{ color: "#F5E7C6" }}>Loading quiz options...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Problem Source Selection */}
              <div
                className="p-6 rounded-lg border"
                style={{
                  backgroundColor: "#2A2A2A",
                  borderColor: "rgba(255,255,255,0.08)",
                }}
              >
                <h2
                  className="text-xl font-bold mb-4"
                  style={{ color: "#FA8112" }}
                >
                  📚 Problem Set
                </h2>
                <p
                  className="text-sm mb-4"
                  style={{ color: "rgba(245,231,198,0.6)" }}
                >
                  Choose which problems to include in your quiz
                </p>

                <div className="space-y-3">
                  {/* All Problems */}
                  <button
                    onClick={() => {
                      setProblemSource("all");
                      setSelectedQuizSet(null);
                    }}
                    className="w-full p-4 rounded-lg text-left transition duration-300"
                    style={{
                      backgroundColor:
                        problemSource === "all"
                          ? "rgba(250,129,18,0.15)"
                          : "#303030",
                      borderColor:
                        problemSource === "all"
                          ? "rgba(250,129,18,0.35)"
                          : "transparent",
                      border: problemSource === "all" ? "2px solid" : "none",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p
                          className="font-medium"
                          style={{ color: "#FAF3E1" }}
                        >
                          🌐 All Problems
                        </p>
                        <p
                          className="text-sm"
                          style={{ color: "rgba(245,231,198,0.6)" }}
                        >
                          Random questions from all available problems
                        </p>
                      </div>
                      <span
                        className="text-lg font-bold"
                        style={{ color: "#FA8112" }}
                      >
                        {allProblems.length}
                      </span>
                    </div>
                  </button>

                  {/* Favorites */}
                  <button
                    onClick={() => {
                      setProblemSource("favorites");
                      setSelectedQuizSet(null);
                    }}
                    className="w-full p-4 rounded-lg text-left transition duration-300"
                    style={{
                      backgroundColor:
                        problemSource === "favorites"
                          ? "rgba(250,129,18,0.15)"
                          : "#303030",
                      borderColor:
                        problemSource === "favorites"
                          ? "rgba(250,129,18,0.35)"
                          : "transparent",
                      border: problemSource === "favorites" ? "2px solid" : "none",
                    }}
                    disabled={favorites.length === 0}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p
                          className="font-medium"
                          style={{
                            color:
                              favorites.length === 0
                                ? "rgba(245,231,198,0.4)"
                                : "#FAF3E1",
                          }}
                        >
                          ⭐ Favorites
                        </p>
                        <p
                          className="text-sm"
                          style={{ color: "rgba(245,231,198,0.6)" }}
                        >
                          Questions from your favorite problems
                        </p>
                      </div>
                      <span
                        className="text-lg font-bold"
                        style={{ color: "#FA8112" }}
                      >
                        {favorites.length}
                      </span>
                    </div>
                  </button>

                  {/* Custom Quiz Sets */}
                  {quizSets.length > 0 && (
                    <div className="pt-2">
                      <p
                        className="text-sm font-medium mb-2"
                        style={{ color: "rgba(245,231,198,0.6)" }}
                      >
                        📋 Custom Quiz Sets
                      </p>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {quizSets.map((set) => (
                          <button
                            key={set.id}
                            onClick={() => {
                              setProblemSource("custom");
                              setSelectedQuizSet(set);
                            }}
                            className="w-full p-3 rounded-lg text-left transition duration-300"
                            style={{
                              backgroundColor:
                                problemSource === "custom" &&
                                selectedQuizSet?.id === set.id
                                  ? "rgba(250,129,18,0.15)"
                                  : "#222222",
                              borderColor:
                                problemSource === "custom" &&
                                selectedQuizSet?.id === set.id
                                  ? "rgba(250,129,18,0.35)"
                                  : "transparent",
                              border:
                                problemSource === "custom" &&
                                selectedQuizSet?.id === set.id
                                  ? "2px solid"
                                  : "none",
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <p
                                className="font-medium truncate"
                                style={{ color: "#FAF3E1" }}
                              >
                                {set.name}
                              </p>
                              <span
                                className="text-sm font-bold"
                                style={{ color: "#FA8112" }}
                              >
                                {set.set?.length || 0}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Quiz Settings */}
              <div
                className="p-6 rounded-lg border"
                style={{
                  backgroundColor: "#2A2A2A",
                  borderColor: "rgba(255,255,255,0.08)",
                }}
              >
                <h2
                  className="text-xl font-bold mb-4"
                  style={{ color: "#FA8112" }}
                >
                  ⚙️ Quiz Settings
                </h2>

                {/* Question Count */}
                <div className="mb-6">
                  <label
                    className="block mb-2 font-medium"
                    style={{ color: "#F5E7C6" }}
                  >
                    Number of Questions: {questionCount}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max={Math.min(getAvailableProblemsCount(), 50)}
                    value={Math.min(questionCount, getAvailableProblemsCount())}
                    onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                    className="w-full"
                    style={{ accentColor: "#FA8112" }}
                  />
                  <div
                    className="flex justify-between text-xs mt-1"
                    style={{ color: "rgba(245,231,198,0.6)" }}
                  >
                    <span>1</span>
                    <span>{Math.min(getAvailableProblemsCount(), 50)}</span>
                  </div>
                </div>

                {/* Timer Toggle */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium" style={{ color: "#F5E7C6" }}>
                        ⏱️ Enable Timer
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: "rgba(245,231,198,0.6)" }}
                      >
                        Add time pressure to your quiz
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={timerEnabled}
                        onChange={(e) => setTimerEnabled(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div
                        className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                        style={{
                          backgroundColor: timerEnabled ? "#FA8112" : "#303030",
                        }}
                      ></div>
                    </label>
                  </div>

                  {/* Timer Duration */}
                  {timerEnabled && (
                    <div
                      className="p-4 rounded-lg"
                      style={{ backgroundColor: "#303030" }}
                    >
                      <label
                        className="block mb-2 text-sm font-medium"
                        style={{ color: "#F5E7C6" }}
                      >
                        Timer Duration: {timerDuration} minutes
                      </label>
                      <input
                        type="range"
                        min="5"
                        max="120"
                        step="5"
                        value={timerDuration}
                        onChange={(e) =>
                          setTimerDuration(parseInt(e.target.value))
                        }
                        className="w-full"
                        style={{ accentColor: "#FA8112" }}
                      />
                      <div
                        className="flex justify-between text-xs mt-1"
                        style={{ color: "rgba(245,231,198,0.6)" }}
                      >
                        <span>5 min</span>
                        <span>120 min</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quiz Summary */}
                <div
                  className="p-4 rounded-lg mb-6"
                  style={{
                    backgroundColor: "rgba(250,129,18,0.15)",
                    borderColor: "rgba(250,129,18,0.35)",
                    border: "1px solid",
                  }}
                >
                  <h3
                    className="font-semibold mb-2"
                    style={{ color: "#FA8112" }}
                  >
                    Quiz Summary
                  </h3>
                  <ul
                    className="text-sm space-y-1"
                    style={{ color: "#F5E7C6" }}
                  >
                    <li>
                      📚 Source:{" "}
                      {problemSource === "all"
                        ? "All Problems"
                        : problemSource === "favorites"
                        ? "Favorites"
                        : selectedQuizSet?.name || "Select a set"}
                    </li>
                    <li>❓ Questions: {questionCount}</li>
                    <li>
                      ⏱️ Timer:{" "}
                      {timerEnabled ? `${timerDuration} minutes` : "Disabled"}
                    </li>
                  </ul>
                </div>

                {/* Start Button */}
                <button
                  onClick={handleStartQuiz}
                  disabled={getAvailableProblemsCount() === 0}
                  className="w-full py-4 rounded-lg font-bold text-lg transition duration-300"
                  style={{
                    backgroundColor:
                      getAvailableProblemsCount() === 0 ? "#404040" : "#FA8112",
                    color:
                      getAvailableProblemsCount() === 0 ? "#666666" : "#222222",
                    cursor:
                      getAvailableProblemsCount() === 0
                        ? "not-allowed"
                        : "pointer",
                  }}
                  onMouseEnter={(e) => {
                    if (getAvailableProblemsCount() > 0) {
                      e.target.style.backgroundColor = "#E9720F";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (getAvailableProblemsCount() > 0) {
                      e.target.style.backgroundColor = "#FA8112";
                    }
                  }}
                >
                  🚀 Start Quiz
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  ) : null;
}