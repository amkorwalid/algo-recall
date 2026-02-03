import { useEffect } from 'react';

export default function ProblemDetailsModal({ problem, onClose, onStartQuiz }) {
  if (!problem) return null;

  const difficultyColors = {
    easy: '#22c55e',
    medium: '#eab308',
    hard: '#ef4444',
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 p-0 md:p-4" 
      style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
      onClick={onClose}
    >
      <div 
        className="rounded-none md:rounded-lg shadow-lg w-full h-full md:h-auto md:max-w-3xl md:max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: '#303030' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Sticky on mobile */}
        <div 
          className="sticky top-0 border-b p-4 md:p-6 flex justify-between items-start md:items-center gap-3 z-10"
          style={{ backgroundColor: '#303030', borderColor: 'rgba(255,255,255,0.08)' }}
        >
          <h2 
            className="text-lg md:text-2xl font-bold flex-1 pr-2" 
            style={{ color: '#FA8112' }}
          >
            {problem.title}
          </h2>
          <button
            onClick={onClose}
            className="text-2xl md:text-3xl transition duration-300 flex-shrink-0 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg"
            style={{ color: 'rgba(245,231,198,0.6)' }}
            onMouseEnter={(e) => {
              e.target.style.color = '#FAF3E1';
              e.target.style.backgroundColor = 'rgba(255,255,255,0.08)';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = 'rgba(245,231,198,0.6)';
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 space-y-4 md:space-y-6 pb-52 md:pb-6">
          {/* Difficulty & Topics */}
          <div className="flex items-start md:items-center flex-col md:flex-row gap-2 md:gap-0">
            <span 
              className="px-3 py-1 rounded text-xs md:text-sm font-medium text-white inline-block"
              style={{ backgroundColor: difficultyColors[problem.difficulty] }}
            >
              {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
            </span>
            <div className="flex flex-wrap gap-2 md:ml-2">
              {problem.topics.map((topic, idx) => (
                <span 
                  key={idx} 
                  className="px-2 py-1 rounded text-xs md:text-sm"
                  style={{ backgroundColor: '#2A2A2A', color: '#F5E7C6' }}
                >
                  {topic.replace('_', ' ')}
                </span>
              ))}
            </div>
          </div>

          {/* Problem Summary */}
          <div>
            <h3 
              className="text-base md:text-lg font-semibold mb-2 flex items-center" 
              style={{ color: '#FA8112' }}
            >
              <span className="mr-2">📝</span>
              Problem Summary
            </h3>
            <p 
              className="text-sm md:text-base leading-relaxed" 
              style={{ color: '#F5E7C6' }}
            >
              {problem.problem_summary}
            </p>
          </div>

          {/* Canonical Idea */}
          <div 
            className="p-3 md:p-4 rounded-lg"
            style={{ backgroundColor: 'rgba(250,129,18,0.1)', borderLeft: '4px solid #FA8112' }}
          >
            <h3 
              className="text-base md:text-lg font-semibold mb-2 flex items-center" 
              style={{ color: '#FA8112' }}
            >
              <span className="mr-2">💡</span>
              Canonical Idea
            </h3>
            <p 
              className="text-sm md:text-base leading-relaxed" 
              style={{ color: '#F5E7C6' }}
            >
              {problem.canonical_idea.one_liner}
            </p>
            <div className="mt-2 flex items-center gap-2 text-xs" style={{ color: 'rgba(245,231,198,0.6)' }}>
              <span className="px-2 py-1 rounded" style={{ backgroundColor: 'rgba(250,129,18,0.2)' }}>
                Pattern: {problem.canonical_idea.pattern.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Key Insight */}
          <div 
            className="p-3 md:p-4 rounded-lg"
            style={{ backgroundColor: '#2A2A2A', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <h3 
              className="text-base md:text-lg font-semibold mb-2 flex items-center" 
              style={{ color: '#FA8112' }}
            >
              <span className="mr-2">🔑</span>
              Key Insight
            </h3>
            <p 
              className="text-sm md:text-base leading-relaxed" 
              style={{ color: '#F5E7C6' }}
            >
              {problem.key_insight}
            </p>
          </div>

          {/* Pseudocode - Optional section */}
          {problem.pseudo_code && (
            <div>
              <h3 
                className="text-base md:text-lg font-semibold mb-2 flex items-center" 
                style={{ color: '#FA8112' }}
              >
                <span className="mr-2">💻</span>
                Pseudocode
              </h3>
              <pre 
                className="p-3 md:p-4 rounded-lg text-xs md:text-sm overflow-x-auto"
                style={{ backgroundColor: '#222222', color: '#F5E7C6' }}
              >
                {problem.pseudo_code.join('\n')}
              </pre>
            </div>
          )}

          {/* Common Traps - Optional section */}
          {problem.common_traps && problem.common_traps.length > 0 && (
            <div>
              <h3 
                className="text-base md:text-lg font-semibold mb-2 flex items-center" 
                style={{ color: '#FA8112' }}
              >
                <span className="mr-2">⚠️</span>
                Common Traps
              </h3>
              <ul className="space-y-2">
                {problem.common_traps.map((trap, idx) => (
                  <li 
                    key={idx} 
                    className="flex items-start text-sm md:text-base"
                    style={{ color: '#F5E7C6' }}
                  >
                    <span className="mr-2 flex-shrink-0" style={{ color: '#eab308' }}>•</span>
                    <span>{trap}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Sticky Footer with Start Quiz Button - Mobile */}
        <div 
          className="fixed md:static bottom-0 left-0 right-0 p-4 md:p-6 border-t md:border-t-0"
          style={{ 
            backgroundColor: '#303030',
            borderColor: 'rgba(255,255,255,0.08)',
            boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onStartQuiz(problem)}
              className="flex-1 px-4 md:px-6 py-3 rounded-lg font-medium transition duration-300 text-sm md:text-base"
              style={{ backgroundColor: '#FA8112', color: '#222222' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#E9720F'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#FA8112'}
            >
              🚀 Start Quiz
            </button>
            <button
              onClick={onClose}
              className="sm:hidden px-4 py-3 rounded-lg font-medium transition duration-300 text-sm"
              style={{ backgroundColor: '#2A2A2A', color: '#F5E7C6' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#303030'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#2A2A2A'}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}