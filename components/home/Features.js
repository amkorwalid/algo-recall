export default function Features() {
  const features = [
    {
      title: 'Interactive Quizzes',
      description:
        'Learn and revise code concepts with multiple-choice questions tailored for fast recall.',
    },
    {
      title: 'Track Progress',
      description:
        'Visualize your learning stats and see how you\'re improving.',
    },
    {
      title: 'Personalized Practice',
      description: 'Filter questions by difficulty and topic to focus on your weak areas.',
    },
    {
      title: 'Gamified Learning',
      description:
        'Earn badges, streaks, and compete with friends.',
    },
  ];
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-blue-600">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mt-8">
          {features.map((feature, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800">{feature.title}</h3>
              <p className="text-gray-600 mt-2">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}