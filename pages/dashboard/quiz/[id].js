import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Sidebar from "../../../components/dashboard/Sidebar";
import Header from "../../../components/dashboard/Header";

export default function QuizDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [problem, setProblem] = useState(null);

  useEffect(() => {
    if (id) {
      fetch("/data.json")
        .then((res) => res.json())
        .then((data) => {
          const problem = data.problems.find((p) => p.id === id);
          setProblem(problem);
        });
    }
  }, [id]);

  if (!problem) return <p>Loading...</p>;

  return (
    <div className="flex">
      <Sidebar />
      <div className="grow">
        <Header />
        <div className="container mx-auto px-6">
          <h1 className="text-2xl font-bold mt-6">{problem.title}</h1>
          <p className="text-gray-700 mt-4">{problem.summary}</p>
          <p className="text-gray-700 mt-4 font-semibold">
            Canonical Idea: {problem.canonical_idea.one_liner}
          </p>
          <pre className="bg-gray-100 p-4 mt-4 rounded-md">
            {problem.canonical_idea.pseudocode}
          </pre>
          <button
            onClick={() => router.push("/dashboard/problems")}
            className="mt-6 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Back to Problems Set
          </button>
        </div>
      </div>
    </div>
  );
}