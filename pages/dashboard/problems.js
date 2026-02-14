import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { useAuth, useUser } from "@clerk/nextjs";
import { supabaseBrowser } from "@/lib/supabase/client";
import Sidebar from "../../components/dashboard/Sidebar";
import Header from "../../components/dashboard/Header";
import FilterBar from "../../components/dashboard/FilterBar";
import ProblemCard from "../../components/dashboard/ProblemCard";
import ProblemDetailsModal from "../../components/dashboard/ProblemDetailsModal";
import BulkActionsBar from "../../components/dashboard/BulkActionsBar";

const PROBLEMS_PER_PAGE = 50;

export default function ProblemsPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();

  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [selectedProblems, setSelectedProblems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [problemStatus, setProblemStatus] = useState({});
  const [selectedProblem, setSelectedProblem] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination values
  const totalPages = Math.ceil(filteredProblems.length / PROBLEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * PROBLEMS_PER_PAGE;
  const endIndex = startIndex + PROBLEMS_PER_PAGE;
  const currentProblems = filteredProblems.slice(startIndex, endIndex);

  // Extract unique topics from all problems
  const availableTopics = useMemo(() => {
    const topicsSet = new Set();
    problems.forEach((problem) => {
      if (problem.topics && Array.isArray(problem.topics)) {
        problem.topics.forEach((topic) => topicsSet.add(topic));
      }
    });
    return Array.from(topicsSet).sort();
  }, [problems]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredProblems.length]);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    const run = async () => {
      const supabase = supabaseBrowser();
      const { data, error } = await supabase.from("generated_questions").select("*");
      if (error) console.error(error);
      setProblems(data ?? []);
      setFilteredProblems(data ?? []);
    };
    run();
  }, []);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user?.id) return;
    const run = async () => {
      const supabase = supabaseBrowser();
      const { data, error } = await supabase
        .from("favorites")
        .select("problem_id")
        .eq("user_id", user.id);
      if (error) {
        console.error(error);
        return;
      }
      setFavorites((data ?? []).map((row) => row.problem_id));
    };
    run();
  }, [isLoaded, isSignedIn, user?.id]);

  const handleFilterChange = ({ difficulty, topics }) => {
    let filtered = problems;

    if (difficulty) {
      filtered = filtered.filter((p) => p.difficulty === difficulty);
    }

    if (topics.length > 0) {
      filtered = filtered.filter((p) =>
        p.topics && p.topics.some((topic) => topics.includes(topic))
      );
    }

    setFilteredProblems(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleSearch = (searchTerm) => {
    const filtered = problems.filter((p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProblems(filtered);
    setCurrentPage(1); // Reset to first page when searching
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
    const run = async () => {
      const supabase = supabaseBrowser();
      if (favorites.includes(id)) {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("problem_id", id);
        if (error) {
          console.error(error);
          return;
        }
        setFavorites((prev) => prev.filter((f) => f !== id));
      } else {
        const { error } = await supabase
          .from("favorites")
          .insert({ user_id: user.id, problem_id: id });
        if (error) {
          console.error(error);
          return;
        }
        setFavorites((prev) => [...prev, id]);
      }
    };
    run();
  };

  const handleStartQuiz = (problem) => {
    setSelectedProblem(null);
    
    const quizConfig = {
      problemIds: [problem.id],
      timerEnabled: false,
      timerDuration: null,
      sourceName: problem.title,
    };
    localStorage.setItem("quizSessionConfig", JSON.stringify(quizConfig));
    router.push("/dashboard/quiz/session");
  };

  const handleBulkAddToQuizSet = () => {
    const name = prompt("Enter a name for this quiz set:");
    
    if (!name || name.trim() === "") {
      alert("Quiz set name cannot be empty!");
      return;
    }

    const run = async () => {
      const supabase = supabaseBrowser();
      const { error } = await supabase.rpc('insert_quizzes_set', {
        name: name.trim(),
        user_id: user.id,
        set: selectedProblems
      });
      if (error) {
        console.error(error);
        alert("Failed to create quiz set. Please try again.");
        return;
      }
      alert(`${selectedProblems.length} problem(s) added to quiz set "${name.trim()}"!`);
      setSelectedProblems([]);
    };
    run();
  };

  const handleBulkMarkFavorite = () => {
    const run = async () => {
      if (selectedProblems.length === 0) {
        alert("No problems selected!");
        return;
      }

      try {
        const supabase = supabaseBrowser();
        
        const { data: insertedCount, error } = await supabase.rpc('insert_favorites', {
          p_user_id: user.id,
          p_problem_ids: selectedProblems
        });

        if (error) {
          console.error("Error inserting favorites:", error);
          alert("Failed to add favorites. Please try again.");
          return;
        }

        setFavorites((prev) => {
          const newFavorites = selectedProblems.filter((id) => !prev.includes(id));
          return [...prev, ...newFavorites];
        });

        if (insertedCount > 0) {
          alert(`${insertedCount} problem(s) added to favorites!`);
        } else {
          alert("Selected problems are already in favorites!");
        }

        setSelectedProblems([]);
      } catch (err) {
        console.error("Error:", err);
        alert("An error occurred. Please try again.");
      }
    };

    run();
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

  // Pagination handlers
  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToFirstPage = () => goToPage(1);
  const goToLastPage = () => goToPage(totalPages);
  const goToPreviousPage = () => currentPage > 1 && goToPage(currentPage - 1);
  const goToNextPage = () => currentPage < totalPages && goToPage(currentPage + 1);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Calculate start and end of middle section
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if at the beginning
      if (currentPage <= 3) {
        end = 4;
      }
      
      // Adjust if at the end
      if (currentPage >= totalPages - 2) {
        start = totalPages - 3;
      }
      
      // Add ellipsis after first page if needed
      if (start > 2) {
        pages.push('...');
      }
      
      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        pages.push('...');
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
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
              {filteredProblems.length !== problems.length && (
                <span style={{ color: 'rgba(245,231,198,0.6)' }}>
                  {' '}(filtered from {problems.length})
                </span>
              )}
            </p>
          </div>

          {/* Filter Bar */}
          <FilterBar
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
            onSort={handleSort}
            availableTopics={availableTopics}
          />

          {/* Bulk Actions Bar */}
          <BulkActionsBar
            selectedCount={selectedProblems.length}
            onAddToQuizSet={handleBulkAddToQuizSet}
            onMarkFavorite={handleBulkMarkFavorite}
            onExport={handleExport}
            onClear={() => setSelectedProblems([])}
          />

          {/* Page Info */}
          {filteredProblems.length > 0 && (
            <div 
              className="mb-4 p-3 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
              style={{ backgroundColor: '#2A2A2A' }}
            >
              <span className="text-sm" style={{ color: '#F5E7C6' }}>
                Showing {startIndex + 1} - {Math.min(endIndex, filteredProblems.length)} of {filteredProblems.length} problems
              </span>
              <span className="text-sm" style={{ color: 'rgba(245,231,198,0.6)' }}>
                Page {currentPage} of {totalPages}
              </span>
            </div>
          )}

          {/* Problems List */}
          {currentProblems.length > 0 ? (
            <div className="space-y-3 md:space-y-4">
              {currentProblems.map((problem) => (
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
                  setCurrentPage(1);
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

          {/* Pagination Bar */}
          {totalPages > 1 && (
            <div 
              className="mt-6 p-4 rounded-lg border"
              style={{ 
                backgroundColor: '#2A2A2A',
                borderColor: 'rgba(255,255,255,0.08)'
              }}
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Page Info (Mobile) */}
                <div className="sm:hidden text-sm" style={{ color: '#F5E7C6' }}>
                  Page {currentPage} of {totalPages}
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center">
                  {/* First Page */}
                  <button
                    onClick={goToFirstPage}
                    disabled={currentPage === 1}
                    className="px-2 sm:px-3 py-2 rounded-lg transition duration-300 text-sm"
                    style={{ 
                      backgroundColor: currentPage === 1 ? '#222222' : '#303030',
                      color: currentPage === 1 ? 'rgba(245,231,198,0.3)' : '#F5E7C6',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      if (currentPage !== 1) {
                        e.target.style.backgroundColor = '#FA8112';
                        e.target.style.color = '#222222';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentPage !== 1) {
                        e.target.style.backgroundColor = '#303030';
                        e.target.style.color = '#F5E7C6';
                      }
                    }}
                  >
                    ««
                  </button>

                  {/* Previous Page */}
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="px-2 sm:px-3 py-2 rounded-lg transition duration-300 text-sm"
                    style={{ 
                      backgroundColor: currentPage === 1 ? '#222222' : '#303030',
                      color: currentPage === 1 ? 'rgba(245,231,198,0.3)' : '#F5E7C6',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      if (currentPage !== 1) {
                        e.target.style.backgroundColor = '#FA8112';
                        e.target.style.color = '#222222';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentPage !== 1) {
                        e.target.style.backgroundColor = '#303030';
                        e.target.style.color = '#F5E7C6';
                      }
                    }}
                  >
                    ‹ Prev
                  </button>

                  {/* Page Numbers */}
                  <div className="hidden sm:flex items-center gap-1">
                    {getPageNumbers().map((page, index) => (
                      page === '...' ? (
                        <span 
                          key={`ellipsis-${index}`}
                          className="px-2 py-2 text-sm"
                          style={{ color: 'rgba(245,231,198,0.5)' }}
                        >
                          ...
                        </span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className="px-3 py-2 rounded-lg transition duration-300 text-sm font-medium min-w-[40px]"
                          style={{ 
                            backgroundColor: currentPage === page ? '#FA8112' : '#303030',
                            color: currentPage === page ? '#222222' : '#F5E7C6'
                          }}
                          onMouseEnter={(e) => {
                            if (currentPage !== page) {
                              e.target.style.backgroundColor = 'rgba(250,129,18,0.3)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (currentPage !== page) {
                              e.target.style.backgroundColor = '#303030';
                            }
                          }}
                        >
                          {page}
                        </button>
                      )
                    ))}
                  </div>

                  {/* Next Page */}
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="px-2 sm:px-3 py-2 rounded-lg transition duration-300 text-sm"
                    style={{ 
                      backgroundColor: currentPage === totalPages ? '#222222' : '#303030',
                      color: currentPage === totalPages ? 'rgba(245,231,198,0.3)' : '#F5E7C6',
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      if (currentPage !== totalPages) {
                        e.target.style.backgroundColor = '#FA8112';
                        e.target.style.color = '#222222';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentPage !== totalPages) {
                        e.target.style.backgroundColor = '#303030';
                        e.target.style.color = '#F5E7C6';
                      }
                    }}
                  >
                    Next ›
                  </button>

                  {/* Last Page */}
                  <button
                    onClick={goToLastPage}
                    disabled={currentPage === totalPages}
                    className="px-2 sm:px-3 py-2 rounded-lg transition duration-300 text-sm"
                    style={{ 
                      backgroundColor: currentPage === totalPages ? '#222222' : '#303030',
                      color: currentPage === totalPages ? 'rgba(245,231,198,0.3)' : '#F5E7C6',
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      if (currentPage !== totalPages) {
                        e.target.style.backgroundColor = '#FA8112';
                        e.target.style.color = '#222222';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentPage !== totalPages) {
                        e.target.style.backgroundColor = '#303030';
                        e.target.style.color = '#F5E7C6';
                      }
                    }}
                  >
                    »»
                  </button>
                </div>

                {/* Jump to Page */}
                <div className="flex items-center gap-2">
                  <span className="text-sm hidden sm:inline" style={{ color: 'rgba(245,231,198,0.6)' }}>
                    Go to:
                  </span>
                  <input
                    type="number"
                    min={1}
                    max={totalPages}
                    value={currentPage}
                    onChange={(e) => {
                      const page = parseInt(e.target.value);
                      if (page >= 1 && page <= totalPages) {
                        goToPage(page);
                      }
                    }}
                    className="w-16 px-2 py-2 rounded-lg border text-center text-sm"
                    style={{ 
                      backgroundColor: '#303030',
                      color: '#FAF3E1',
                      borderColor: 'rgba(255,255,255,0.08)'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'rgba(250,129,18,0.35)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                  />
                  <span className="text-sm hidden sm:inline" style={{ color: 'rgba(245,231,198,0.6)' }}>
                    of {totalPages}
                  </span>
                </div>
              </div>
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