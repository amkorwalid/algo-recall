export default function QuizCard({ quiz, onNext }) {
  const handleAnswer = (option) => {
    const isObject = option && typeof option === "object";
    const isCorrect = isObject
      ? option.is_correct
      : option === quiz?.correct_option;
    const whyWrong = isObject ? option.why_wrong : quiz?.why_wrong;

    alert(isCorrect ? "Correct!" : `Wrong! ${whyWrong || ""}`.trim());
  };

  return (
    <div className="p-4 bg-white shadow-lg rounded">
      <h2 className="text-lg font-bold text-blue-950">{quiz?.question}</h2>
      <div className="mt-4">
        {Array.isArray(quiz?.options) &&
          quiz.options.map((option, index) => (
          <button
            key={option?.id || index}
            onClick={() => handleAnswer(option)}
            className="block w-full text-blue-950 bg-gray-100 px-4 py-2 rounded mt-2 text-left hover:bg-gray-200"
          >
            {option?.text ?? option}
          </button>
        ))}
      </div>
      <button
        onClick={() => onNext()}
        className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
      >
        Next Quiz
      </button>
    </div>
  );
}