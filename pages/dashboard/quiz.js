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
  const [problemSource, setProblemSource] = useState("all");
  const [selectedQuizSetId, setSelectedQuizSetId] = useState(null);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [timerDuration, setTimerDuration] = useState(30);
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
          .order("id", { ascending: false });
        if (setsError) console.error(setsError);
        setQuizSets(sets ?? []);

        // Check if coming from quiz-sets page with pre-selected set
        const preSelectedSetId = localStorage.getItem("selectedQuizSetId");
        if (preSelectedSetId && sets) {
          const foundSet = sets.find(
            (s) => String(s.id) === String(preSelectedSetId)
          );
          if (foundSet) {
            setProblemSource("custom");
            setSelectedQuizSetId(foundSet.id);
          }
          // Clear the pre-selection
          localStorage.removeItem("selectedQuizSetId");
          localStorage.removeItem("selectedQuizSetName");
          localStorage.removeItem("selectedQuizSetProblems");
        }
      }

      if (user?.id) {
        const { data: favoritesData, error: favoritesError } = await supabase
          .from("favorites")
          .select("problem_id")
          .eq("user_id", user.id);
        if (favoritesError) console.error(favoritesError);
        setFavorites((favoritesData ?? []).map((row) => row.problem_id));
      } else {
        setFavorites([]);
      }

      setLoading(false);
    };

    if (isLoaded && isSignedIn) {
      loadData();
    }
  }, [isLoaded, isSignedIn, user]);

  // Find the selected quiz set by ID (handles both string and number comparison)
  const getSelectedQuizSet = () => {
    if (!selectedQuizSetId) return null;
    return (
      quizSets.find((set) => String(set.id) === String(selectedQuizSetId)) ||
      null
    );
  };

  const getAvailableProblemsCount = () => {
    if (problemSource === "all") return allProblems.length;
    if (problemSource === "favorites") return favorites.length;
    if (problemSource === "custom") {
      const selectedSet = getSelectedQuizSet();
      return selectedSet?.set?.length || 0;
    }
    return 0;
  };

  const handleSourceChange = (e) => {
    const value = e.target.value;

    if (value === "all") {
      setProblemSource("all");
      setSelectedQuizSetId(null);
    } else if (value === "favorites") {
      setProblemSource("favorites");
      setSelectedQuizSetId(null);
    } else if (value.startsWith("custom_")) {
      const setId = value.replace("custom_", "");
      setProblemSource("custom");
      // Find the actual set to get its proper ID type
      const foundSet = quizSets.find((s) => String(s.id) === setId);
      setSelectedQuizSetId(foundSet ? foundSet.id : setId);
    }
  };

  const getDropdownValue = () => {
    if (problemSource === "all") return "all";
    if (problemSource === "favorites") return "favorites";
    if (problemSource === "custom" && selectedQuizSetId) {
      return `custom_${selectedQuizSetId}`;
    }
    return "all";
  };

  const handleStartQuiz = () => {
    let problemIds = [];

    if (problemSource === "all") {
      const shuffled = [...allProblems].sort(() => Math.random() - 0.5);
      problemIds = shuffled.slice(0, questionCount).map((p) => p.id);
    } else if (problemSource === "favorites") {
      const shuffled = [...favorites].sort(() => Math.random() - 0.5);
      problemIds = shuffled.slice(0, questionCount);
    } else if (problemSource === "custom") {
      const selectedSet = getSelectedQuizSet();
      if (selectedSet && Array.isArray(selectedSet.set)) {
        // selectedSet.set is an array of integers (problem IDs) from Supabase
        const shuffled = [...selectedSet.set].sort(() => Math.random() - 0.5);
        problemIds = shuffled.slice(0, questionCount);
      }
    }

    if (problemIds.length === 0) {
      alert("No problems available for this quiz configuration!");
      return;
    }

    const selectedSet = getSelectedQuizSet();
    const quizConfig = {
      problemIds,
      timerEnabled,
      timerDuration: timerEnabled ? timerDuration : null,
      sourceName:
        problemSource === "all"
          ? "All Problems"
          : problemSource === "favorites"
          ? "Favorites"
          : selectedSet?.name || "Custom Set",
    };
    localStorage.setItem("quizSessionConfig", JSON.stringify(quizConfig));

    router.push("/dashboard/quiz/session");
  };

  const getSourceDisplayName = () => {
    if (problemSource === "all") return "All Problems";
    if (problemSource === "favorites") return "Favorites";
    if (problemSource === "custom") {
      const selectedSet = getSelectedQuizSet();
      return selectedSet?.name || "Select a quiz set";
    }
    return "Select source";
  };

  // Adjust question count when available problems change
  useEffect(() => {
    const available = getAvailableProblemsCount();
    if (available > 0 && questionCount > available) {
      setQuestionCount(available);
    } else if (available > 0 && questionCount === 0) {
      setQuestionCount(Math.min(10, available));
    }
  }, [problemSource, selectedQuizSetId, allProblems, favorites, quizSets]);

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
            <p
              className="mt-2 text-sm md:text-base"
              style={{ color: "#F5E7C6" }}
            >
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

                {/* Dropdown Selector */}
                <div className="mb-4">
                  <label
                    className="block mb-2 font-medium"
                    style={{ color: "#F5E7C6" }}
                  >
                    Select Problem Source
                  </label>
                  <select
                    value={getDropdownValue()}
                    onChange={handleSourceChange}
                    className="w-full px-4 py-3 rounded-lg border transition duration-300 text-base cursor-pointer"
                    style={{
                      backgroundColor: "#303030",
                      color: "#FAF3E1",
                      borderColor: "rgba(250,129,18,0.35)",
                    }}
                  >
                    <optgroup label="📚 General">
                      <option value="all">
                        🌐 All Problems ({allProblems.length})
                      </option>
                      <option value="favorites" disabled={favorites.length === 0}>
                        ⭐ Favorites ({favorites.length})
                      </option>
                    </optgroup>
                    {quizSets.length > 0 && (
                      <optgroup label="📋 Custom Quiz Sets">
                        {quizSets.map((set) => (
                          <option key={set.id} value={`custom_${set.id}`}>
                            📋 {set.name} ({set.set?.length || 0})
                          </option>
                        ))}
                      </optgroup>
                    )}
                  </select>
                </div>

                {/* Selected Source Info */}
                <div
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: "#303030" }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="text-sm font-medium"
                      style={{ color: "rgba(245,231,198,0.6)" }}
                    >
                      Selected Source
                    </span>
                    <span
                      className="text-lg font-bold"
                      style={{ color: "#FA8112" }}
                    >
                      {getAvailableProblemsCount()} problems
                    </span>
                  </div>
                  <p
                    className="text-base font-medium"
                    style={{ color: "#FAF3E1" }}
                  >
                    {getSourceDisplayName()}
                  </p>
                  {problemSource === "all" && (
                    <p
                      className="text-sm mt-1"
                      style={{ color: "rgba(245,231,198,0.6)" }}
                    >
                      Random questions from all available problems
                    </p>
                  )}
                  {problemSource === "favorites" && (
                    <p
                      className="text-sm mt-1"
                      style={{ color: "rgba(245,231,198,0.6)" }}
                    >
                      Questions from your favorited problems
                    </p>
                  )}
                  {problemSource === "custom" && getSelectedQuizSet() && (
                    <p
                      className="text-sm mt-1"
                      style={{ color: "rgba(245,231,198,0.6)" }}
                    >
                      Questions from your custom quiz set
                    </p>
                  )}
                </div>

                {/* Quick Links */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {favorites.length === 0 && (
                    <button
                      onClick={() => router.push("/dashboard/favorites")}
                      className="text-sm px-3 py-1 rounded-lg transition duration-300"
                      style={{ backgroundColor: "#303030", color: "#F5E7C6" }}
                      onMouseEnter={(e) =>
                        (e.target.style.backgroundColor = "#404040")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.backgroundColor = "#303030")
                      }
                    >
                      + Add Favorites
                    </button>
                  )}
                  {quizSets.length === 0 && (
                    <button
                      onClick={() => router.push("/dashboard/problems")}
                      className="text-sm px-3 py-1 rounded-lg transition duration-300"
                      style={{ backgroundColor: "#303030", color: "#F5E7C6" }}
                      onMouseEnter={(e) =>
                        (e.target.style.backgroundColor = "#404040")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.backgroundColor = "#303030")
                      }
                    >
                      + Create Quiz Set
                    </button>
                  )}
                  {quizSets.length > 0 && (
                    <button
                      onClick={() => router.push("/dashboard/quiz-sets")}
                      className="text-sm px-3 py-1 rounded-lg transition duration-300"
                      style={{ backgroundColor: "#303030", color: "#F5E7C6" }}
                      onMouseEnter={(e) =>
                        (e.target.style.backgroundColor = "#404040")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.backgroundColor = "#303030")
                      }
                    >
                      Manage Quiz Sets
                    </button>
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
                    Number of Questions:{" "}
                    {Math.min(questionCount, getAvailableProblemsCount() || 1)}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max={Math.max(Math.min(getAvailableProblemsCount(), 50), 1)}
                    value={Math.min(
                      questionCount,
                      getAvailableProblemsCount() || 1
                    )}
                    onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                    className="w-full"
                    style={{ accentColor: "#FA8112" }}
                    disabled={getAvailableProblemsCount() === 0}
                  />
                  <div
                    className="flex justify-between text-xs mt-1"
                    style={{ color: "rgba(245,231,198,0.6)" }}
                  >
                    <span>1</span>
                    <span>
                      {Math.max(Math.min(getAvailableProblemsCount(), 50), 1)}
                    </span>
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
                  <ul className="text-sm space-y-1" style={{ color: "#F5E7C6" }}>
                    <li>📚 Source: {getSourceDisplayName()}</li>
                    <li>
                      ❓ Questions:{" "}
                      {Math.min(questionCount, getAvailableProblemsCount() || 0)}
                    </li>
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