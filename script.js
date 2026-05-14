
let questions = [];
let currentQuestion = 0;
let answers = [];
let timer;
let timeLeft = 30 * 60;

function shuffle(array){
  return array.sort(() => Math.random() - 0.5);
}

function startExam(){
  const username = document.getElementById("username").value.trim();
  const category = document.getElementById("category").value;

  if(username === ""){
    alert("กรุณากรอกชื่อ");
    return;
  }

  localStorage.setItem("studentName", username);

  if(category === "all"){
    questions = shuffle([...questionBank]);
  }else{
    questions = shuffle(questionBank.filter(q => q.category === category));
  }

  questions = questions.slice(0, 5);

  answers = new Array(questions.length).fill(null);

  document.getElementById("loginPage").classList.add("hidden");
  document.getElementById("examPage").classList.remove("hidden");

  document.getElementById("studentInfo").innerText =
    "ผู้สอบ: " + username;

  showQuestion();
  startTimer();
}

function showQuestion(){
  const q = questions[currentQuestion];

  document.getElementById("progress").innerText =
    `ข้อ ${currentQuestion + 1} / ${questions.length}`;

  let html = `<h3>${q.question}</h3>`;

  q.options.forEach((opt, index) => {
    const selected = answers[currentQuestion] === index ? "selected" : "";

    html += `
      <div class="option ${selected}"
      onclick="selectOption(${index})">
      ${opt}
      </div>
    `;
  });

  document.getElementById("questionBox").innerHTML = html;
}

function selectOption(index){
  answers[currentQuestion] = index;
  showQuestion();
}

function nextQuestion(){
  if(currentQuestion < questions.length - 1){
    currentQuestion++;
    showQuestion();
  }
}

function prevQuestion(){
  if(currentQuestion > 0){
    currentQuestion--;
    showQuestion();
  }
}

function startTimer(){
  timer = setInterval(() => {
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;

    document.getElementById("timer").innerText =
      `${String(min).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;

    timeLeft--;

    if(timeLeft < 0){
      clearInterval(timer);
      submitExam();
    }

  }, 1000);
}

function submitExam(){
  clearInterval(timer);

  let score = 0;

  questions.forEach((q, i) => {
    if(answers[i] === q.answer){
      score++;
    }
  });

  document.getElementById("examPage").classList.add("hidden");
  document.getElementById("resultPage").classList.remove("hidden");

  document.getElementById("finalScore").innerHTML =
    `คะแนน: <strong>${score}/${questions.length}</strong>`;

  let analysis = "";

  questions.forEach((q, i) => {
    const correct = answers[i] === q.answer;

    analysis += `
      <div>
        <p><strong>${i+1}. ${q.question}</strong></p>
        <p class="${correct ? 'correct' : 'wrong'}">
          คำตอบของคุณ:
          ${answers[i] !== null ? q.options[answers[i]] : "ไม่ได้ตอบ"}
        </p>
        <p class="correct">
          คำตอบที่ถูก:
          ${q.options[q.answer]}
        </p>
        <hr>
      </div>
    `;
  });

  document.getElementById("analysis").innerHTML = analysis;

  saveHistory(score);
}

function saveHistory(score){
  const history = JSON.parse(localStorage.getItem("examHistory")) || [];

  history.push({
    name: localStorage.getItem("studentName"),
    score: score,
    date: new Date().toLocaleString()
  });

  localStorage.setItem("examHistory", JSON.stringify(history));
}

function restart(){
  location.reload();
}
