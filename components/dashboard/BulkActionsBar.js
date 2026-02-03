export default function BulkActionsBar({ selectedCount, onAddToQuizSet, onMarkFavorite, onExport, onClear }) {
  if (selectedCount === 0) return null;

  return (
    <div 
      className="border p-3 md:p-4 rounded-lg mb-4"
      style={{ 
        backgroundColor: 'rgba(250,129,18,0.15)',
        borderColor: 'rgba(250,129,18,0.35)'
      }}
    >
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Counter */}
        <span className="font-medium text-sm md:text-base" style={{ color: '#FAF3E1' }}>
          {selectedCount} problem{selectedCount !== 1 ? 's' : ''} selected
        </span>

        {/* Actions */}
        <div className="grid grid-cols-2 sm:flex gap-2">
          <button
            onClick={onAddToQuizSet}
            className="px-3 md:px-4 py-2 rounded text-xs md:text-sm font-medium transition duration-300 whitespace-nowrap"
            style={{ backgroundColor: '#FA8112', color: '#222222' }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#E9720F'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#FA8112'}
          >
            <span className="sm:hidden">📝 Quiz</span>
            <span className="hidden sm:inline">Add to Quiz Set</span>
          </button>
          <button
            onClick={onMarkFavorite}
            className="px-3 md:px-4 py-2 rounded text-xs md:text-sm font-medium transition duration-300 whitespace-nowrap"
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
            <span className="sm:hidden">⭐ Fav</span>
            <span className="hidden sm:inline">Mark as Favorite</span>
          </button>
          <button
            onClick={onExport}
            className="px-3 md:px-4 py-2 rounded text-xs md:text-sm font-medium transition duration-300 whitespace-nowrap"
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
            <span className="sm:hidden">💾</span>
            <span className="hidden sm:inline">Export</span>
          </button>
          <button
            onClick={onClear}
            className="px-3 md:px-4 py-2 rounded text-xs md:text-sm font-medium transition duration-300 whitespace-nowrap"
            style={{ backgroundColor: '#303030', color: 'rgba(245,231,198,0.6)' }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#ef4444';
              e.target.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#303030';
              e.target.style.color = 'rgba(245,231,198,0.6)';
            }}
          >
            <span className="sm:hidden">✕</span>
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>
    </div>
  );
}