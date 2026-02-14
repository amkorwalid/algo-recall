import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth, useUser } from "@clerk/nextjs";
import { supabaseBrowser } from "@/lib/supabase/client";
import Sidebar from "../../components/dashboard/Sidebar";
import Header from "../../components/dashboard/Header";

export default function QuizSetsPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();

  const [quizSets, setQuizSets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (user) {
      fetchQuizSets();
    }
  }, [user]);

  const fetchQuizSets = async () => {
    setLoading(true);
    const supabase = supabaseBrowser();
    const { data, error } = await supabase
      .from("quizzes_set")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching quiz sets:", error);
    } else {
      setQuizSets(data ?? []);
    }
    setLoading(false);
  };

  const handleStartQuizSet = (quizSet) => {
    // Store the quiz set in localStorage and navigate to quiz page
    localStorage.setItem("customQuizSet", JSON.stringify(quizSet.set));
    localStorage.setItem("currentQuizSetName", quizSet.name);
    router.push("/dashboard/quiz?mode=custom");
  };

  const handleDeleteQuizSet = async (id) => {
    if (!window.confirm("Are you sure you want to delete this quiz set?")) {
      return;
    }

    const supabase = supabaseBrowser();
    const { error } = await supabase.from("quizzes_set").delete().eq("id", id);

    if (error) {
      console.error("Error deleting quiz set:", error);
      alert("Failed to delete quiz set");
    } else {
      setQuizSets(quizSets.filter((set) => set.id !== id));
    }
  };

  if (!isLoaded) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ backgroundColor: "#222222" }}
      >
        <div style={{ color: "#FAF3E1" }}>Loading...</div>
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
                Quiz Sets 📋
              </h1>
              <p
                className="mt-2 text-sm md:text-base"
                style={{ color: "#F5E7C6" }}
              >
                {quizSets.length} custom quiz set
                {quizSets.length !== 1 ? "s" : ""} created
              </p>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div
              className="p-8 rounded-lg border text-center"
              style={{
                backgroundColor: "#2A2A2A",
                borderColor: "rgba(255,255,255,0.08)",
              }}
            >
              <p style={{ color: "#F5E7C6" }}>Loading quiz sets...</p>
            </div>
          ) : quizSets.length === 0 ? (
            /* Empty State */
            <div
              className="p-8 rounded-lg border text-center"
              style={{
                backgroundColor: "#2A2A2A",
                borderColor: "rgba(255,255,255,0.08)",
              }}
            >
              <div className="text-6xl mb-4">📋</div>
              <h2
                className="text-xl font-semibold mb-2"
                style={{ color: "#FAF3E1" }}
              >
                No Quiz Sets Yet
              </h2>
              <p className="mb-4" style={{ color: "rgba(245,231,198,0.6)" }}>
                Create custom quiz sets from the Problems page by selecting
                problems and clicking "Add to Quiz Set"
              </p>
              <button
                onClick={() => router.push("/dashboard/problems")}
                className="px-6 py-2 rounded-lg font-medium transition duration-300"
                style={{ backgroundColor: "#FA8112", color: "#222222" }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#E9720F")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "#FA8112")
                }
              >
                Go to Problems
              </button>
            </div>
          ) : (
            /* Quiz Sets Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {quizSets.map((quizSet) => (
                <div
                  key={quizSet.id}
                  className="p-4 md:p-6 rounded-lg border transition duration-300 hover:shadow-lg"
                  style={{
                    backgroundColor: "#2A2A2A",
                    borderColor: "rgba(255,255,255,0.08)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = "rgba(250,129,18,0.5)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.08)")
                  }
                >
                  {/* Quiz Set Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3
                        className="text-lg md:text-xl font-bold truncate"
                        style={{ color: "#FAF3E1" }}
                      >
                        {quizSet.name}
                      </h3>
                      <p
                        className="text-sm mt-1"
                        style={{ color: "rgba(245,231,198,0.6)" }}
                      >
                        {quizSet.set?.length || 0} problem
                        {quizSet.set?.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="text-3xl">📋</div>
                  </div>

                  {/* Quiz Set Stats */}
                  <div
                    className="p-3 rounded-lg mb-4"
                    style={{ backgroundColor: "#303030" }}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className="text-sm"
                        style={{ color: "rgba(245,231,198,0.6)" }}
                      >
                        Problems in set
                      </span>
                      <span
                        className="text-lg font-bold"
                        style={{ color: "#FA8112" }}
                      >
                        {quizSet.set?.length || 0}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStartQuizSet(quizSet)}
                      className="flex-1 px-4 py-2 rounded-lg font-medium transition duration-300 text-sm md:text-base"
                      style={{ backgroundColor: "#FA8112", color: "#222222" }}
                      onMouseEnter={(e) =>
                        (e.target.style.backgroundColor = "#E9720F")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.backgroundColor = "#FA8112")
                      }
                    >
                      Start Quiz
                    </button>
                    <button
                      onClick={() => handleDeleteQuizSet(quizSet.id)}
                      className="px-4 py-2 rounded-lg transition duration-300 text-sm md:text-base"
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
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  ) : null;
}