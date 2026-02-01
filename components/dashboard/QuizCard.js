import { useState } from "react";
import Modal from "../shared/Modal";

export default function QuizCard({ problem, onNext }) {
  const [selectedOption, setSelectedOption] = useState(null); // Track selected answer
  const [isResponseChecked, setIsResponseChecked] = useState(false); // Track if user checked their response
  const [showInsight, setShowInsight] = useState(false); // Track if Key Insight is displayed
  const [modalContent, setModalContent] = useState(null); // Content for the modal

  const handleCheck = () => {
    if (!selectedOption) {
      setModalContent("Please select an option before checking!");
      return;
    }

    const isCorrect =
      selectedOption.is_correct || selectedOption === problem?.quiz?.correct_option;

    setModalContent(
      isCorrect
        ? "Correct! Good job!"
        : `Wrong! ${selectedOption?.why_wrong || ""}`.trim()
    );
    setIsResponseChecked(true);
  };

  const handleNext = () => {
    // Reset the states before moving to the next quiz
    setSelectedOption(null);
    setIsResponseChecked(false);
    setShowInsight(false);
    setModalContent(null);

    // Call the parent onNext function to load the next quiz
    onNext();
  };

  return (
    <div className="p-4 bg-white shadow-lg rounded">
      <h2 className="text-lg font-bold text-blue-950">{problem.title}</h2>
      <p className="text-gray-700 mt-2">
        <strong>Difficulty:</strong>{" "}
        <span
          className={`text-sm p-1 rounded font-medium ${
            {
              easy: "bg-green-100 text-green-700",
              medium: "bg-yellow-100 text-yellow-700",
              hard: "bg-red-100 text-red-700",
            }[problem.difficulty]
          }`}
        >
          {problem.difficulty}
        </span>
      </p>
      <p className="text-gray-600 mt-2">
        <strong>Summary:</strong> {problem.problem_summary}
      </p>

      {/* Quiz Section */}
      <div className="mt-6">
        <h2 className="text-lg font-bold text-blue-950">{problem.quiz.question}</h2>
        <div className="mt-4">
          {Array.isArray(problem.quiz.options) &&
            problem.quiz.options.map((option, index) => (
              <button
                key={option?.id || index}
                onClick={() => setSelectedOption(option)}
                className={`block w-full text-blue-950 bg-gray-100 px-4 py-2 rounded mt-2 text-left hover:bg-gray-200 ${
                  selectedOption === option ? "border-2 border-blue-600" : ""
                }`}
              >
                {option?.text ?? option}
              </button>
            ))}
        </div>
      </div>

      <div className="flex items-center space-x-4 mt-4">
        <button
          onClick={handleCheck}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Check
        </button>

        <button
          onClick={() => setShowInsight((prev) => !prev)}
          className="bg-gray-300 text-blue-950 px-4 py-2 rounded hover:bg-gray-400"
        >
          {showInsight ? "Hide Key Insight" : "Show Key Insight"}
        </button>
      </div>

      {/* Key Insight Section */}
      {showInsight && (
        <p className="mt-4 text-gray-600">
          <strong>Key Insight:</strong> {problem.key_insight}
        </p>
      )}

      {/* Canonical Idea, Pseudocode, Common Traps (shown after checking response) */}
      {isResponseChecked && (
        <div className="mt-6">
          <p className="text-gray-600">
            <strong>Canonical Idea:</strong> {problem.canonical_idea.one_liner}
          </p>

          <div className="mt-4">
            <strong className="text-gray-700">Pseudocode:</strong>
            <pre className="bg-gray-100 text-gray-800 p-4 rounded mt-2 text-sm overflow-x-auto">
              {problem.pseudo_code.join("\n")}
            </pre>
          </div>

          <div className="mt-4">
            <strong className="text-gray-700">Common Traps:</strong>
            <ul className="list-disc list-inside">
              {problem.common_traps.map((trap, index) => (
                <li key={index} className="text-gray-600">
                  {trap}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <button
        onClick={handleNext} // Use the local handleNext function
        className="bg-blue-600 text-white px-4 py-2 rounded mt-6 hover:bg-blue-700"
      >
        Next Quiz
      </button>

      {/* Display Modal */}
      {modalContent && (
        <Modal onClose={() => setModalContent(null)}>{modalContent}</Modal>
      )}
    </div>
  );
}