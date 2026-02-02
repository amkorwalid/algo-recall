import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@clerk/nextjs";
import Sidebar from "@/components/dashboard/Sidebar";
// import Header from "../../../components/dashboard/Header";
import Header from "@/components/dashboard/Header";
import QuizCard from "@/components/dashboard/QuizCard";
import QuizResultsModal from "@/components/dashboard/QuizResultsModal";

export default function QuizPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const { problemId, mode, topic, difficulty } = router.query;

  const [problems, setProblems] = useState([]);
  const [quizProblems, setQuizProblems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quizResults, setQuizResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [timerEnabled, setTimerEnabled] = useState(false);

  const loadQuizProblems = useCallback((allProblems) => {
    let selected = [];

    if (problemId) {
      // Single problem quiz
      selected = allProblems.filter((p) => p.id === problemId);
    } else if (mode === "random") {
      // Random quiz (can select multiple for a longer quiz)
      const shuffled = [...allProblems].sort(() => 0.5 - Math.random());
      selected = shuffled.slice(0, 5); // 5 random problems
    } else if (mode === "topic" && topic) {
      // Topic-based quiz
      selected = allProblems.filter((p) => p.topics.includes(topic));
    } else if (mode === "difficulty" && difficulty) {
      // Difficulty-based quiz
      selected = allProblems.filter((p) => p.difficulty === difficulty);
    } else if (mode === "custom") {
      // Custom quiz set
      const customSet = JSON.parse(localStorage.getItem("customQuizSet") || "[]");
      selected = allProblems.filter((p) => customSet.includes(p.id));
    } else {
      // Default: random problem
      selected = [allProblems[Math.floor(Math.random() * allProblems.length)]];
    }

    setQuizProblems(selected);
  }, [problemId, mode, topic, difficulty]);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((data) => {
        setProblems(data.problems);
        loadQuizProblems(data.problems);
      });
  }, [problemId, mode, topic, difficulty, loadQuizProblems]);

  const handleNext = useCallback((result) => {
    if (!result.skipped) {
      const updatedResults = [...quizResults, result];
      setQuizResults(updatedResults);

      // Update problem status
      const status = JSON.parse(localStorage.getItem("problemStatus") || "{}");
      status[result.problem.id] = result.isCorrect ? "completed" : "in_progress";
      localStorage.setItem("problemStatus", JSON.stringify(status));
    }

    if (currentIndex + 1 < quizProblems.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Quiz completed
      setShowResults(true);
    }
  }, [quizResults, currentIndex, quizProblems.length]);

  const handleRetry = useCallback(() => {
    setCurrentIndex(0);
    setQuizResults([]);
    setShowResults(false);
  }, []);

  const handleNewQuiz = useCallback(() => {
    setCurrentIndex(0);
    setQuizResults([]);
    setShowResults(false);
    router.push("/dashboard/quiz");
  }, [router]);

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

  if (!problemId && !mode) {
    // Show quiz mode selection
    return (
      <div className="flex min-h-screen" style={{ backgroundColor: '#222222' }}>
        <Sidebar />
        <div className="flex-grow">
          <Header />
          <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold mb-6" style={{ color: '#FAF3E1' }}>
              Select Quiz Mode
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <button
                onClick={() => router.push("/dashboard/quiz?mode=random")}
                className="p-6 rounded-lg border transition duration-300"
                style={{ 
                  backgroundColor: '#2A2A2A',
                  borderColor: 'rgba(255,255,255,0.08)'
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
                <div className="text-4xl mb-2">🎲</div>
                <h3 className="text-xl font-semibold" style={{ color: '#FA8112' }}>
                  Random Quiz
                </h3>
                <p className="text-sm mt-2" style={{ color: 'rgba(245,231,198,0.6)' }}>
                  Practice with 5 random problems
                </p>
              </button>

              <button
                onClick={() => router.push("/dashboard/quiz?mode=topic&topic=sliding_window")}
                className="p-6 rounded-lg border transition duration-300"
                style={{ 
                  backgroundColor: '#2A2A2A',
                  borderColor: 'rgba(255,255,255,0.08)'
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
                <div className="text-4xl mb-2">🎯</div>
                <h3 className="text-xl font-semibold" style={{ color: '#FA8112' }}>
                  Topic-Based
                </h3>
                <p className="text-sm mt-2" style={{ color: 'rgba(245,231,198,0.6)' }}>
                  Focus on specific algorithms
                </p>
              </button>

              <button
                onClick={() => router.push("/dashboard/quiz?mode=difficulty&difficulty=medium")}
                className="p-6 rounded-lg border transition duration-300"
                style={{ 
                  backgroundColor: '#2A2A2A',
                  borderColor: 'rgba(255,255,255,0.08)'
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
                <div className="text-4xl mb-2">📊</div>
                <h3 className="text-xl font-semibold" style={{ color: '#FA8112' }}>
                  Difficulty-Based
                </h3>
                <p className="text-sm mt-2" style={{ color: 'rgba(245,231,198,0.6)' }}>
                  Practice by difficulty level
                </p>
              </button>

              <button
                onClick={() => router.push("/dashboard/quiz?mode=custom")}
                className="p-6 rounded-lg border transition duration-300"
                style={{ 
                  backgroundColor: '#2A2A2A',
                  borderColor: 'rgba(255,255,255,0.08)'
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
                <div className="text-4xl mb-2">📝</div>
                <h3 className="text-xl font-semibold" style={{ color: '#FA8112' }}>
                  Custom Set
                </h3>
                <p className="text-sm mt-2" style={{ color: 'rgba(245,231,198,0.6)' }}>
                  Quiz from your saved problems
                </p>
              </button>

              <button
                onClick={() => {
                  setTimerEnabled(true);
                  router.push("/dashboard/quiz?mode=random");
                }}
                className="p-6 rounded-lg border transition duration-300"
                style={{ 
                  backgroundColor: '#2A2A2A',
                  borderColor: 'rgba(255,255,255,0.08)'
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
                <div className="text-4xl mb-2">⏱️</div>
                <h3 className="text-xl font-semibold" style={{ color: '#FA8112' }}>
                  Timed Challenge
                </h3>
                <p className="text-sm mt-2" style={{ color: 'rgba(245,231,198,0.6)' }}>
                  Race against the clock (30s per question)
                </p>
              </button>

              <button
                onClick={() => router.push("/dashboard/problems")}
                className="p-6 rounded-lg border transition duration-300"
                style={{ 
                  backgroundColor: '#2A2A2A',
                  borderColor: 'rgba(255,255,255,0.08)'
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
                <div className="text-4xl mb-2">📚</div>
                <h3 className="text-xl font-semibold" style={{ color: '#FA8112' }}>
                  Browse Problems
                </h3>
                <p className="text-sm mt-2" style={{ color: 'rgba(245,231,198,0.6)' }}>
                  View all problems and start specific quiz
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return isSignedIn && quizProblems.length > 0 ? (
    <div className="flex min-h-screen" style={{ backgroundColor: '#222222' }}>
      <Sidebar />
      <div className="flex-grow">
        <Header />
        <div className="container mx-auto px-6 py-8">
          <QuizCard
            problem={quizProblems[currentIndex]}
            onNext={handleNext}
            questionNumber={currentIndex + 1}
            totalQuestions={quizProblems.length}
            timerEnabled={timerEnabled}
            timeLimit={30}
          />
        </div>
      </div>

      {showResults && (
        <QuizResultsModal
          results={quizResults}
          onClose={() => {
            setShowResults(false);
            router.push("/dashboard");
          }}
          onRetry={handleRetry}
          onNewQuiz={handleNewQuiz}
        />
      )}
    </div>
  ) : (
    <div 
      className="flex min-h-screen items-center justify-center"
      style={{ backgroundColor: '#222222' }}
    >
      <div 
        className="text-center p-8 rounded-lg border"
        style={{ 
          backgroundColor: '#2A2A2A',
          borderColor: 'rgba(255,255,255,0.08)'
        }}
      >
        <p className="text-xl mb-4" style={{ color: '#FAF3E1' }}>
          No problems available for this quiz mode.
        </p>
        <button
          onClick={() => router.push("/dashboard/quiz")}
          className="px-6 py-2 rounded-lg transition duration-300"
          style={{ backgroundColor: '#FA8112', color: '#222222' }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#E9720F'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#FA8112'}
        >
          Choose Another Mode
        </button>
      </div>
    </div>
  );
}