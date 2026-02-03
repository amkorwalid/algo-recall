import { useState } from "react";
import Modal from "../shared/Modal";

export default function QuizCard({ problem, onNext }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isResponseChecked, setIsResponseChecked] = useState(false);
  const [showInsight, setShowInsight] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const difficultyColors = {
    easy: '#22c55e',
    medium: '#eab308',
    hard: '#ef4444',
  };

  const handleCheck = () => {
    if (!selectedOption) {
      setModalContent("Please select an option before checking!");
      return;
    }

    const isCorrect =
      selectedOption.is_correct || selectedOption === problem?.quiz?.correct_option;

    setModalContent(
      isCorrect
        ? "✅ Correct! Good job!"
        : `❌ Wrong! ${selectedOption?.why_wrong || ""}`.trim()
    );
    setIsResponseChecked(true);
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsResponseChecked(false);
    setShowInsight(false);
    setModalContent(null);
    onNext();
  };

  return (
    <div 
      className="p-4 md:p-6 rounded-lg shadow-lg border"
      style={{ backgroundColor: '#2A2A2A', borderColor: 'rgba(255,255,255,0.08)' }}
    >
      {/* Problem Header */}
      <div className="mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-bold mb-3" style={{ color: '#FAF3E1' }}>
          {problem.title}
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          <span 
            className="px-3 py-1 rounded text-xs md:text-sm font-medium text-white"
            style={{ backgroundColor: difficultyColors[problem.difficulty] }}
          >
            {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
          </span>
          {problem.topics.slice(0, 3).map((topic, idx) => (
            <span 
              key={idx} 
              className="px-2 py-1 rounded text-xs"
              style={{ backgroundColor: '#303030', color: '#F5E7C6' }}
            >
              {topic.replace('_', ' ')}
            </span>
          ))}
          {problem.topics.length > 3 && (
            <span 
              className="px-2 py-1 rounded text-xs"
              style={{ backgroundColor: '#303030', color: 'rgba(245,231,198,0.6)' }}
            >
              +{problem.topics.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Problem Summary */}
      <div 
        className="p-3 md:p-4 rounded-lg mb-4 md:mb-6"
        style={{ backgroundColor: '#303030' }}
      >
        <p className="text-sm md:text-base" style={{ color: '#F5E7C6' }}>
          <strong style={{ color: '#FA8112' }}>Summary:</strong> {problem.problem_summary}
        </p>
      </div>

      {/* Quiz Question */}
      <div className="mb-4 md:mb-6">
        <h3 className="text-lg md:text-xl font-bold mb-4" style={{ color: '#FA8112' }}>
          {problem.quiz.question}
        </h3>
        <div className="space-y-2 md:space-y-3">
          {Array.isArray(problem.quiz.options) &&
            problem.quiz.options.map((option, index) => {
              let optionStyle = { 
                backgroundColor: '#222222', 
                color: '#FAF3E1',
                borderColor: 'rgba(255,255,255,0.08)',
                border: '1px solid'
              };
              
              if (isResponseChecked) {
                if (option.is_correct) {
                  optionStyle = { 
                    backgroundColor: 'rgba(34,197,94,0.2)', 
                    borderColor: '#22c55e',
                    color: '#22c55e',
                    border: '2px solid'
                  };
                } else if (selectedOption === option) {
                  optionStyle = { 
                    backgroundColor: 'rgba(239,68,68,0.2)', 
                    borderColor: '#ef4444',
                    color: '#ef4444',
                    border: '2px solid'
                  };
                }
              } else if (selectedOption === option) {
                optionStyle = { 
                  backgroundColor: 'rgba(250,129,18,0.15)',
                  borderColor: 'rgba(250,129,18,0.35)',
                  border: '2px solid',
                  color: '#FAF3E1'
                };
              }

              return (
                <button
                  key={option?.id || index}
                  onClick={() => !isResponseChecked && setSelectedOption(option)}
                  disabled={isResponseChecked}
                  className="block w-full px-3 md:px-4 py-3 md:py-4 rounded text-left transition duration-300 text-sm md:text-base"
                  style={optionStyle}
                  onMouseEnter={(e) => {
                    if (!isResponseChecked && selectedOption !== option) {
                      e.target.style.backgroundColor = '#303030';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isResponseChecked && selectedOption !== option) {
                      e.target.style.backgroundColor = '#222222';
                    }
                  }}
                >
                  <span className="font-semibold">{option?.id || String.fromCharCode(65 + index)}.</span> {option?.text ?? option}
                </button>
              );
            })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
        {!isResponseChecked ? (
          <>
            <button
              onClick={handleCheck}
              className="flex-1 px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium transition duration-300 text-sm md:text-base"
              style={{ backgroundColor: '#FA8112', color: '#222222' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#E9720F'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#FA8112'}
            >
              Check Answer
            </button>
            <button
              onClick={() => setShowInsight((prev) => !prev)}
              className="flex-1 sm:flex-none px-4 md:px-6 py-2 md:py-3 rounded-lg transition duration-300 text-sm md:text-base"
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
              {showInsight ? "Hide Hint" : "💡 Show Hint"}
            </button>
          </>
        ) : (
          <button
            onClick={handleNext}
            className="w-full px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium transition duration-300 text-sm md:text-base"
            style={{ backgroundColor: '#FA8112', color: '#222222' }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#E9720F'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#FA8112'}
          >
            Next Question →
          </button>
        )}
      </div>

      {/* Key Insight */}
      {showInsight && (
        <div 
          className="p-3 md:p-4 border rounded-lg mb-4"
          style={{ 
            backgroundColor: 'rgba(250,129,18,0.15)',
            borderColor: 'rgba(250,129,18,0.35)'
          }}
        >
          <p className="text-sm md:text-base" style={{ color: '#F5E7C6' }}>
            <strong style={{ color: '#FA8112' }}>💡 Hint:</strong> {problem.key_insight}
          </p>
        </div>
      )}

      {/* Detailed Explanation (after checking) */}
      {isResponseChecked && (
        <div className="space-y-4">
          <div className="p-3 md:p-4 rounded-lg" style={{ backgroundColor: '#303030' }}>
            <h4 className="font-semibold mb-2 text-sm md:text-base" style={{ color: '#FA8112' }}>
              📌 Canonical Idea
            </h4>
            <p className="text-sm md:text-base" style={{ color: '#F5E7C6' }}>
              {problem.canonical_idea.one_liner}
            </p>
          </div>

          <div className="p-3 md:p-4 rounded-lg" style={{ backgroundColor: '#303030' }}>
            <h4 className="font-semibold mb-2 text-sm md:text-base" style={{ color: '#FA8112' }}>
              💻 Pseudocode
            </h4>
            <pre 
              className="p-3 md:p-4 rounded text-xs md:text-sm overflow-x-auto"
              style={{ backgroundColor: '#222222', color: '#F5E7C6' }}
            >
              {problem.pseudo_code.join("\n")}
            </pre>
          </div>

          <div className="p-3 md:p-4 rounded-lg" style={{ backgroundColor: '#303030' }}>
            <h4 className="font-semibold mb-2 text-sm md:text-base" style={{ color: '#FA8112' }}>
              ⚠️ Common Traps
            </h4>
            <ul className="list-disc list-inside space-y-1 text-sm md:text-base" style={{ color: '#F5E7C6' }}>
              {problem.common_traps.map((trap, index) => (
                <li key={index}>{trap}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Display Modal */}
      {modalContent && (
        <Modal onClose={() => setModalContent(null)}>{modalContent}</Modal>
      )}
    </div>
  );
}