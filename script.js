const quizContainer = document.getElementById("quiz-container");
const resultContainer = document.getElementById("result-container");
const submitBtn = document.getElementById("submit-btn");
const retryBtn = document.getElementById("retry-btn");
const scoreText = document.getElementById("score");
const resultDetails = document.getElementById("result-details");

let userAnswers = [];

// Hàm xáo trộn mảng (Fisher-Yates algorithm)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Hàm xáo trộn câu hỏi và đáp án
function shuffleQuestions() {
  const shuffledQuestions = [...questions];
  shuffleArray(shuffledQuestions);
  
  shuffledQuestions.forEach(question => {
    const correctAnswer = question.options[question.correctAnswer];
    shuffleArray(question.options);
    question.correctAnswer = question.options.indexOf(correctAnswer);
  });
  
  return shuffledQuestions;
}

function renderQuestions(questionsToRender) {
  quizContainer.innerHTML = "";
  questionsToRender.forEach((q, index) => {
    const questionDiv = document.createElement("div");
    questionDiv.classList.add("question");
    questionDiv.innerHTML = `<p>${q.question}</p>`;
    q.options.forEach((option, i) => {
      const optionDiv = document.createElement("div");
      optionDiv.classList.add("option");

      optionDiv.innerHTML = `
        <label>
          <input type="radio" name="question${index}" value="${i}">
          ${option}
        </label>
      `;

      optionDiv.addEventListener("click", () => {
        const radio = optionDiv.querySelector("input[type='radio']");
        if (radio) radio.checked = true;
      });

      questionDiv.appendChild(optionDiv);
    });
    quizContainer.appendChild(questionDiv);
  });
}

function calculateScore(currentQuestions) {
  let score = 0;
  userAnswers = [];
  currentQuestions.forEach((q, index) => {
    const selectedOption = document.querySelector(
      `input[name="question${index}"]:checked`
    );
    if (selectedOption) {
      const userAnswer = parseInt(selectedOption.value);
      userAnswers.push({
        question: q.question,
        userAnswer,
        correctAnswer: q.correctAnswer,
      });
      if (userAnswer === q.correctAnswer) {
        score++;
      }
    }
  });
  return score;
}

function showResult(score) {
  quizContainer.classList.add("hidden");
  resultContainer.classList.remove("hidden");
  scoreText.textContent = `Bạn đã làm đúng ${score}/${questions.length} câu!`;
  resultDetails.innerHTML = "";
  userAnswers.forEach((ans, index) => {
    const questionClass =
      ans.userAnswer === ans.correctAnswer ? "correct" : "incorrect";
    resultDetails.innerHTML += `
      <div class="${questionClass}">
        <p>Câu ${index + 1}: ${ans.question}</p>
        <p>Bạn chọn: ${questions[index].options[ans.userAnswer]}</p>
        <p>Đáp án đúng: ${questions[index].options[ans.correctAnswer]}</p>
      </div>
    `;
  });
}

submitBtn.addEventListener("click", () => {
  const score = calculateScore(questions);
  showResult(score);
});

retryBtn.addEventListener("click", () => {
  resultContainer.classList.add("hidden");
  quizContainer.classList.remove("hidden");
  const shuffledQuestions = shuffleQuestions();
  renderQuestions(shuffledQuestions);
});

// Khởi tạo trang web
renderQuestions(questions);