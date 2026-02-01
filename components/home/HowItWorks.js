export default function HowItWorks() {
  const steps = [
    {
      title: 'Choose a Problem or Topic',
      description: 'Pick a LeetCode problem, difficulty level, or algorithmic pattern.',
    },
    {
      title: 'Answer Smart Quiz Questions',
      description: 'AI-generated questions test your understanding of the solution idea, not syntax.',
    },
    {
      title: 'Get Instant Feedback',
      description: 'See the correct reasoning, key insight, and common traps.',
    },
    {
      title: 'Build Pattern Memory',
      description: 'Over time, your brain recognizes problems faster — with confidence.',
    },
  ];

  return (
    <section id="how-it-works" className="bg-[#2A2A2A] text-[#FAF3E1] py-16">
      <div className="container mx-auto px-6 lg:px-12">
        <h2 className="text-3xl lg:text-4xl font-bold">How AlgoRecall Works</h2>
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-[#303030] p-4 rounded-lg shadow hover:bg-[#3A3A3A] transition-colors duration-200">
              <h4 className="text-xl font-semibold text-[#FA8112]">{step.title}</h4>
              <p className="text-sm text-[#F5E7C6] mt-2">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}