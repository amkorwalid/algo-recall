export default function WhoItsFor() {
  return (
    <section className="bg-[#2A2A2A] text-[#FAF3E1] py-16">
      <div className="container mx-auto px-6 lg:px-12">
        <h2 className="text-3xl lg:text-4xl font-bold">Built for People Who Take Coding Seriously</h2>
        <ul className="mt-6 space-y-4">
          <li className="flex items-start space-x-4">
            <span className="text-3xl">💻</span>
            <p className="text-lg text-[#F5E7C6]">
              <strong>Coding interview candidates</strong> preparing for FAANG-style interviews.
            </p>
          </li>
          <li className="flex items-start space-x-4">
            <span className="text-3xl">🏆</span>
            <p className="text-lg text-[#F5E7C6]">
              <strong>Competitive programmers</strong> optimizing recall speed.
            </p>
          </li>
          <li className="flex items-start space-x-4">
            <span className="text-3xl">🎓</span>
            <p className="text-lg text-[#F5E7C6]">
              <strong>Computer science students</strong> learning algorithms deeply.
            </p>
          </li>
          <li className="flex items-start space-x-4">
            <span className="text-3xl">👨‍💻</span>
            <p className="text-lg text-[#F5E7C6]">
              <strong>Engineers</strong> revising core concepts efficiently.
            </p>
          </li>
        </ul>
        <p className="mt-6 text-[#FA8112] font-medium">
          If you want clarity under pressure, AlgoRecall is for you.
        </p>
      </div>
    </section>
  );
}