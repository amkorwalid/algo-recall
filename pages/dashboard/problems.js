import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@clerk/nextjs";
import Sidebar from "../../components/dashboard/Sidebar";
import Header from "../../components/dashboard/Header";
import FilterBar from "../../components/dashboard/FilterBar";
import ProblemCard from "../../components/dashboard/ProblemCard";
import ProblemDetailsModal from "../../components/dashboard/ProblemDetailsModal";
import BulkActionsBar from "../../components/dashboard/BulkActionsBar";

export default function ProblemsPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();

  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [selectedProblems, setSelectedProblems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [problemStatus, setProblemStatus] = useState({});
  const [selectedProblem, setSelectedProblem] = useState(null);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    // Load problems from JSON
    fetch("/data.json")
      .then((res) => res.json())
      .then((data) => {
        setProblems(data.problems);
        setFilteredProblems(data.problems);
        
        // Load user data from localStorage
        const savedStatus = JSON.parse(localStorage.getItem("problemStatus") || "{}");
        const savedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
        setProblemStatus(savedStatus);
        setFavorites(savedFavorites);
      });
  }, []);

  const handleFilterChange = ({ difficulty, topics }) => {
    let filtered = problems;

    if (difficulty) {
      filtered = filtered.filter((p) => p.difficulty === difficulty);
    }

    if (topics.length > 0) {
      filtered = filtered.filter((p) =>
        p.topics.some((topic) => topics.includes(topic))
      );
    }

    setFilteredProblems(filtered);
  };

  const handleSearch = (searchTerm) => {
    const filtered = problems.filter((p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProblems(filtered);
  };

  const handleSort = (sortBy) => {
    let sorted = [...filteredProblems];

    if (sortBy === "difficulty") {
      const order = { easy: 1, medium: 2, hard: 3 };
      sorted.sort((a, b) => order[a.difficulty] - order[b.difficulty]);
    } else if (sortBy === "title") {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    }

    setFilteredProblems(sorted);
  };

  const handleSelectProblem = (id) => {
    setSelectedProblems((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleToggleFavorite = (id) => {
    const updated = favorites.includes(id)
      ? favorites.filter((f) => f !== id)
      : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const handleStartQuiz = (problem) => {
    setSelectedProblem(null);
    router.push({
      pathname: "/dashboard/quiz",
      query: { problemId: problem.id },
    });
  };

  const handleBulkAddToQuizSet = () => {
    const quizSet = JSON.parse(localStorage.getItem("customQuizSet") || "[]");
    const updated = [...new Set([...quizSet, ...selectedProblems])];
    localStorage.setItem("customQuizSet", JSON.stringify(updated));
    alert(`${selectedProblems.length} problem(s) added to quiz set!`);
    setSelectedProblems([]);
  };

  const handleBulkMarkFavorite = () => {
    const updated = [...new Set([...favorites, ...selectedProblems])];
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
    alert(`${selectedProblems.length} problem(s) marked as favorite!`);
    setSelectedProblems([]);
  };

  const handleExport = () => {
    const exportData = problems.filter((p) => selectedProblems.includes(p.id));
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    const link = document.createElement("a");
    link.setAttribute("href", dataUri);
    link.setAttribute("download", "selected_problems.json");
    link.click();
    setSelectedProblems([]);
  };

  if (!isLoaded) {
    return (
      <div 
        className="flex items-center justify-center min-h-screen"
        style={{ backgroundColor: '#222222' }}
      >
        <div style={{ color: '#FAF3E1' }}>Loading...</div>
      </div>
    );
  }

  return isSignedIn ? (
    <div className="flex min-h-screen" style={{ backgroundColor: '#222222' }}>
      <Sidebar />
      <div className="flex-grow">
        <Header />
        <div className="container mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold mb-6" style={{ color: '#FAF3E1' }}>
            Problem Set
          </h1>

          <FilterBar
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
            onSort={handleSort}
          />

          <BulkActionsBar
            selectedCount={selectedProblems.length}
            onAddToQuizSet={handleBulkAddToQuizSet}
            onMarkFavorite={handleBulkMarkFavorite}
            onExport={handleExport}
            onClear={() => setSelectedProblems([])}
          />

          {filteredProblems.length > 0 ? (
            <div className="space-y-4">
              {filteredProblems.map((problem) => (
                <ProblemCard
                  key={problem.id}
                  problem={problem}
                  status={problemStatus[problem.id] || "not_attempted"}
                  isSelected={selectedProblems.includes(problem.id)}
                  onSelect={handleSelectProblem}
                  isFavorite={favorites.includes(problem.id)}
                  onToggleFavorite={handleToggleFavorite}
                  onViewDetails={setSelectedProblem}
                />
              ))}
            </div>
          ) : (
            <div 
              className="text-center py-12 rounded-lg border"
              style={{ 
                backgroundColor: '#2A2A2A',
                borderColor: 'rgba(255,255,255,0.08)',
                color: 'rgba(245,231,198,0.6)'
              }}
            >
              <p className="text-xl">No problems found matching your filters.</p>
              <p className="mt-2">Try adjusting your search criteria.</p>
            </div>
          )}
        </div>
      </div>

      {selectedProblem && (
        <ProblemDetailsModal
          problem={selectedProblem}
          onClose={() => setSelectedProblem(null)}
          onStartQuiz={handleStartQuiz}
        />
      )}
    </div>
  ) : null;
}