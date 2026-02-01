export default function Problem() {
  return (
    <section className="bg-[#2A2A2A] text-[#FAF3E1] py-16">
      <div className="container mx-auto px-6 lg:px-12">
        <h2 className="text-3xl lg:text-4xl font-bold">
          Solving Problems Isn’t the Hard Part. Remembering Them Is.
        </h2>
        <p className="text-lg lg:text-xl mt-4 text-[#F5E7C6] leading-relaxed">
          You grind LeetCode. You understand the solution. You move on. Two weeks later, you see the same problem type… and freeze.
        </p>
        <ul className="mt-6 text-[#F5E7C699] list-disc list-inside">
          <li>Re-solving full problems takes too much time</li>
          <li>Reading solutions feels passive and forgettable</li>
          <li>Patterns blur together under interview pressure</li>
        </ul>
        <p className="text-[#FA8112] mt-6 font-medium">
          AlgoRecall exists because solving ≠ remembering.
        </p>
      </div>
    </section>
  );
}