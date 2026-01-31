import { useState, useEffect, useMemo } from "react";
import Header from "../../components/dashboard/Header";
import Sidebar from "../../components/dashboard/Sidebar";
import ProblemTable from "../../components/dashboard/ProblemTable";

export default function ProblemsSetPage() {
  const [problems, setProblems] = useState([]);
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [selectedTopics, setSelectedTopics] = useState([]);

  useEffect(() => {
    // Fetch data from the JSON file
    fetch("/data.json")
      .then((res) => res.json())
      .then((data) => {
        setProblems(data.problems);
      });
  }, []);

  const filteredProblems = useMemo(() => {
    let filtered = problems;

    if (difficultyFilter) {
      filtered = filtered.filter(
        (problem) => problem.difficulty === difficultyFilter
      );
    }

    if (selectedTopics.length > 0) {
      filtered = filtered.filter((problem) =>
        problem.topics.some((topic) => selectedTopics.includes(topic))
      );
    }

    return filtered;
  }, [difficultyFilter, selectedTopics, problems]);

  const toggleTopic = (topic) => {
    setSelectedTopics((prev) =>
      prev.includes(topic)
        ? prev.filter((t) => t !== topic)
        : [...prev, topic]
    );
  };

  const handleQuickView = (problem) => {
    alert(
      `Quick View:
- Summary: ${problem.summary}
- Insights: ${problem.insights}
- Traps: ${problem.traps}`
    );
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="grow">
        <Header />
        <div className="container mx-auto px-6">
          <h1 className="text-2xl font-bold mt-6">Problems Set</h1>
          <div className="flex items-center mt-4 space-x-4">
            {/* Difficulty Filter */}
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="border px-4 py-2 rounded"
            >
              <option value="">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            {/* Topics Filter */}
            <div className="flex items-center space-x-2">
              {["array", "hash_map", "dynamic_programming"].map((topic) => (
                <label key={topic} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedTopics.includes(topic)}
                    onChange={() => toggleTopic(topic)}
                    className="mr-2"
                  />
                  {topic}
                </label>
              ))}
            </div>
          </div>

          {/* Problems Table */}
          <div className="mt-6">
            <ProblemTable
              problems={filteredProblems}
              onQuickView={handleQuickView}
            />
          </div>
        </div>
      </div>
    </div>
  );
}