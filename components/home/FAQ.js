export default function FAQ() {
  const faqs = [
    { question: 'What is QuizCode?', answer: 'QuizCode is a platform for practicing competitive programming with interactive quizzes.' },
    { question: 'Who is QuizCode for?', answer: 'It\'s for developers, coders, students, and anyone prepping for interviews.' },
    { question: 'Is there a free plan?', answer: 'Yes, QuizCode offers both free and premium plans.' },
  ];
  return (
    <section className="py-20" id="faq">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-blue-600 text-center">FAQ</h2>
        <div className="mt-8 text-left">
          {faqs.map((faq, index) => (
            <details key={index} className="mb-4">
              <summary className="font-semibold">{faq.question}</summary>
              <p className="text-gray-600 mt-2">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}