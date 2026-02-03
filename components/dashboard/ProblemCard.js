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
      className="p-3 md:p-4 rounded-lg border transition duration-300"
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
      {/* Mobile Layout */}
      <div className="md:hidden">
        {/* Header Row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start space-x-2 flex-1">
            {/* Checkbox */}
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onSelect(problem.id)}
              className="mt-1 w-4 h-4 flex-shrink-0"
              style={{ accentColor: '#FA8112' }}
            />

            {/* Title and Icons */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <h3 
                  className="font-semibold text-sm line-clamp-2 flex-1" 
                  style={{ color: '#FAF3E1' }}
                >
                  {problem.title}
                </h3>
                <div className="flex items-center space-x-1 flex-shrink-0">
                  <span className="text-base">{statusIcons[status]}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(problem.id);
                    }}
                    className="text-base transition duration-300 active:scale-125"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    {isFavorite ? '⭐' : '☆'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tags Row */}
        <div className="flex flex-wrap items-center gap-1.5 mb-2 ml-6">
          <span 
            className="px-2 py-0.5 rounded text-xs font-medium text-white"
            style={{ backgroundColor: difficultyColors[problem.difficulty] }}
          >
            {problem.difficulty}
          </span>
          {problem.topics.slice(0, 2).map((topic, idx) => (
            <span 
              key={idx} 
              className="px-2 py-0.5 rounded text-xs"
              style={{ backgroundColor: '#303030', color: '#F5E7C6' }}
            >
              {topic.replace('_', ' ')}
            </span>
          ))}
          {problem.topics.length > 2 && (
            <span 
              className="px-2 py-0.5 rounded text-xs"
              style={{ backgroundColor: '#303030', color: 'rgba(245,231,198,0.6)' }}
            >
              +{problem.topics.length - 2}
            </span>
          )}
        </div>

        {/* Summary */}
        <p 
          className="text-xs line-clamp-2 mb-3 ml-6" 
          style={{ color: 'rgba(245,231,198,0.6)' }}
        >
          {problem.problem_summary}
        </p>

        {/* Action Button */}
        <div className="ml-6">
          <button
            onClick={() => onViewDetails(problem)}
            className="w-full px-3 py-2 rounded text-sm font-medium transition duration-300"
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

      {/* Desktop/Tablet Layout */}
      <div className="hidden md:flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          {/* Checkbox */}
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(problem.id)}
            className="mt-1 w-4 h-4 flex-shrink-0"
            style={{ accentColor: '#FA8112' }}
          />

          {/* Problem Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2 flex-wrap">
              <h3 
                className="font-semibold text-base lg:text-lg" 
                style={{ color: '#FAF3E1' }}
              >
                {problem.title}
              </h3>
              <span className="text-lg">{statusIcons[status]}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(problem.id);
                }}
                className="text-lg transition duration-300 hover:scale-110"
              >
                {isFavorite ? '⭐' : '☆'}
              </button>
            </div>

            <div className="flex items-center flex-wrap gap-2 mb-2">
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
              {problem.topics.length > 3 && (
                <span 
                  className="px-2 py-1 rounded text-xs"
                  style={{ backgroundColor: '#303030', color: 'rgba(245,231,198,0.6)' }}
                >
                  +{problem.topics.length - 3} more
                </span>
              )}
            </div>

            <p 
              className="text-sm line-clamp-2" 
              style={{ color: 'rgba(245,231,198,0.6)' }}
            >
              {problem.problem_summary}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col space-y-2 ml-4 flex-shrink-0">
          <button
            onClick={() => onViewDetails(problem)}
            className="px-4 py-2 rounded text-sm transition duration-300 whitespace-nowrap"
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