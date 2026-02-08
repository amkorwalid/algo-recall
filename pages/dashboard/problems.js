import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@clerk/nextjs";
import { supabaseBrowser } from "@/lib/supabase/client";
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
    const run = async () => {
      const supabase = supabaseBrowser();
      const { data, error } = await supabase.from("genai_problems").select("*");
      if (error) console.error(error);
      setProblems(data ?? []);
      setFilteredProblems(data ?? []);
    };
    run();
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
      <div className="grow w-full md:w-auto relative">
        <Header />
        <div className="container mx-auto px-4 md:px-6 py-6 md:py-8 pt-20 md:pt-8">
          {/* Header Section */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold" style={{ color: '#FAF3E1' }}>
              Problem Set 📚
            </h1>
            <p className="mt-2 text-sm md:text-base" style={{ color: '#F5E7C6' }}>
              {filteredProblems.length} problem{filteredProblems.length !== 1 ? 's' : ''} available
            </p>
          </div>

          {/* Filter Bar */}
          <FilterBar
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
            onSort={handleSort}
          />

          {/* Bulk Actions Bar */}
          <BulkActionsBar
            selectedCount={selectedProblems.length}
            onAddToQuizSet={handleBulkAddToQuizSet}
            onMarkFavorite={handleBulkMarkFavorite}
            onExport={handleExport}
            onClear={() => setSelectedProblems([])}
          />

          {/* Problems List */}
          {filteredProblems.length > 0 ? (
            <div className="space-y-3 md:space-y-4">
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
              className="text-center py-12 md:py-16 rounded-lg border"
              style={{ 
                backgroundColor: '#2A2A2A',
                borderColor: 'rgba(255,255,255,0.08)',
                color: 'rgba(245,231,198,0.6)'
              }}
            >
              <div className="text-4xl md:text-6xl mb-4">🔍</div>
              <p className="text-lg md:text-xl font-semibold" style={{ color: '#FAF3E1' }}>
                No problems found
              </p>
              <p className="mt-2 text-sm md:text-base px-4">
                Try adjusting your search criteria or filters.
              </p>
              <button
                onClick={() => {
                  setFilteredProblems(problems);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="mt-6 px-6 py-2 rounded-lg transition duration-300"
                style={{ backgroundColor: '#FA8112', color: '#222222' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#E9720F'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#FA8112'}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Problem Details Modal */}
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