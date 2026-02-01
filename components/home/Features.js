export default function Features() {
  const features = [
    {
      title: 'AI-Generated Quizzes',
      description:
        'Each problem is converted into concept-focused multiple-choice and reasoning questions.',
    },
    {
      title: 'Pattern-Based Learning',
      description:
        'Problems are organized by underlying algorithms: sliding window, DP, greedy, hashing, etc.',
    },
    {
      title: 'Fast Review Mode',
      description: 'Refresh multiple problems in minutes instead of hours.',
    },
    {
      title: 'Key Insights & Traps',
      description: 'Learn what matters and avoid common mistakes like a pro.',
    },
    {
      title: 'Progress Tracking',
      description: 'See mastered patterns and focus on improvement areas.',
    },
  ];

  return (
    <section id="features" className="bg-[#222222] text-[#FAF3E1] py-16">
      <div className="container mx-auto px-6 lg:px-12">
        <h2 className="text-3xl lg:text-4xl font-bold">
          Everything You Need to Actually Remember Algorithms
        </h2>
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-[#2A2A2A] px-6 py-8 rounded-lg shadow hover:bg-[#303030] transition-colors duration-200"
            >
              <h3 className="text-xl font-semibold text-[#FA8112]">
                {feature.title}
              </h3>
              <p className="text-sm text-[#F5E7C6] mt-2">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}