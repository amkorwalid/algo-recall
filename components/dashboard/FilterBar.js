import { useState } from 'react';

export default function FilterBar({ onFilterChange, onSearch, onSort }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [sortBy, setSortBy] = useState('');

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

  return (
    <div 
      className="p-4 rounded-lg border mb-6"
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
          className="w-full px-4 py-2 rounded border focus:outline-none transition duration-300"
          style={{ 
            backgroundColor: '#303030',
            color: '#FAF3E1',
            borderColor: 'rgba(255,255,255,0.08)'
          }}
          onFocus={(e) => e.target.style.borderColor = 'rgba(250,129,18,0.35)'}
          onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
        />
      </div>

      {/* Filters Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Difficulty Filter */}
        <div>
          <label className="block text-sm mb-2" style={{ color: '#F5E7C6' }}>Difficulty</label>
          <select
            value={selectedDifficulty}
            onChange={(e) => handleDifficultyChange(e.target.value)}
            className="w-full px-4 py-2 rounded border focus:outline-none transition duration-300"
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
          <label className="block text-sm mb-2" style={{ color: '#F5E7C6' }}>Sort By</label>
          <select
            value={sortBy}
            onChange={handleSort}
            className="w-full px-4 py-2 rounded border focus:outline-none transition duration-300"
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

        {/* Topics Filter */}
        <div>
          <label className="block text-sm mb-2" style={{ color: '#F5E7C6' }}>Topics</label>
          <div className="flex flex-wrap gap-2">
            {topics.map((topic) => (
              <button
                key={topic}
                onClick={() => handleTopicToggle(topic)}
                className="px-3 py-1 rounded text-sm transition duration-300"
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