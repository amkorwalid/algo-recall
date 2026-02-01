import { useState, useEffect } from "react";
import Sidebar from "../../components/dashboard/Sidebar";
import Header from "../../components/dashboard/Header";
import QuizCard from "../../components/dashboard/QuizCard";

export default function QuizPage() {
  const [problem, setProblem] = useState(null); // Stores the entire problem object, not just quiz
  const [data, setData] = useState({ problems: [], solvedQuizzes: [] });

  const loadRandomQuiz = (data) => {
    const problems = Array.isArray(data?.problems) ? data.problems : [];
    const solvedQuizzes = Array.isArray(data?.solvedQuizzes)
      ? data.solvedQuizzes
      : [];
    const unsolvedQuizzes = problems.filter(
      (problem) => !solvedQuizzes.includes(problem.id)
    );

    if (unsolvedQuizzes.length > 0) {
      const randomProblem =
        unsolvedQuizzes[Math.floor(Math.random() * unsolvedQuizzes.length)];
      setProblem(randomProblem); // Update full problem object
    } else {
      setProblem(null); // No quizzes left
    }
  };

  useEffect(() => {
    // Fetch data from the JSON file
    fetch("/data.json")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        loadRandomQuiz(data);
      });
  }, []);

  const handleNextQuiz = () => {
    loadRandomQuiz(data);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="grow">
        <Header />
        <div className="container mx-auto px-6">
          <h1 className="text-2xl font-bold mt-6">Quiz</h1>
          <div className="mt-6">
            {problem ? (
              <QuizCard problem={problem} onNext={handleNextQuiz} />
            ) : (
              <p className="text-center text-gray-600">
                All quizzes are completed. Congratulations!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}