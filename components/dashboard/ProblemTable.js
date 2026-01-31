export default function ProblemTable({ problems, onQuickView }) {
  const difficultyColors = {
    easy: "bg-green-100 text-green-700",
    medium: "bg-yellow-100 text-yellow-700",
    hard: "bg-red-100 text-red-700",
  };

  return (
    <table className="min-w-full bg-white rounded">
      <thead>
        <tr>
          <th className="px-4 py-2 text-left text-gray-600">Title</th>
          <th className="px-4 py-2 text-left text-gray-600">Difficulty</th>
          <th className="px-4 py-2 text-left text-gray-600">Topics</th>
          <th className="px-4 py-2 text-left text-gray-600">Actions</th>
        </tr>
      </thead>
      <tbody>
        {problems.map((problem) => (
          <tr key={problem.id}>
            <td className="px-4 py-2 border"><span className="text-neutral-900">{problem.title}</span></td>
            <td className="px-4 py-2 border">
              <span className={`px-2 py-0.5 rounded ${difficultyColors[problem.difficulty]}`}>
                {problem.difficulty}
              </span>
            </td>
            <td className="px-4 py-2 border">
              {problem.topics.map((topic, index) => (
                <span key={index} className="bg-gray-100 px-2 py-0.5 rounded text-gray-800 mr-1 text-sm">
                  {topic}
                </span>
              ))}
            </td>
            <td className="px-4 py-2 border">
              <button
                onClick={() => onQuickView(problem)}
                className="bg-blue-600 text-white px-2 py-1 rounded"
              >
                Quick View
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}