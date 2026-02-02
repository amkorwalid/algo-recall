export default function ProblemDetailsModal({ problem, onClose, onStartQuiz }) {
  if (!problem) return null;

  const difficultyColors = {
    easy: '#22c55e',
    medium: '#eab308',
    hard: '#ef4444',
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
      <div 
        className="rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: '#303030' }}
      >
        <div 
          className="sticky top-0 border-b p-6 flex justify-between items-center"
          style={{ backgroundColor: '#303030', borderColor: 'rgba(255,255,255,0.08)' }}
        >
          <h2 className="text-2xl font-bold" style={{ color: '#FA8112' }}>{problem.title}</h2>
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

        <div className="p-6 space-y-4">
          {/* Difficulty & Topics */}
          <div className="flex items-center space-x-2">
            <span 
              className="px-3 py-1 rounded text-sm font-medium text-white"
              style={{ backgroundColor: difficultyColors[problem.difficulty] }}
            >
              {problem.difficulty}
            </span>
            {problem.topics.map((topic, idx) => (
              <span 
                key={idx} 
                className="px-2 py-1 rounded text-sm"
                style={{ backgroundColor: '#2A2A2A', color: '#F5E7C6' }}
              >
                {topic.replace('_', ' ')}
              </span>
            ))}
          </div>

          {/* Problem Summary */}
          <div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: '#FA8112' }}>Problem Summary</h3>
            <p style={{ color: '#F5E7C6' }}>{problem.problem_summary}</p>
          </div>

          {/* Canonical Idea */}
          <div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: '#FA8112' }}>Canonical Idea</h3>
            <p style={{ color: '#F5E7C6' }}>{problem.canonical_idea.one_liner}</p>
          </div>

          {/* Key Insight */}
          <div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: '#FA8112' }}>Key Insight</h3>
            <p style={{ color: '#F5E7C6' }}>{problem.key_insight}</p>
          </div>

          {/* Start Quiz Button */}
          <button
            onClick={() => onStartQuiz(problem)}
            className="w-full px-6 py-3 rounded-lg font-medium transition duration-300"
            style={{ backgroundColor: '#FA8112', color: '#222222' }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#E9720F'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#FA8112'}
          >
            Start Quiz
          </button>
        </div>
      </div>
    </div>
  );
}