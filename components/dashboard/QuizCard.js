import { useState, useEffect } from "react";
import Modal from "../shared/Modal";

export default function QuizCard({ problem, onNext, questionNumber, totalQuestions, timerEnabled, timeLimit }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isResponseChecked, setIsResponseChecked] = useState(false);
  const [showInsight, setShowInsight] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit || 30);
  const [skipped, setSkipped] = useState(false);

  const difficultyColors = {
    easy: '#22c55e',
    medium: '#eab308',
    hard: '#ef4444',
  };

  useEffect(() => {
    if (timerEnabled && timeRemaining > 0 && !isResponseChecked) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timerEnabled, timeRemaining, isResponseChecked]);

  useEffect(() => {
    if (timeRemaining === 0 && !isResponseChecked) {
      handleCheck();
    }
  }, [timeRemaining]);

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

  const handleSkip = () => {
    setSkipped(true);
    onNext({ skipped: true, problem });
  };

  const handleNext = () => {
    const result = {
      problem,
      selectedOption,
      isCorrect: selectedOption?.is_correct || selectedOption === problem?.quiz?.correct_option,
      timeSpent: (timeLimit || 30) - timeRemaining,
    };

    // Reset states
    setSelectedOption(null);
    setIsResponseChecked(false);
    setShowInsight(false);
    setModalContent(null);
    setTimeRemaining(timeLimit || 30);
    setSkipped(false);

    onNext(result);
  };

  return (
    <div 
      className="p-6 rounded-lg shadow-lg border"
      style={{ backgroundColor: '#2A2A2A', borderColor: 'rgba(255,255,255,0.08)' }}
    >
      {/* Progress and Timer */}
      <div className="flex justify-between items-center mb-4">
        <div style={{ color: '#F5E7C6' }}>
          Question <span className="font-bold" style={{ color: '#FA8112' }}>{questionNumber}</span> of{" "}
          <span className="font-bold">{totalQuestions}</span>
        </div>
        {timerEnabled && (
          <div 
            className="text-lg font-bold"
            style={{ color: timeRemaining <= 5 ? '#ef4444' : '#FA8112' }}
          >
            ⏱️ {timeRemaining}s
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full rounded-full h-2 mb-6" style={{ backgroundColor: '#303030' }}>
        <div
          className="h-2 rounded-full transition-all duration-300"
          style={{ 
            width: `${(questionNumber / totalQuestions) * 100}%`,
            backgroundColor: '#FA8112'
          }}
        ></div>
      </div>

      {/* Problem Title */}
      <h2 className="text-xl font-bold mb-2" style={{ color: '#FAF3E1' }}>{problem.title}</h2>
      <p className="mb-1" style={{ color: '#F5E7C6' }}>
        <strong>Difficulty:</strong>{" "}
        <span
          className="text-sm px-2 py-1 rounded font-medium text-white"
          style={{ backgroundColor: difficultyColors[problem.difficulty] }}
        >
          {problem.difficulty}
        </span>
      </p>
      <p className="mb-4" style={{ color: 'rgba(245,231,198,0.6)' }}>
        <strong>Summary:</strong> {problem.problem_summary}
      </p>

      {/* Quiz Question */}
      <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: '#303030' }}>
        <h3 className="text-lg font-bold mb-4" style={{ color: '#FA8112' }}>{problem.quiz.question}</h3>
        <div className="space-y-3">
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
                    border: '1px solid'
                  };
                } else if (selectedOption === option) {
                  optionStyle = { 
                    backgroundColor: 'rgba(239,68,68,0.2)', 
                    borderColor: '#ef4444',
                    color: '#ef4444',
                    border: '1px solid'
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
                  className="block w-full px-4 py-3 rounded text-left transition duration-300"
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
      <div className="flex items-center space-x-4 mt-6">
        {!isResponseChecked ? (
          <>
            <button
              onClick={handleCheck}
              className="px-6 py-2 rounded-lg font-medium transition duration-300"
              style={{ backgroundColor: '#FA8112', color: '#222222' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#E9720F'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#FA8112'}
            >
              Check Answer
            </button>
            <button
              onClick={() => setShowInsight((prev) => !prev)}
              className="px-6 py-2 rounded-lg transition duration-300"
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
            <button
              onClick={handleSkip}
              className="px-6 py-2 rounded-lg transition duration-300"
              style={{ backgroundColor: '#303030', color: 'rgba(245,231,198,0.6)' }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#eab308';
                e.target.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#303030';
                e.target.style.color = 'rgba(245,231,198,0.6)';
              }}
            >
              Skip
            </button>
          </>
        ) : (
          <button
            onClick={handleNext}
            className="px-6 py-2 rounded-lg font-medium transition duration-300"
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
          className="mt-4 p-4 border rounded-lg"
          style={{ 
            backgroundColor: 'rgba(250,129,18,0.15)',
            borderColor: 'rgba(250,129,18,0.35)'
          }}
        >
          <p style={{ color: '#F5E7C6' }}>
            <strong style={{ color: '#FA8112' }}>💡 Hint:</strong> {problem.key_insight}
          </p>
        </div>
      )}

      {/* Detailed Explanation (after checking) */}
      {isResponseChecked && (
        <div className="mt-6 space-y-4">
          <div className="p-4 rounded-lg" style={{ backgroundColor: '#303030' }}>
            <h4 className="font-semibold mb-2" style={{ color: '#FA8112' }}>📌 Canonical Idea</h4>
            <p style={{ color: '#F5E7C6' }}>{problem.canonical_idea.one_liner}</p>
          </div>

          <div className="p-4 rounded-lg" style={{ backgroundColor: '#303030' }}>
            <h4 className="font-semibold mb-2" style={{ color: '#FA8112' }}>💻 Pseudocode</h4>
            <pre 
              className="p-4 rounded text-sm overflow-x-auto"
              style={{ backgroundColor: '#222222', color: '#F5E7C6' }}
            >
              {problem.pseudo_code.join("\n")}
            </pre>
          </div>

          <div className="p-4 rounded-lg" style={{ backgroundColor: '#303030' }}>
            <h4 className="font-semibold mb-2" style={{ color: '#FA8112' }}>⚠️ Common Traps</h4>
            <ul className="list-disc list-inside space-y-1" style={{ color: '#F5E7C6' }}>
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