export default function Modal({ children, onClose }) {
  return (
    <div 
      className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <div 
        className="rounded-lg shadow-lg p-4 md:p-6 w-full max-w-md"
        style={{ backgroundColor: '#303030' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg md:text-xl font-semibold" style={{ color: '#FAF3E1' }}>
            Feedback
          </h2>
          <button
            onClick={onClose}
            className="text-xl md:text-2xl font-bold transition duration-300"
            style={{ color: 'rgba(245,231,198,0.6)' }}
            onMouseEnter={(e) => e.target.style.color = '#FAF3E1'}
            onMouseLeave={(e) => e.target.style.color = 'rgba(245,231,198,0.6)'}
          >
            ×
          </button>
        </div>
        <div className="text-sm md:text-base" style={{ color: '#F5E7C6' }}>
          {children}
        </div>
        <div className="mt-4 text-right">
          <button
            onClick={onClose}
            className="px-4 md:px-6 py-2 rounded-lg transition duration-300 text-sm md:text-base"
            style={{ backgroundColor: '#FA8112', color: '#222222' }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#E9720F'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#FA8112'}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}