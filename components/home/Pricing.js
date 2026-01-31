export default function Pricing() {
  return (
    <section className="py-20 bg-gray-50" id="pricing">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-blue-600">Pricing</h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-lg shadow bg-white">
            <h3 className="text-xl font-semibold text-blue-600">Free</h3>
            <p className="text-gray-700">Limited quizzes, basic progress tracking.</p>
          </div>
          <div className="p-6 rounded-lg shadow bg-blue-600 text-white">
            <h3 className="text-xl font-semibold">Premium</h3>
            <p>Unlimited practice, analytics, and more.</p>
          </div>
        </div>
      </div>
    </section>
  );
}