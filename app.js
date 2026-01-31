
const problem = {
    "id": "lc_003",
    "title": "Longest Substring Without Repeating Characters",
    "difficulty": "medium",
    "topics": ["sliding_window", "two_pointers", "hash_map"],
    "problem_summary": "Given a string s, find the length of the longest substring without repeating characters.",
    "quiz": {
      "question": "What is the main idea to solve this problem efficiently?",
      "options": [
        {
          "id": "A",
          "text": "Use a sliding window with two pointers and a hashmap to maintain unique characters",
          "is_correct": true
        },
        {
          "id": "B",
          "text": "Use dynamic programming where dp[i] is the longest valid substring ending at i",
          "is_correct": false,
          "why_wrong": "DP adds unnecessary complexity."
        },
        {
          "id": "C",
          "text": "Generate all substrings and check uniqueness using a set",
          "is_correct": false,
          "why_wrong": "O(n²) time complexity."
        },
        {
          "id": "D",
          "text": "Sort the string and count unique characters",
          "is_correct": false,
          "why_wrong": "Sorting breaks substring order."
        }
      ]
    },
    "key_insight": "When a repeated character is found, move the left pointer just after its last occurrence."
  }; 

document.getElementById("title").textContent = problem.title;
document.getElementById("difficulty").textContent = problem.difficulty.toUpperCase();
document.getElementById("summary").textContent = problem.problem_summary;
document.getElementById("question").textContent = problem.quiz.question;

const optionsDiv = document.getElementById("options");
const feedbackDiv = document.getElementById("feedback");

problem.quiz.options.forEach(option => {
    const div = document.createElement("div");
    div.className = "option";
    div.textContent = `${option.id}. ${option.text}`;

    div.onclick = () => {
    document.querySelectorAll(".option").forEach(o => o.onclick = null);

    if (option.is_correct) {
        div.classList.add("correct");
        feedbackDiv.textContent = "✅ Correct! Key Insight: " + problem.key_insight;
    } else {
        div.classList.add("wrong");
        feedbackDiv.textContent = "❌ Wrong. " + (option.why_wrong || "");
    }
    };

    optionsDiv.appendChild(div);
});
