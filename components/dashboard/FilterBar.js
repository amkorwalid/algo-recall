import { useState, useRef, useEffect } from 'react';

export default function FilterBar({ onFilterChange, onSearch, onSort, availableTopics = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showTopicsDropdown, setShowTopicsDropdown] = useState(false);
  
  const dropdownRef = useRef(null);

  const difficulties = ['easy', 'medium', 'hard'];
  const topics = availableTopics.length > 0 ? availableTopics : [];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowTopicsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTopicToggle = (topic) => {
    const updated = selectedTopics.includes(topic)
      ? selectedTopics.filter((t) => t !== topic)
      : [...selectedTopics, topic];
    setSelectedTopics(updated);
    onFilterChange({ difficulty: selectedDifficulty, topics: updated });
  };

  const handleSelectAllTopics = () => {
    if (selectedTopics.length === topics.length) {
      setSelectedTopics([]);
      onFilterChange({ difficulty: selectedDifficulty, topics: [] });
    } else {
      setSelectedTopics([...topics]);
      onFilterChange({ difficulty: selectedDifficulty, topics: [...topics] });
    }
  };

  const handleClearTopics = () => {
    setSelectedTopics([]);
    onFilterChange({ difficulty: selectedDifficulty, topics: [] });
  };

  const handleDifficultyChange = (difficulty) => {
    setSelectedDifficulty(difficulty);
    onFilterChange({ difficulty, topics: selectedTopics });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  const handleSort = (e) => {
    setSortBy(e.target.value);
    onSort(e.target.value);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedDifficulty('');
    setSelectedTopics([]);
    setSortBy('');
    onFilterChange({ difficulty: '', topics: [] });
    onSearch('');
    onSort('');
  };

  const activeFiltersCount = 
    (selectedDifficulty ? 1 : 0) + 
    selectedTopics.length + 
    (sortBy ? 1 : 0);

  // Format topic for display (replace underscores with spaces, capitalize)
  const formatTopic = (topic) => {
    return topic
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Get display text for topics dropdown
  const getTopicsDisplayText = () => {
    if (selectedTopics.length === 0) {
      return 'Select topics...';
    } else if (selectedTopics.length === 1) {
      return formatTopic(selectedTopics[0]);
    } else if (selectedTopics.length === topics.length) {
      return 'All topics selected';
    } else {
      return `${selectedTopics.length} topics selected`;
    }
  };

  return (
    <div 
      className="p-4 rounded-lg border mb-4 md:mb-6"
      style={{ 
        backgroundColor: '#2A2A2A',
        borderColor: 'rgba(255,255,255,0.08)'
      }}
    >
      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search problems by title..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full px-4 py-2 md:py-3 rounded border focus:outline-none transition duration-300 text-sm md:text-base"
          style={{ 
            backgroundColor: '#303030',
            color: '#FAF3E1',
            borderColor: 'rgba(255,255,255,0.08)'
          }}
          onFocus={(e) => e.target.style.borderColor = 'rgba(250,129,18,0.35)'}
          onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
        />
      </div>

      {/* Toggle Filters Button (Mobile) */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="w-full md:hidden flex items-center justify-between px-4 py-2 rounded-lg mb-3 transition duration-300"
        style={{ backgroundColor: '#303030', color: '#F5E7C6' }}
      >
        <span className="flex items-center space-x-2">
          <span>🔧 Filters & Sort</span>
          {activeFiltersCount > 0 && (
            <span 
              className="px-2 py-1 rounded-full text-xs font-semibold"
              style={{ backgroundColor: '#FA8112', color: '#222222' }}
            >
              {activeFiltersCount}
            </span>
          )}
        </span>
        <span>{showFilters ? '▲' : '▼'}</span>
      </button>

      {/* Filters Row */}
      <div className={`${showFilters ? 'block' : 'hidden'} md:block`}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Difficulty Filter */}
          <div>
            <label className="block text-xs md:text-sm mb-2" style={{ color: '#F5E7C6' }}>
              Difficulty
            </label>
            <select
              value={selectedDifficulty}
              onChange={(e) => handleDifficultyChange(e.target.value)}
              className="w-full px-3 md:px-4 py-2 rounded border focus:outline-none transition duration-300 text-sm md:text-base"
              style={{ 
                backgroundColor: '#303030',
                color: '#FAF3E1',
                borderColor: 'rgba(255,255,255,0.08)'
              }}
              onFocus={(e) => e.target.style.borderColor = 'rgba(250,129,18,0.35)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
            >
              <option value="">All</option>
              {difficulties.map((d) => (
                <option key={d} value={d}>
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Topics Multi-Select Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <label className="block text-xs md:text-sm mb-2" style={{ color: '#F5E7C6' }}>
              Topics {selectedTopics.length > 0 && `(${selectedTopics.length})`}
            </label>
            <button
              type="button"
              onClick={() => setShowTopicsDropdown(!showTopicsDropdown)}
              className="w-full px-3 md:px-4 py-2 rounded border focus:outline-none transition duration-300 text-sm md:text-base text-left flex items-center justify-between"
              style={{ 
                backgroundColor: '#303030',
                color: selectedTopics.length > 0 ? '#FAF3E1' : 'rgba(245,231,198,0.6)',
                borderColor: showTopicsDropdown ? 'rgba(250,129,18,0.35)' : 'rgba(255,255,255,0.08)'
              }}
            >
              <span className="truncate">{getTopicsDisplayText()}</span>
              <span 
                className="ml-2 transition-transform duration-200"
                style={{ transform: showTopicsDropdown ? 'rotate(180deg)' : 'rotate(0deg)' }}
              >
                ▼
              </span>
            </button>

            {/* Dropdown Menu */}
            {showTopicsDropdown && (
              <div 
                className="absolute z-50 w-full mt-1 rounded-lg border shadow-lg"
                style={{ 
                  backgroundColor: '#303030',
                  borderColor: 'rgba(250,129,18,0.35)'
                }}
              >
                {/* Select All / Clear */}
                <div 
                  className="px-3 py-2 border-b flex justify-between items-center"
                  style={{ borderColor: 'rgba(255,255,255,0.08)' }}
                >
                  <button
                    type="button"
                    onClick={handleSelectAllTopics}
                    className="text-xs font-medium transition duration-200 hover:opacity-80"
                    style={{ color: '#FA8112' }}
                  >
                    {selectedTopics.length === topics.length ? 'Deselect All' : 'Select All'}
                  </button>
                  {selectedTopics.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearTopics}
                      className="text-xs font-medium transition duration-200 hover:opacity-80"
                      style={{ color: '#ef4444' }}
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Scrollable Options - Shows 5 items */}
                <div 
                  className="overflow-y-auto"
                  style={{ maxHeight: '200px' }} // ~5 items at 40px each
                >
                  {topics.length > 0 ? (
                    topics.map((topic) => (
                      <label
                        key={topic}
                        className="flex items-center px-3 py-2 cursor-pointer transition duration-200"
                        style={{ 
                          backgroundColor: selectedTopics.includes(topic) 
                            ? 'rgba(250,129,18,0.15)' 
                            : 'transparent'
                        }}
                        onMouseEnter={(e) => {
                          if (!selectedTopics.includes(topic)) {
                            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!selectedTopics.includes(topic)) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedTopics.includes(topic)}
                          onChange={() => handleTopicToggle(topic)}
                          className="sr-only"
                        />
                        <span 
                          className="w-4 h-4 rounded border flex items-center justify-center mr-3 flex-shrink-0"
                          style={{ 
                            backgroundColor: selectedTopics.includes(topic) ? '#FA8112' : 'transparent',
                            borderColor: selectedTopics.includes(topic) ? '#FA8112' : 'rgba(255,255,255,0.3)'
                          }}
                        >
                          {selectedTopics.includes(topic) && (
                            <svg 
                              className="w-3 h-3" 
                              fill="none" 
                              stroke="#222222" 
                              viewBox="0 0 24 24"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={3} 
                                d="M5 13l4 4L19 7" 
                              />
                            </svg>
                          )}
                        </span>
                        <span 
                          className="text-sm truncate"
                          style={{ color: '#FAF3E1' }}
                        >
                          {formatTopic(topic)}
                        </span>
                      </label>
                    ))
                  ) : (
                    <div className="px-3 py-4 text-center">
                      <span className="text-sm" style={{ color: 'rgba(245,231,198,0.4)' }}>
                        No topics available
                      </span>
                    </div>
                  )}
                </div>

                {/* Selected Count Footer */}
                {topics.length > 0 && (
                  <div 
                    className="px-3 py-2 border-t text-xs"
                    style={{ 
                      borderColor: 'rgba(255,255,255,0.08)',
                      color: 'rgba(245,231,198,0.6)'
                    }}
                  >
                    {selectedTopics.length} of {topics.length} selected
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sort */}
          <div>
            <label className="block text-xs md:text-sm mb-2" style={{ color: '#F5E7C6' }}>
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={handleSort}
              className="w-full px-3 md:px-4 py-2 rounded border focus:outline-none transition duration-300 text-sm md:text-base"
              style={{ 
                backgroundColor: '#303030',
                color: '#FAF3E1',
                borderColor: 'rgba(255,255,255,0.08)'
              }}
              onFocus={(e) => e.target.style.borderColor = 'rgba(250,129,18,0.35)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
            >
              <option value="">Default</option>
              <option value="difficulty">Difficulty</option>
              <option value="title">Title</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          <div className="flex items-end">
            <button
              onClick={clearAllFilters}
              disabled={activeFiltersCount === 0}
              className="w-full px-4 py-2 rounded-lg transition duration-300 text-sm md:text-base"
              style={{ 
                backgroundColor: activeFiltersCount > 0 ? '#303030' : '#2A2A2A',
                color: activeFiltersCount > 0 ? '#F5E7C6' : 'rgba(245,231,198,0.4)',
                cursor: activeFiltersCount > 0 ? 'pointer' : 'not-allowed'
              }}
              onMouseEnter={(e) => {
                if (activeFiltersCount > 0) {
                  e.target.style.backgroundColor = '#ef4444';
                  e.target.style.color = '#ffffff';
                }
              }}
              onMouseLeave={(e) => {
                if (activeFiltersCount > 0) {
                  e.target.style.backgroundColor = '#303030';
                  e.target.style.color = '#F5E7C6';
                }
              }}
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Selected Topics Tags (shown below filters) */}
        {selectedTopics.length > 0 && (
          <div className="mt-4">
            <label className="block text-xs md:text-sm mb-2" style={{ color: '#F5E7C6' }}>
              Active Topic Filters:
            </label>
            <div className="flex flex-wrap gap-2">
              {selectedTopics.map((topic) => (
                <span
                  key={topic}
                  className="inline-flex items-center px-2 py-1 rounded text-xs md:text-sm"
                  style={{ backgroundColor: '#FA8112', color: '#222222' }}
                >
                  {formatTopic(topic)}
                  <button
                    type="button"
                    onClick={() => handleTopicToggle(topic)}
                    className="ml-1 hover:opacity-70 transition duration-200"
                  >
                    ✕
                  </button>
                </span>
              ))}
              {selectedTopics.length > 1 && (
                <button
                  type="button"
                  onClick={handleClearTopics}
                  className="px-2 py-1 rounded text-xs md:text-sm transition duration-200"
                  style={{ 
                    backgroundColor: '#303030', 
                    color: '#ef4444',
                    border: '1px solid rgba(239,68,68,0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#ef4444';
                    e.target.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#303030';
                    e.target.style.color = '#ef4444';
                  }}
                >
                  Clear All Topics
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}