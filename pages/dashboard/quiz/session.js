import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@clerk/nextjs";
import { supabaseBrowser } from "@/lib/supabase/client";
import Modal from "../../../components/shared/Modal";

export default function QuizSessionPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();

  // Quiz state
  const [problems, setProblems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isResponseChecked, setIsResponseChecked] = useState(false);
  const [showInsight, setShowInsight] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  // Timer state
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef(null);

  // Results state
  const [results, setResults] = useState([]);
  const [quizComplete, setQuizComplete] = useState(false);
  const [sourceName, setSourceName] = useState("");

  // Exit confirmation
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const [loading, setLoading] = useState(true);

  const difficultyColors = {
    easy: "#22c55e",
    medium: "#eab308",
    hard: "#ef4444",
  };

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  const handleTimeUp = useCallback(() => {
    setQuizComplete(true);
  }, []);

  useEffect(() => {
    const loadQuizSession = async () => {
      const configStr = localStorage.getItem("quizSessionConfig");
      if (!configStr) {
        router.push("/dashboard/quiz");
        return;
      }

      const config = JSON.parse(configStr);
      setSourceName(config.sourceName);

      // Load problems from Supabase
      const supabase = supabaseBrowser();
      const { data, error } = await supabase
        .from("generated_questions")
        .select("*")
        .in("id", config.problemIds);

      if (error) {
        console.error(error);
        router.push("/dashboard/quiz");
        return;
      }

      // Shuffle problems to match the order in config
      const orderedProblems = config.problemIds
        .map((id) => data.find((p) => p.id === id))
        .filter(Boolean);

      setProblems(orderedProblems);

      // Setup timer
      if (config.timerEnabled && config.timerDuration) {
        setTimerEnabled(true);
        setTimeRemaining(config.timerDuration * 60); // Convert to seconds
        setIsTimerRunning(true);
      }

      setLoading(false);
    };

    if (isLoaded && isSignedIn) {
      loadQuizSession();
    }
  }, [isLoaded, isSignedIn, router]);

  // Timer effect
  useEffect(() => {
    if (isTimerRunning && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsTimerRunning(false);
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTimerRunning, handleTimeUp]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const currentProblem = problems[currentIndex];

  const handleCheck = () => {
    if (!selectedOption) {
      setModalContent("Please select an option before checking!");
      return;
    }

    const isCorrect =
      selectedOption.is_correct ||
      selectedOption === currentProblem?.quiz?.correct_option;

    setModalContent(
      isCorrect
        ? "✅ Correct! Good job!"
        : `❌ Wrong! ${selectedOption?.why_wrong || ""}`.trim()
    );
    setIsResponseChecked(true);

    // Record result
    setResults((prev) => [
      ...prev,
      {
        problemId: currentProblem.id,
        problemTitle: currentProblem.title,
        isCorrect,
        selectedOption: selectedOption?.text || selectedOption,
      },
    ]);
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsResponseChecked(false);
    setShowInsight(false);
    setModalContent(null);

    if (currentIndex + 1 >= problems.length) {
      // Quiz complete
      setQuizComplete(true);
      setIsTimerRunning(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleExit = () => {
    setShowExitConfirm(true);
  };

  const confirmExit = () => {
    // Clear quiz config
    localStorage.removeItem("quizSessionConfig");
    router.push("/dashboard/quiz");
  };

  const handleFinishReview = () => {
    localStorage.removeItem("quizSessionConfig");
    router.push("/dashboard/quiz");
  };

  if (!isLoaded || loading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ backgroundColor: "#222222" }}
      >
        <div style={{ color: "#FAF3E1" }}>Loading quiz...</div>
      </div>
    );
  }

  // Quiz Complete Screen
  if (quizComplete) {
    const correctCount = results.filter((r) => r.isCorrect).length;
    const accuracy =
      results.length > 0
        ? ((correctCount / results.length) * 100).toFixed(1)
        : 0;

    return (
      <div
        className="min-h-screen flex flex-col"
        style={{ backgroundColor: "#222222" }}
      >
        {/* Header */}
        <div
          className="p-4 border-b"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          <div className="container mx-auto flex items-center justify-between">
            <h1 className="text-xl font-bold" style={{ color: "#FA8112" }}>
              Quiz Complete! 🎉
            </h1>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
          {/* Score Card */}
          <div
            className="p-6 rounded-lg border mb-6 text-center"
            style={{
              backgroundColor: "#2A2A2A",
              borderColor: "rgba(255,255,255,0.08)",
            }}
          >
            <div className="text-6xl mb-4">
              {accuracy >= 80 ? "🏆" : accuracy >= 60 ? "👍" : "💪"}
            </div>
            <h2
              className="text-3xl font-bold mb-2"
              style={{ color: "#FAF3E1" }}
            >
              {correctCount} / {results.length}
            </h2>
            <p className="text-xl mb-4" style={{ color: "#FA8112" }}>
              {accuracy}% Accuracy
            </p>
            <p style={{ color: "rgba(245,231,198,0.6)" }}>
              Quiz: {sourceName}
            </p>
          </div>

          {/* Results Breakdown */}
          <div
            className="p-6 rounded-lg border mb-6"
            style={{
              backgroundColor: "#2A2A2A",
              borderColor: "rgba(255,255,255,0.08)",
            }}
          >
            <h3 className="text-lg font-bold mb-4" style={{ color: "#FA8112" }}>
              Results Breakdown
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {results.map((result, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg flex items-center justify-between"
                  style={{
                    backgroundColor: result.isCorrect
                      ? "rgba(34,197,94,0.1)"
                      : "rgba(239,68,68,0.1)",
                    borderLeft: `4px solid ${
                      result.isCorrect ? "#22c55e" : "#ef4444"
                    }`,
                  }}
                >
                  <span
                    className="text-sm truncate flex-1"
                    style={{ color: "#F5E7C6" }}
                  >
                    {result.problemTitle}
                  </span>
                  <span className="text-lg ml-2">
                    {result.isCorrect ? "✅" : "❌"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleFinishReview}
              className="flex-1 py-3 rounded-lg font-medium transition duration-300"
              style={{ backgroundColor: "#FA8112", color: "#222222" }}
              onMouseEnter={(e) =>
                (e.target.style.backgroundColor = "#E9720F")
              }
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = "#FA8112")
              }
            >
              Back to Quiz Setup
            </button>
            <button
              onClick={() => router.push("/dashboard/problems")}
              className="flex-1 py-3 rounded-lg font-medium transition duration-300"
              style={{ backgroundColor: "#303030", color: "#F5E7C6" }}
              onMouseEnter={(e) =>
                (e.target.style.backgroundColor = "#404040")
              }
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = "#303030")
              }
            >
              Browse Problems
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Session Screen
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#222222" }}
    >
      {/* Top Bar */}
      <div
        className="p-4 border-b sticky top-0 z-10"
        style={{
          backgroundColor: "#2A2A2A",
          borderColor: "rgba(255,255,255,0.08)",
        }}
      >
        <div className="container mx-auto flex items-center justify-between">
          {/* Exit Button */}
          <button
            onClick={handleExit}
            className="px-4 py-2 rounded-lg transition duration-300 flex items-center gap-2"
            style={{ backgroundColor: "#303030", color: "#F5E7C6" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#ef4444";
              e.currentTarget.style.color = "#ffffff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#303030";
              e.currentTarget.style.color = "#F5E7C6";
            }}
          >
            ✕ Exit
          </button>

          {/* Progress */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium" style={{ color: "#F5E7C6" }}>
              Question {currentIndex + 1} of {problems.length}
            </span>
            <div
              className="w-32 h-2 rounded-full hidden sm:block"
              style={{ backgroundColor: "#303030" }}
            >
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  backgroundColor: "#FA8112",
                  width: `${((currentIndex + 1) / problems.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Timer */}
          {timerEnabled && (
            <div
              className="px-4 py-2 rounded-lg flex items-center gap-2"
              style={{
                backgroundColor:
                  timeRemaining < 60
                    ? "rgba(239,68,68,0.2)"
                    : timeRemaining < 300
                    ? "rgba(234,179,8,0.2)"
                    : "#303030",
              }}
            >
              <span className="text-lg">⏱️</span>
              <span
                className="font-mono text-lg font-bold"
                style={{
                  color:
                    timeRemaining < 60
                      ? "#ef4444"
                      : timeRemaining < 300
                      ? "#eab308"
                      : "#FA8112",
                }}
              >
                {formatTime(timeRemaining)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Quiz Content */}
      <div className="flex-1 container mx-auto px-4 py-6 max-w-3xl">
        {currentProblem && (
          <div
            className="p-6 rounded-lg border"
            style={{
              backgroundColor: "#2A2A2A",
              borderColor: "rgba(255,255,255,0.08)",
            }}
          >
            {/* Problem Header */}
            <div className="mb-6">
              <h2
                className="text-xl md:text-2xl font-bold mb-3"
                style={{ color: "#FAF3E1" }}
              >
                {currentProblem.title}
              </h2>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="px-3 py-1 rounded text-xs md:text-sm font-medium text-white"
                  style={{
                    backgroundColor:
                      difficultyColors[currentProblem.difficulty],
                  }}
                >
                  {currentProblem.difficulty.charAt(0).toUpperCase() +
                    currentProblem.difficulty.slice(1)}
                </span>
                {currentProblem.topics.slice(0, 3).map((topic, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 rounded text-xs"
                    style={{ backgroundColor: "#303030", color: "#F5E7C6" }}
                  >
                    {topic.replace("_", " ")}
                  </span>
                ))}
              </div>
            </div>

            {/* Problem Summary */}
            <div
              className="p-4 rounded-lg mb-6"
              style={{ backgroundColor: "#303030" }}
            >
              <p className="text-sm md:text-base" style={{ color: "#F5E7C6" }}>
                <strong style={{ color: "#FA8112" }}>Summary:</strong>{" "}
                {currentProblem.problem_summary}
              </p>
            </div>

            {/* Quiz Question */}
            <div className="mb-6">
              <h3
                className="text-lg md:text-xl font-bold mb-4"
                style={{ color: "#FA8112" }}
              >
                {currentProblem.quiz.question}
              </h3>
              <div className="space-y-3">
                {Array.isArray(currentProblem.quiz.options) &&
                  currentProblem.quiz.options.map((option, index) => {
                    let optionStyle = {
                      backgroundColor: "#222222",
                      color: "#FAF3E1",
                      borderColor: "rgba(255,255,255,0.08)",
                      border: "1px solid",
                    };

                    if (isResponseChecked) {
                      if (option.is_correct) {
                        optionStyle = {
                          backgroundColor: "rgba(34,197,94,0.2)",
                          borderColor: "#22c55e",
                          color: "#22c55e",
                          border: "2px solid",
                        };
                      } else if (selectedOption === option) {
                        optionStyle = {
                          backgroundColor: "rgba(239,68,68,0.2)",
                          borderColor: "#ef4444",
                          color: "#ef4444",
                          border: "2px solid",
                        };
                      }
                    } else if (selectedOption === option) {
                      optionStyle = {
                        backgroundColor: "rgba(250,129,18,0.15)",
                        borderColor: "rgba(250,129,18,0.35)",
                        border: "2px solid",
                        color: "#FAF3E1",
                      };
                    }

                    return (
                      <button
                        key={option?.id || index}
                        onClick={() =>
                          !isResponseChecked && setSelectedOption(option)
                        }
                        disabled={isResponseChecked}
                        className="block w-full px-4 py-4 rounded text-left transition duration-300"
                        style={optionStyle}
                      >
                        <span className="font-semibold">
                          {option?.id || String.fromCharCode(65 + index)}.
                        </span>{" "}
                        {option?.text ?? option}
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch gap-3 mb-4">
              {!isResponseChecked ? (
                <>
                  <button
                    onClick={handleCheck}
                    className="flex-1 px-6 py-3 rounded-lg font-medium transition duration-300"
                    style={{ backgroundColor: "#FA8112", color: "#222222" }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#E9720F")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "#FA8112")
                    }
                  >
                    Check Answer
                  </button>
                  <button
                    onClick={() => setShowInsight((prev) => !prev)}
                    className="flex-1 sm:flex-none px-6 py-3 rounded-lg transition duration-300"
                    style={{ backgroundColor: "#303030", color: "#F5E7C6" }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#FA8112";
                      e.target.style.color = "#222222";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "#303030";
                      e.target.style.color = "#F5E7C6";
                    }}
                  >
                    {showInsight ? "Hide Hint" : "💡 Show Hint"}
                  </button>
                </>
              ) : (
                <button
                  onClick={handleNext}
                  className="w-full px-6 py-3 rounded-lg font-medium transition duration-300"
                  style={{ backgroundColor: "#FA8112", color: "#222222" }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#E9720F")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "#FA8112")
                  }
                >
                  {currentIndex + 1 >= problems.length
                    ? "Finish Quiz →"
                    : "Next Question →"}
                </button>
              )}
            </div>

            {/* Key Insight */}
            {showInsight && (
              <div
                className="p-4 border rounded-lg mb-4"
                style={{
                  backgroundColor: "rgba(250,129,18,0.15)",
                  borderColor: "rgba(250,129,18,0.35)",
                }}
              >
                <p className="text-sm md:text-base" style={{ color: "#F5E7C6" }}>
                  <strong style={{ color: "#FA8112" }}>💡 Hint:</strong>{" "}
                  {currentProblem.key_insight}
                </p>
              </div>
            )}

            {/* Detailed Explanation (after checking) */}
            {isResponseChecked && (
              <div className="space-y-4">
                <div
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: "#303030" }}
                >
                  <h4
                    className="font-semibold mb-2"
                    style={{ color: "#FA8112" }}
                  >
                    📌 Canonical Idea
                  </h4>
                  <p style={{ color: "#F5E7C6" }}>
                    {currentProblem.canonical_idea.one_liner}
                  </p>
                </div>

                <div
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: "#303030" }}
                >
                  <h4
                    className="font-semibold mb-2"
                    style={{ color: "#FA8112" }}
                  >
                    💻 Pseudocode
                  </h4>
                  <pre
                    className="p-4 rounded text-sm overflow-x-auto"
                    style={{ backgroundColor: "#222222", color: "#F5E7C6" }}
                  >
                    {currentProblem.pseudo_code.join("\n")}
                  </pre>
                </div>

                <div
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: "#303030" }}
                >
                  <h4
                    className="font-semibold mb-2"
                    style={{ color: "#FA8112" }}
                  >
                    ⚠️ Common Traps
                  </h4>
                  <ul
                    className="list-disc list-inside space-y-1"
                    style={{ color: "#F5E7C6" }}
                  >
                    {currentProblem.common_traps.map((trap, index) => (
                      <li key={index}>{trap}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal for answer feedback */}
      {modalContent && (
        <Modal onClose={() => setModalContent(null)}>{modalContent}</Modal>
      )}

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
        >
          <div
            className="p-6 rounded-lg max-w-md w-full"
            style={{ backgroundColor: "#2A2A2A" }}
          >
            <h3
              className="text-xl font-bold mb-4"
              style={{ color: "#FAF3E1" }}
            >
              Exit Quiz?
            </h3>
            <p className="mb-6" style={{ color: "rgba(245,231,198,0.6)" }}>
              Are you sure you want to exit? Your progress will be lost.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-2 rounded-lg transition duration-300"
                style={{ backgroundColor: "#303030", color: "#F5E7C6" }}
              >
                Cancel
              </button>
              <button
                onClick={confirmExit}
                className="flex-1 py-2 rounded-lg transition duration-300"
                style={{ backgroundColor: "#ef4444", color: "#ffffff" }}
              >
                Exit Quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}