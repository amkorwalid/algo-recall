import { useState } from 'react';

export default function FilterBar({ onFilterChange, onSearch, onSort }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const difficulties = ['easy', 'medium', 'hard'];
  const topics = ['sliding_window', 'hash_map', 'two_pointers', 'heap', 'linked_list', 'sorting', 'dp'];

  const handleTopicToggle = (topic) => {
    const updated = selectedTopics.includes(topic)
      ? selectedTopics.filter((t) => t !== topic)
      : [...selectedTopics, topic];
    setSelectedTopics(updated);
    onFilterChange({ difficulty: selectedDifficulty, topics: updated });
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

        {/* Topics Filter */}
        <div className="mt-4">
          <label className="block text-xs md:text-sm mb-2" style={{ color: '#F5E7C6' }}>
            Topics
          </label>
          <div className="flex flex-wrap gap-2">
            {topics.map((topic) => (
              <button
                key={topic}
                onClick={() => handleTopicToggle(topic)}
                className="px-2 md:px-3 py-1 rounded text-xs md:text-sm transition duration-300"
                style={
                  selectedTopics.includes(topic)
                    ? { backgroundColor: '#FA8112', color: '#222222' }
                    : { backgroundColor: '#303030', color: '#F5E7C6', borderColor: 'rgba(255,255,255,0.08)', border: '1px solid' }
                }
                onMouseEnter={(e) => {
                  if (!selectedTopics.includes(topic)) {
                    e.target.style.borderColor = 'rgba(250,129,18,0.35)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!selectedTopics.includes(topic)) {
                    e.target.style.borderColor = 'rgba(255,255,255,0.08)';
                  }
                }}
              >
                {topic.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}