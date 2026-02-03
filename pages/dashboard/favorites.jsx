import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@clerk/nextjs";
import Sidebar from "../../components/dashboard/Sidebar";
import Header from "../../components/dashboard/Header";
import ProblemCard from "../../components/dashboard/ProblemCard";
import ProblemDetailsModal from "../../components/dashboard/ProblemDetailsModal";

export default function FavoritesPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();

  const [problems, setProblems] = useState([]);
  const [favoriteProblems, setFavoriteProblems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [problemStatus, setProblemStatus] = useState({});
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [selectedProblems, setSelectedProblems] = useState([]);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((data) => {
        setProblems(data.problems);
        
        const savedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
        const savedStatus = JSON.parse(localStorage.getItem("problemStatus") || "{}");
        
        setFavorites(savedFavorites);
        setProblemStatus(savedStatus);
        
        const favProblems = data.problems.filter((p) => savedFavorites.includes(p.id));
        setFavoriteProblems(favProblems);
      });
  }, []);

  const handleToggleFavorite = (id) => {
    const updated = favorites.filter((f) => f !== id);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
    
    const favProblems = problems.filter((p) => updated.includes(p.id));
    setFavoriteProblems(favProblems);
  };

  const handleSelectProblem = (id) => {
    setSelectedProblems((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleStartQuiz = (problem) => {
    setSelectedProblem(null);
    router.push({
      pathname: "/dashboard/quiz",
      query: { problemId: problem.id },
    });
  };

  const handleRemoveAll = () => {
    if (window.confirm("Are you sure you want to remove all favorites?")) {
      setFavorites([]);
      setFavoriteProblems([]);
      localStorage.setItem("favorites", JSON.stringify([]));
    }
  };

  const handleStartFavoritesQuiz = () => {
    if (favorites.length === 0) {
      alert("No favorite problems to quiz!");
      return;
    }
    
    localStorage.setItem("customQuizSet", JSON.stringify(favorites));
    router.push("/dashboard/quiz?mode=custom");
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
      <div className="flex-grow w-full md:w-auto overflow-x-hidden">
        <Header />
        <div className="container mx-auto px-4 md:px-6 py-6 md:py-8 pt-20 md:pt-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold" style={{ color: '#FAF3E1' }}>
                Favorite Problems ⭐
              </h1>
              <p className="mt-2 text-sm md:text-base" style={{ color: '#F5E7C6' }}>
                {favoriteProblems.length} problem{favoriteProblems.length !== 1 ? 's' : ''} marked as favorite
              </p>
            </div>
            
            {favoriteProblems.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-2 md:gap-3 w-full sm:w-auto">
                <button
                  onClick={handleStartFavoritesQuiz}
                  className="px-4 md:px-6 py-2 rounded-lg font-medium transition duration-300 text-sm md:text-base whitespace-nowrap"
                  style={{ backgroundColor: '#FA8112', color: '#222222' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#E9720F'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#FA8112'}
                >
                  Quiz All Favorites
                </button>
                <button
                  onClick={handleRemoveAll}
                  className="px-4 md:px-6 py-2 rounded-lg transition duration-300 text-sm md:text-base whitespace-nowrap"
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
                  Remove All
                </button>
              </div>
            )}
          </div>

          {/* Statistics Cards */}
          {favoriteProblems.length > 0 && (
            <div className="grid grid-cols-3 gap-3 md:gap-6 mb-6">
              <div 
                className="p-3 md:p-4 rounded-lg border"
                style={{ 
                  backgroundColor: '#2A2A2A',
                  borderColor: 'rgba(255,255,255,0.08)'
                }}
              >
                <div className="text-xs md:text-sm" style={{ color: 'rgba(245,231,198,0.6)' }}>Easy</div>
                <div className="text-xl md:text-2xl font-bold" style={{ color: '#22c55e' }}>
                  {favoriteProblems.filter(p => p.difficulty === 'easy').length}
                </div>
              </div>

              <div 
                className="p-3 md:p-4 rounded-lg border"
                style={{ 
                  backgroundColor: '#2A2A2A',
                  borderColor: 'rgba(255,255,255,0.08)'
                }}
              >
                <div className="text-xs md:text-sm" style={{ color: 'rgba(245,231,198,0.6)' }}>Medium</div>
                <div className="text-xl md:text-2xl font-bold" style={{ color: '#eab308' }}>
                  {favoriteProblems.filter(p => p.difficulty === 'medium').length}
                </div>
              </div>

              <div 
                className="p-3 md:p-4 rounded-lg border"
                style={{ 
                  backgroundColor: '#2A2A2A',
                  borderColor: 'rgba(255,255,255,0.08)'
                }}
              >
                <div className="text-xs md:text-sm" style={{ color: 'rgba(245,231,198,0.6)' }}>Hard</div>
                <div className="text-xl md:text-2xl font-bold" style={{ color: '#ef4444' }}>
                  {favoriteProblems.filter(p => p.difficulty === 'hard').length}
                </div>
              </div>
            </div>
          )}

          {/* Favorites List */}
          {favoriteProblems.length > 0 ? (
            <div className="space-y-3 md:space-y-4">
              {favoriteProblems.map((problem) => (
                <ProblemCard
                  key={problem.id}
                  problem={problem}
                  status={problemStatus[problem.id] || "not_attempted"}
                  isSelected={selectedProblems.includes(problem.id)}
                  onSelect={handleSelectProblem}
                  isFavorite={true}
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
                borderColor: 'rgba(255,255,255,0.08)'
              }}
            >
              <div className="text-5xl md:text-6xl mb-4">⭐</div>
              <h2 className="text-xl md:text-2xl font-bold mb-2 px-4" style={{ color: '#FAF3E1' }}>
                No Favorite Problems Yet
              </h2>
              <p className="mb-6 text-sm md:text-base px-4" style={{ color: 'rgba(245,231,198,0.6)' }}>
                Start marking problems as favorites to build your custom study list!
              </p>
              <button
                onClick={() => router.push("/dashboard/problems")}
                className="px-6 py-3 rounded-lg font-medium transition duration-300 text-sm md:text-base"
                style={{ backgroundColor: '#FA8112', color: '#222222' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#E9720F'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#FA8112'}
              >
                Browse Problems
              </button>
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