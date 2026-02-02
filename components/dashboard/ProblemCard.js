export default function ProblemCard({ problem, status, onSelect, isSelected, onToggleFavorite, isFavorite, onViewDetails }) {
  const difficultyColors = {
    easy: '#22c55e',
    medium: '#eab308',
    hard: '#ef4444',
  };

  const statusIcons = {
    completed: '✅',
    in_progress: '⚠️',
    not_attempted: '❌',
  };

  return (
    <div 
      className="p-4 rounded-lg border transition duration-300"
      style={{ 
        backgroundColor: '#2A2A2A',
        borderColor: isSelected ? 'rgba(250,129,18,0.35)' : 'rgba(255,255,255,0.08)'
      }}
      onMouseEnter={(e) => {
        if (!isSelected) e.currentTarget.style.borderColor = 'rgba(250,129,18,0.35)';
      }}
      onMouseLeave={(e) => {
        if (!isSelected) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          {/* Checkbox */}
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(problem.id)}
            className="mt-1 w-4 h-4"
            style={{ accentColor: '#FA8112' }}
          />

          {/* Problem Info */}
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="font-semibold" style={{ color: '#FAF3E1' }}>{problem.title}</h3>
              <span className="text-lg">{statusIcons[status]}</span>
              <button
                onClick={() => onToggleFavorite(problem.id)}
                className="text-lg transition duration-300 hover:scale-110"
              >
                {isFavorite ? '⭐' : '☆'}
              </button>
            </div>

            <div className="flex items-center space-x-2 mb-2">
              <span 
                className="px-2 py-1 rounded text-xs font-medium text-white"
                style={{ backgroundColor: difficultyColors[problem.difficulty] }}
              >
                {problem.difficulty}
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
            </div>

            <p className="text-sm" style={{ color: 'rgba(245,231,198,0.6)' }}>{problem.problem_summary}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col space-y-2">
          <button
            onClick={() => onViewDetails(problem)}
            className="px-3 py-1 rounded text-sm transition duration-300"
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
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}