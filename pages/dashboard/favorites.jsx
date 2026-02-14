import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth, useUser } from "@clerk/nextjs";
import { supabaseBrowser } from "@/lib/supabase/client";
import Sidebar from "../../components/dashboard/Sidebar";
import Header from "../../components/dashboard/Header";
import ProblemCard from "../../components/dashboard/ProblemCard";
import ProblemDetailsModal from "../../components/dashboard/ProblemDetailsModal";

export default function FavoritesPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();

  const [favoriteProblems, setFavoriteProblems] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [problemStatus, setProblemStatus] = useState({});
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [selectedProblems, setSelectedProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  // Fetch favorites from Supabase
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isLoaded || !isSignedIn || !user?.id) {
        console.log("Waiting for auth:", { isLoaded, isSignedIn, userId: user?.id });
        return;
      }

      setLoading(true);
      setError(null);
      const supabase = supabaseBrowser();

      try {
        console.log("Fetching favorites for user:", user.id);

        // Fetch favorite problem IDs for the user
        const { data: favoritesData, error: favoritesError } = await supabase
          .from("favorites")
          .select("problem_id")
          .eq("user_id", user.id);

        console.log("Favorites query result:", { favoritesData, favoritesError });

        if (favoritesError) {
          console.error("Error fetching favorites:", favoritesError);
          setError("Failed to load favorites");
          setLoading(false);
          return;
        }

        if (!favoritesData || favoritesData.length === 0) {
          console.log("No favorites found for user");
          setFavoriteIds([]);
          setFavoriteProblems([]);
          setLoading(false);
          return;
        }

        const favoriteIdsList = favoritesData.map((row) => row.problem_id);
        console.log("Favorite IDs:", favoriteIdsList);
        setFavoriteIds(favoriteIdsList);

        // Fetch the actual problem data
        const { data: problemsData, error: problemsError } = await supabase
          .from("generated_questions")
          .select("*")
          .in("id", favoriteIdsList);

        console.log("Problems query result:", { problemsData, problemsError });

        if (problemsError) {
          console.error("Error fetching problems:", problemsError);
          setError("Failed to load problem details");
          setLoading(false);
          return;
        }

        if (!problemsData || problemsData.length === 0) {
          console.log("No problems found matching favorite IDs");
          setFavoriteProblems([]);
          setLoading(false);
          return;
        }

        // Order problems by favorite order - handle type mismatch
        const orderedProblems = favoriteIdsList
          .map((id) => problemsData.find((p) => 
            p.id === id || 
            String(p.id) === String(id) || 
            Number(p.id) === Number(id)
          ))
          .filter(Boolean);

        console.log("Ordered problems:", orderedProblems);
        setFavoriteProblems(orderedProblems);

        // Load problem status from localStorage
        const savedStatus = JSON.parse(localStorage.getItem("problemStatus") || "{}");
        setProblemStatus(savedStatus);
      } catch (err) {
        console.error("Error in fetchFavorites:", err);
        setError("An error occurred while loading favorites");
      }

      setLoading(false);
    };

    fetchFavorites();
  }, [isLoaded, isSignedIn, user?.id]);

  // Remove a single favorite
  const handleToggleFavorite = async (id) => {
    if (!user?.id) return;

    const supabase = supabaseBrowser();
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("problem_id", id);

    if (error) {
      console.error("Error removing favorite:", error);
      alert("Failed to remove favorite. Please try again.");
      return;
    }

    // Update local state
    setFavoriteIds((prev) => prev.filter((f) => f !== id));
    setFavoriteProblems((prev) => prev.filter((p) => p.id !== id));
    setSelectedProblems((prev) => prev.filter((p) => p !== id));
  };

  // Select/deselect problems for bulk actions
  const handleSelectProblem = (id) => {
    setSelectedProblems((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  // Start quiz with a single problem
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

  // Remove all favorites
  const handleRemoveAll = async () => {
    if (!user?.id) return;
    if (!window.confirm("Are you sure you want to remove all favorites?")) return;

    const supabase = supabaseBrowser();
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", user.id);

    if (error) {
      console.error("Error removing all favorites:", error);
      alert("Failed to remove favorites. Please try again.");
      return;
    }

    setFavoriteIds([]);
    setFavoriteProblems([]);
    setSelectedProblems([]);
  };

  // Remove selected favorites
  const handleRemoveSelected = async () => {
    if (!user?.id || selectedProblems.length === 0) return;
    if (!window.confirm(`Are you sure you want to remove ${selectedProblems.length} favorite(s)?`)) return;

    const supabase = supabaseBrowser();
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", user.id)
      .in("problem_id", selectedProblems);

    if (error) {
      console.error("Error removing selected favorites:", error);
      alert("Failed to remove favorites. Please try again.");
      return;
    }

    setFavoriteIds((prev) => prev.filter((id) => !selectedProblems.includes(id)));
    setFavoriteProblems((prev) => prev.filter((p) => !selectedProblems.includes(p.id)));
    setSelectedProblems([]);
  };

  // Start quiz with all favorites
  const handleStartFavoritesQuiz = () => {
    if (favoriteIds.length === 0) {
      alert("No favorite problems to quiz!");
      return;
    }

    const quizConfig = {
      problemIds: favoriteIds,
      timerEnabled: false,
      timerDuration: null,
      sourceName: "Favorites",
    };
    localStorage.setItem("quizSessionConfig", JSON.stringify(quizConfig));
    router.push("/dashboard/quiz/session");
  };

  // Start quiz with selected favorites
  const handleStartSelectedQuiz = () => {
    if (selectedProblems.length === 0) {
      alert("No problems selected!");
      return;
    }

    const quizConfig = {
      problemIds: selectedProblems,
      timerEnabled: false,
      timerDuration: null,
      sourceName: `${selectedProblems.length} Selected Favorites`,
    };
    localStorage.setItem("quizSessionConfig", JSON.stringify(quizConfig));
    router.push("/dashboard/quiz/session");
  };

  // Configure quiz with favorites (go to quiz config page)
  const handleConfigureFavoritesQuiz = () => {
    if (favoriteIds.length === 0) {
      alert("No favorite problems to quiz!");
      return;
    }

    localStorage.setItem("preSelectedSource", "favorites");
    router.push("/dashboard/quiz");
  };

  if (!isLoaded || loading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ backgroundColor: "#222222" }}
      >
        <div style={{ color: "#FAF3E1" }}>Loading...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-screen" style={{ backgroundColor: "#222222" }}>
        <Sidebar />
        <div className="grow relative w-full md:w-auto">
          <Header />
          <div className="container mx-auto px-4 md:px-6 py-6 md:py-8 pt-20 md:pt-8">
            <div
              className="p-8 rounded-lg border text-center"
              style={{
                backgroundColor: "#2A2A2A",
                borderColor: "rgba(255,255,255,0.08)",
              }}
            >
              <div className="text-5xl mb-4">⚠️</div>
              <h2
                className="text-xl font-bold mb-2"
                style={{ color: "#FAF3E1" }}
              >
                Error Loading Favorites
              </h2>
              <p className="mb-4" style={{ color: "rgba(245,231,198,0.6)" }}>
                {error}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 rounded-lg font-medium transition duration-300"
                style={{ backgroundColor: "#FA8112", color: "#222222" }}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return isSignedIn ? (
    <div className="flex min-h-screen" style={{ backgroundColor: "#222222" }}>
      <Sidebar />
      <div className="grow relative w-full md:w-auto">
        <Header />
        <div className="container mx-auto px-4 md:px-6 py-6 md:py-8 pt-20 md:pt-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1
                className="text-2xl md:text-3xl lg:text-4xl font-bold"
                style={{ color: "#FAF3E1" }}
              >
                Favorite Problems ⭐
              </h1>
              <p
                className="mt-2 text-sm md:text-base"
                style={{ color: "#F5E7C6" }}
              >
                {favoriteProblems.length} problem
                {favoriteProblems.length !== 1 ? "s" : ""} marked as favorite
              </p>
            </div>

            {favoriteProblems.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-2 md:gap-3 w-full sm:w-auto">
                <button
                  onClick={handleStartFavoritesQuiz}
                  className="px-4 md:px-6 py-2 rounded-lg font-medium transition duration-300 text-sm md:text-base whitespace-nowrap"
                  style={{ backgroundColor: "#FA8112", color: "#222222" }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#E9720F")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "#FA8112")
                  }
                >
                  🚀 Quiz All
                </button>
                <button
                  onClick={handleConfigureFavoritesQuiz}
                  className="px-4 md:px-6 py-2 rounded-lg transition duration-300 text-sm md:text-base whitespace-nowrap"
                  style={{ backgroundColor: "#303030", color: "#F5E7C6" }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#404040")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "#303030")
                  }
                >
                  ⚙️ Configure Quiz
                </button>
                <button
                  onClick={handleRemoveAll}
                  className="px-4 md:px-6 py-2 rounded-lg transition duration-300 text-sm md:text-base whitespace-nowrap"
                  style={{
                    backgroundColor: "#303030",
                    color: "rgba(245,231,198,0.6)",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#ef4444";
                    e.target.style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#303030";
                    e.target.style.color = "rgba(245,231,198,0.6)";
                  }}
                >
                  🗑️ Remove All
                </button>
              </div>
            )}
          </div>

          {/* Selected Actions Bar */}
          {selectedProblems.length > 0 && (
            <div
              className="p-4 rounded-lg border mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              style={{
                backgroundColor: "rgba(250,129,18,0.15)",
                borderColor: "rgba(250,129,18,0.35)",
              }}
            >
              <span className="font-medium" style={{ color: "#FA8112" }}>
                {selectedProblems.length} problem
                {selectedProblems.length !== 1 ? "s" : ""} selected
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleStartSelectedQuiz}
                  className="px-4 py-2 rounded-lg font-medium transition duration-300 text-sm"
                  style={{ backgroundColor: "#FA8112", color: "#222222" }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#E9720F")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "#FA8112")
                  }
                >
                  🚀 Quiz Selected
                </button>
                <button
                  onClick={handleRemoveSelected}
                  className="px-4 py-2 rounded-lg transition duration-300 text-sm"
                  style={{ backgroundColor: "#303030", color: "#F5E7C6" }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#ef4444";
                    e.target.style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#303030";
                    e.target.style.color = "#F5E7C6";
                  }}
                >
                  🗑️ Remove Selected
                </button>
                <button
                  onClick={() => setSelectedProblems([])}
                  className="px-4 py-2 rounded-lg transition duration-300 text-sm"
                  style={{ backgroundColor: "#303030", color: "#F5E7C6" }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#404040")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "#303030")
                  }
                >
                  ✕ Clear Selection
                </button>
              </div>
            </div>
          )}

          {/* Statistics Cards */}
          {favoriteProblems.length > 0 && (
            <div className="grid grid-cols-3 gap-3 md:gap-6 mb-6">
              <div
                className="p-3 md:p-4 rounded-lg border"
                style={{
                  backgroundColor: "#2A2A2A",
                  borderColor: "rgba(255,255,255,0.08)",
                }}
              >
                <div
                  className="text-xs md:text-sm"
                  style={{ color: "rgba(245,231,198,0.6)" }}
                >
                  Easy
                </div>
                <div
                  className="text-xl md:text-2xl font-bold"
                  style={{ color: "#22c55e" }}
                >
                  {favoriteProblems.filter((p) => p.difficulty === "easy").length}
                </div>
              </div>

              <div
                className="p-3 md:p-4 rounded-lg border"
                style={{
                  backgroundColor: "#2A2A2A",
                  borderColor: "rgba(255,255,255,0.08)",
                }}
              >
                <div
                  className="text-xs md:text-sm"
                  style={{ color: "rgba(245,231,198,0.6)" }}
                >
                  Medium
                </div>
                <div
                  className="text-xl md:text-2xl font-bold"
                  style={{ color: "#eab308" }}
                >
                  {favoriteProblems.filter((p) => p.difficulty === "medium").length}
                </div>
              </div>

              <div
                className="p-3 md:p-4 rounded-lg border"
                style={{
                  backgroundColor: "#2A2A2A",
                  borderColor: "rgba(255,255,255,0.08)",
                }}
              >
                <div
                  className="text-xs md:text-sm"
                  style={{ color: "rgba(245,231,198,0.6)" }}
                >
                  Hard
                </div>
                <div
                  className="text-xl md:text-2xl font-bold"
                  style={{ color: "#ef4444" }}
                >
                  {favoriteProblems.filter((p) => p.difficulty === "hard").length}
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
                backgroundColor: "#2A2A2A",
                borderColor: "rgba(255,255,255,0.08)",
              }}
            >
              <div className="text-5xl md:text-6xl mb-4">⭐</div>
              <h2
                className="text-xl md:text-2xl font-bold mb-2 px-4"
                style={{ color: "#FAF3E1" }}
              >
                No Favorite Problems Yet
              </h2>
              <p
                className="mb-6 text-sm md:text-base px-4"
                style={{ color: "rgba(245,231,198,0.6)" }}
              >
                Start marking problems as favorites to build your custom study
                list!
              </p>
              <button
                onClick={() => router.push("/dashboard/problems")}
                className="px-6 py-3 rounded-lg font-medium transition duration-300 text-sm md:text-base"
                style={{ backgroundColor: "#FA8112", color: "#222222" }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#E9720F")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "#FA8112")
                }
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