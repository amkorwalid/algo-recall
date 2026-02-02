export default function QuizResultsModal({ results, onClose, onRetry, onNewQuiz }) {
  const totalQuestions = results.length;
  const correctAnswers = results.filter((r) => r.isCorrect).length;
  const accuracy = ((correctAnswers / totalQuestions) * 100).toFixed(1);
  const totalTime = results.reduce((sum, r) => sum + (r.timeSpent || 0), 0);

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
    >
      <div 
        className="rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: '#303030' }}
      >
        <div 
          className="sticky top-0 border-b p-6"
          style={{ backgroundColor: '#303030', borderColor: 'rgba(255,255,255,0.08)' }}
        >
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold" style={{ color: '#FA8112' }}>Quiz Results</h2>
            <button
              onClick={onClose}
              className="text-2xl transition duration-300"
              style={{ color: 'rgba(245,231,198,0.6)' }}
              onMouseEnter={(e) => e.target.style.color = '#FAF3E1'}
              onMouseLeave={(e) => e.target.style.color = 'rgba(245,231,198,0.6)'}
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div 
              className="p-4 rounded-lg text-center"
              style={{ backgroundColor: '#2A2A2A' }}
            >
              <div className="text-3xl font-bold" style={{ color: '#FA8112' }}>{correctAnswers}/{totalQuestions}</div>
              <div style={{ color: 'rgba(245,231,198,0.6)' }}>Score</div>
            </div>
            <div 
              className="p-4 rounded-lg text-center"
              style={{ backgroundColor: '#2A2A2A' }}
            >
              <div className="text-3xl font-bold" style={{ color: '#FA8112' }}>{accuracy}%</div>
              <div style={{ color: 'rgba(245,231,198,0.6)' }}>Accuracy</div>
            </div>
            <div 
              className="p-4 rounded-lg text-center"
              style={{ backgroundColor: '#2A2A2A' }}
            >
              <div className="text-3xl font-bold" style={{ color: '#FA8112' }}>{totalTime}s</div>
              <div style={{ color: 'rgba(245,231,198,0.6)' }}>Total Time</div>
            </div>
          </div>

          {/* Question Breakdown */}
          <div>
            <h3 className="text-xl font-semibold mb-4" style={{ color: '#FAF3E1' }}>Question Breakdown</h3>
            <div className="space-y-3">
              {results.map((result, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border"
                  style={
                    result.isCorrect
                      ? { backgroundColor: 'rgba(34,197,94,0.1)', borderColor: '#22c55e' }
                      : { backgroundColor: 'rgba(239,68,68,0.1)', borderColor: '#ef4444' }
                  }
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold" style={{ color: '#FAF3E1' }}>
                        {result.isCorrect ? '✅' : '❌'} {result.problem.title}
                      </h4>
                      <p className="text-sm mt-1" style={{ color: 'rgba(245,231,198,0.6)' }}>
                        Your Answer: {result.selectedOption?.text || 'Not answered'}
                      </p>
                      {!result.isCorrect && (
                        <p className="text-sm mt-1" style={{ color: '#F5E7C6' }}>
                          Correct Answer: {result.problem.quiz.options.find(o => o.is_correct)?.text}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-sm" style={{ color: 'rgba(245,231,198,0.6)' }}>Time: {result.timeSpent || 0}s</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={onRetry}
              className="flex-1 px-6 py-3 rounded-lg font-medium transition duration-300"
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
              Retry Quiz
            </button>
            <button
              onClick={onNewQuiz}
              className="flex-1 px-6 py-3 rounded-lg font-medium transition duration-300"
              style={{ backgroundColor: '#FA8112', color: '#222222' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#E9720F'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#FA8112'}
            >
              Start New Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}