export default function BulkActionsBar({ selectedCount, onAddToQuizSet, onMarkFavorite, onExport, onClear }) {
  if (selectedCount === 0) return null;

  return (
    <div 
      className="border p-4 rounded-lg mb-4 flex items-center justify-between"
      style={{ 
        backgroundColor: 'rgba(250,129,18,0.15)',
        borderColor: 'rgba(250,129,18,0.35)'
      }}
    >
      <span className="font-medium" style={{ color: '#FAF3E1' }}>{selectedCount} problem(s) selected</span>
      <div className="flex space-x-2">
        <button
          onClick={onAddToQuizSet}
          className="px-4 py-2 rounded transition duration-300"
          style={{ backgroundColor: '#FA8112', color: '#222222' }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#E9720F'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#FA8112'}
        >
          Add to Quiz Set
        </button>
        <button
          onClick={onMarkFavorite}
          className="px-4 py-2 rounded transition duration-300"
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
          Mark as Favorite
        </button>
        <button
          onClick={onExport}
          className="px-4 py-2 rounded transition duration-300"
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
          Export
        </button>
        <button
          onClick={onClear}
          className="px-4 py-2 rounded transition duration-300"
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
          Clear
        </button>
      </div>
    </div>
  );
}