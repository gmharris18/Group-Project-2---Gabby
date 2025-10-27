// Game 1: Math Challenge - Geometry and Algebra Questions
const API_BASE_URL = 'http://localhost:5000';

// Question bank
const questions = [
  // Geometry Questions
  {
    question: "What is the area of a rectangle with length 8 cm and width 5 cm?",
    options: ["40 cm²", "13 cm²", "26 cm²", "80 cm²"],
    correct: 0,
    category: "Geometry"
  },
  {
    question: "What is the perimeter of a square with side length 6 cm?",
    options: ["12 cm", "24 cm", "36 cm", "18 cm"],
    correct: 1,
    category: "Geometry"
  },
  {
    question: "In a right triangle, if one leg is 3 and the other leg is 4, what is the hypotenuse?",
    options: ["5", "7", "6", "8"],
    correct: 0,
    category: "Geometry"
  },
  {
    question: "What is the area of a triangle with base 10 cm and height 6 cm?",
    options: ["60 cm²", "30 cm²", "16 cm²", "20 cm²"],
    correct: 1,
    category: "Geometry"
  },
  {
    question: "What is the circumference of a circle with radius 7? (Use π ≈ 3.14)",
    options: ["21.98", "43.96", "153.86", "14"],
    correct: 1,
    category: "Geometry"
  },
  {
    question: "What is the sum of angles in a triangle?",
    options: ["90°", "180°", "360°", "270°"],
    correct: 1,
    category: "Geometry"
  },
  {
    question: "What is the area of a circle with radius 5? (Use π ≈ 3.14)",
    options: ["31.4", "78.5", "15.7", "25"],
    correct: 1,
    category: "Geometry"
  },
  {
    question: "If two angles of a triangle are 45° and 65°, what is the third angle?",
    options: ["70°", "80°", "60°", "90°"],
    correct: 0,
    category: "Geometry"
  },
  
  // Algebra Questions
  {
    question: "Solve for x: 2x + 5 = 13",
    options: ["x = 4", "x = 9", "x = 8", "x = 6"],
    correct: 0,
    category: "Algebra"
  },
  {
    question: "Solve for x: 3x - 7 = 14",
    options: ["x = 5", "x = 7", "x = 21", "x = 3"],
    correct: 1,
    category: "Algebra"
  },
  {
    question: "Simplify: 4x + 3x - 2x",
    options: ["9x", "5x", "x", "7x"],
    correct: 1,
    category: "Algebra"
  },
  {
    question: "What is the value of x if 5x = 35?",
    options: ["5", "7", "8", "6"],
    correct: 1,
    category: "Algebra"
  },
  {
    question: "Solve for x: x/4 = 3",
    options: ["7", "12", "16", "9"],
    correct: 1,
    category: "Algebra"
  },
  {
    question: "What is 2³?",
    options: ["6", "8", "9", "4"],
    correct: 1,
    category: "Algebra"
  },
  {
    question: "Solve for x: 4x + 8 = 2x + 18",
    options: ["x = 5", "x = 10", "x = 3", "x = 8"],
    correct: 0,
    category: "Algebra"
  },
  {
    question: "If y = 2x + 3 and x = 4, what is y?",
    options: ["11", "9", "7", "13"],
    correct: 0,
    category: "Algebra"
  },
  {
    question: "Simplify: (3x)(4x)",
    options: ["7x", "12x", "12x²", "7x²"],
    correct: 2,
    category: "Algebra"
  },
  {
    question: "What is the value of x² when x = 5?",
    options: ["10", "25", "15", "20"],
    correct: 1,
    category: "Algebra"
  }
];

// Game state
let currentQuestionIndex = 0;
let score = 0;
let selectedQuestions = [];
let timeLeft = 30;
let timerInterval = null;
let questionsAnswered = 0;

// Initialize game
function initGame() {
  // Select 10 random questions
  selectedQuestions = shuffleArray([...questions]).slice(0, 10);
  currentQuestionIndex = 0;
  score = 0;
  questionsAnswered = 0;
  
  // Set up quit button
  const quitBtn = document.getElementById('quitGameBtn');
  if (quitBtn) {
    quitBtn.addEventListener('click', quitGame);
  }
  
  showStartScreen();
}

// Shuffle array helper
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Show start screen
function showStartScreen() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <div class="card shadow-lg">
          <div class="card-body text-center p-4">
            <h1 class="display-5 mb-3">🧮 Math Challenge</h1>
            <p class="lead mb-3">Test your geometry and algebra skills!</p>
            <div class="alert alert-info mb-3">
              <h6 class="mb-2">Game Rules:</h6>
              <div class="row text-start">
                <div class="col-md-6">
                  <small>✓ Answer 10 questions</small><br>
                  <small>✓ 30 seconds per question</small>
                </div>
                <div class="col-md-6">
                  <small>✓ Each correct = 10 points</small><br>
                  <small>✓ Try to get highest score!</small>
                </div>
              </div>
            </div>
            <div class="d-grid gap-2">
              <button class="btn btn-primary" onclick="startGame()">
                Start Game
              </button>
              <a href="./game.html" class="btn btn-outline-secondary">
                Back to Games
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Start game
function startGame() {
  currentQuestionIndex = 0;
  score = 0;
  questionsAnswered = 0;
  
  // Show quit button when starting new game
  const quitBtn = document.getElementById('quitGameBtn');
  if (quitBtn) {
    quitBtn.style.display = 'block';
  }
  
  showQuestion();
}

// Show question
function showQuestion() {
  if (currentQuestionIndex >= selectedQuestions.length) {
    endGame();
    return;
  }

  const question = selectedQuestions[currentQuestionIndex];
  const app = document.getElementById('app');
  
  app.innerHTML = `
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <div class="card shadow-lg">
          <div class="card-header bg-primary text-white">
            <div class="d-flex justify-content-between align-items-center">
              <span class="badge bg-light text-primary">Question ${currentQuestionIndex + 1}/10</span>
              <span class="badge bg-warning text-dark" id="timer">Time: 30s</span>
              <span class="badge bg-light text-primary">Score: ${score}</span>
            </div>
          </div>
          <div class="card-body p-3">
            <div class="mb-2">
              <span class="badge bg-info">${question.category}</span>
            </div>
            <h4 class="mb-3">${question.question}</h4>
            <div class="d-grid gap-2">
              ${question.options.map((option, index) => `
                <button class="btn btn-outline-primary text-start answer-btn" 
                        onclick="selectAnswer(${index})"
                        data-index="${index}">
                  ${String.fromCharCode(65 + index)}. ${option}
                </button>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  startTimer();
}

// Start timer
function startTimer() {
  timeLeft = 30;
  updateTimerDisplay();
  
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      handleTimeout();
    }
  }, 1000);
}

// Update timer display
function updateTimerDisplay() {
  const timerElement = document.getElementById('timer');
  if (timerElement) {
    timerElement.textContent = `Time: ${timeLeft}s`;
    if (timeLeft <= 5) {
      timerElement.classList.remove('bg-warning', 'text-dark');
      timerElement.classList.add('bg-danger', 'text-white');
    }
  }
}

// Handle timeout
function handleTimeout() {
  showFeedback(false, "Time's up!");
}

// Select answer
function selectAnswer(selectedIndex) {
  if (timerInterval) {
    clearInterval(timerInterval);
  }

  const question = selectedQuestions[currentQuestionIndex];
  const isCorrect = selectedIndex === question.correct;
  
  if (isCorrect) {
    score += 10;
  }
  
  questionsAnswered++;
  showFeedback(isCorrect, null, selectedIndex);
}

// Show feedback
function showFeedback(isCorrect, timeoutMessage = null, selectedIndex = null) {
  const question = selectedQuestions[currentQuestionIndex];
  const buttons = document.querySelectorAll('.answer-btn');
  
  // Disable all buttons
  buttons.forEach(btn => {
    btn.disabled = true;
    const index = parseInt(btn.dataset.index);
    
    if (index === question.correct) {
      btn.classList.remove('btn-outline-primary');
      btn.classList.add('btn-success');
    } else if (index === selectedIndex && !isCorrect) {
      btn.classList.remove('btn-outline-primary');
      btn.classList.add('btn-danger');
    }
  });

  // Show feedback popup that covers the screen
  const feedbackPopup = document.createElement('div');
  feedbackPopup.id = 'feedbackPopup';
  feedbackPopup.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    backdrop-filter: blur(5px);
  `;
  
  feedbackPopup.innerHTML = `
    <div class="card shadow-lg" style="max-width: 400px; width: 90%;">
      <div class="card-body text-center p-4">
        <div class="mb-3">
          <i class="fas fa-${isCorrect ? 'check-circle text-success' : 'times-circle text-danger'}" style="font-size: 3rem;"></i>
        </div>
        <h3 class="mb-3 ${isCorrect ? 'text-success' : 'text-danger'}">
          ${timeoutMessage || (isCorrect ? 'Correct!' : 'Incorrect')}
        </h3>
        <p class="mb-3">
          ${timeoutMessage ? 'The correct answer was: ' : (isCorrect ? 'Great job!' : 'The correct answer is: ')}
          <strong>${question.options[question.correct]}</strong>
        </p>
        <div class="progress mb-3" style="height: 6px;">
          <div class="progress-bar ${isCorrect ? 'bg-success' : 'bg-danger'}" role="progressbar" style="width: 100%;" id="feedbackProgress"></div>
        </div>
        <small class="text-muted">Moving to next question...</small>
      </div>
    </div>
  `;
  
  document.body.appendChild(feedbackPopup);
  
  // Animate progress bar
  const progressBar = document.getElementById('feedbackProgress');
  progressBar.style.transition = 'width 1s linear';
  progressBar.style.width = '0%';
  
  // Auto-advance after 1 second
  setTimeout(() => {
    // Remove feedback popup
    const popup = document.getElementById('feedbackPopup');
    if (popup) {
      popup.remove();
    }
    
    if (currentQuestionIndex < selectedQuestions.length - 1) {
      nextQuestion();
    } else {
      endGame();
    }
  }, 1000);
}

// Next question
function nextQuestion() {
  currentQuestionIndex++;
  showQuestion();
}

// Quit game
function quitGame() {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  // End game without completing all questions
  endGame(true);
}

// End game
async function endGame(quitGame = false) {
  const app = document.getElementById('app');
  
  // Hide quit button when showing end screen
  const quitBtn = document.getElementById('quitGameBtn');
  if (quitBtn) {
    quitBtn.style.display = 'none';
  }
  
  const percentage = questionsAnswered > 0 ? (score / (questionsAnswered * 10)) * 100 : 0;
  let title = quitGame ? 'Game Quit' : 'Game Over!';
  let message = '';
  let badgeClass = '';
  
  if (quitGame) {
    message = 'You quit the game';
    badgeClass = 'bg-secondary';
  } else if (percentage >= 90) {
    message = 'Outstanding! 🏆';
    badgeClass = 'bg-success';
  } else if (percentage >= 70) {
    message = 'Great job! 🎉';
    badgeClass = 'bg-info';
  } else if (percentage >= 50) {
    message = 'Good effort! 👍';
    badgeClass = 'bg-warning';
  } else {
    message = 'Keep practicing! 💪';
    badgeClass = 'bg-secondary';
  }

  app.innerHTML = `
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <div class="card shadow-lg">
          <div class="card-body text-center p-4">
            <h1 class="display-5 mb-3">${title}</h1>
            <div class="mb-3">
              <span class="badge ${badgeClass} fs-6 px-3 py-2">${message}</span>
            </div>
            <div class="row g-2 mb-3">
              <div class="col-md-4">
                <div class="card bg-primary text-white">
                  <div class="card-body py-2">
                    <h4 class="mb-0">${score}</h4>
                    <small>Total Score</small>
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="card bg-success text-white">
                  <div class="card-body py-2">
                    <h4 class="mb-0">${questionsAnswered > 0 ? Math.round(percentage) : 0}%</h4>
                    <small>Accuracy</small>
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="card bg-info text-white">
                  <div class="card-body py-2">
                    <h4 class="mb-0">${questionsAnswered}/10</h4>
                    <small>Questions</small>
                  </div>
                </div>
              </div>
            </div>
            <div id="saveScoreMessage" class="mb-2"></div>
            <div class="d-grid gap-2">
              <button class="btn btn-primary" onclick="startGame()">
                Play Again
              </button>
              <a href="./game.html" class="btn btn-outline-secondary">
                Back to Games
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Try to save score to API
  await saveScore(score);
}

// Save score using local progress tracking
async function saveScore(finalScore) {
  const messageDiv = document.getElementById('saveScoreMessage');
  
  try {
    // Check if student is logged in
    if (!window.GameProgress || !window.GameProgress.isStudentLoggedIn()) {
      messageDiv.innerHTML = `
        <div class="alert alert-warning">
          <small>Please log in as a student to save your score!</small>
        </div>
      `;
      return;
    }

    // Save progress using the new system
    const success = await window.GameProgress.saveGameProgress(1, finalScore);
    
    if (success) {
      // Also save subject-specific performance
      await saveSubjectPerformance(finalScore);
      
      messageDiv.innerHTML = `
        <div class="alert alert-success">
          <small>✓ Score saved successfully! Your progress has been recorded.</small>
        </div>
      `;
    } else {
      throw new Error('Failed to save score');
    }
  } catch (error) {
    console.error('Error saving score:', error);
    messageDiv.innerHTML = `
      <div class="alert alert-warning">
        <small>Could not save score. Please try again.</small>
      </div>
    `;
  }
}

// Save subject-specific performance data
async function saveSubjectPerformance(finalScore) {
  try {
    const currentUser = window.Auth.getCurrentUser();
    if (!currentUser || !currentUser.userId) return;

    // Calculate performance by category
    const geometryQuestions = selectedQuestions.filter(q => q.category === 'Geometry');
    const algebraQuestions = selectedQuestions.filter(q => q.category === 'Algebra');
    
    const geometryCorrect = geometryQuestions.filter((q, index) => {
      const questionIndex = selectedQuestions.indexOf(q);
      return questionIndex !== -1 && questionsAnswered > questionIndex;
    }).length;
    
    const algebraCorrect = algebraQuestions.filter((q, index) => {
      const questionIndex = selectedQuestions.indexOf(q);
      return questionIndex !== -1 && questionsAnswered > questionIndex;
    }).length;

    // Save Geometry performance
    if (geometryQuestions.length > 0) {
      const geometryScore = Math.round((geometryCorrect / geometryQuestions.length) * finalScore);
      const geometryAccuracy = geometryCorrect / geometryQuestions.length;
      
      await fetch(`${window.API_URL}/subjectanalytics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          studentID: currentUser.userId,
          subject: 'Math',
          category: 'Geometry',
          score: geometryScore,
          accuracy: geometryAccuracy,
          questionsAnswered: geometryQuestions.length,
          gameNumber: 1
        })
      });
    }

    // Save Algebra performance
    if (algebraQuestions.length > 0) {
      const algebraScore = Math.round((algebraCorrect / algebraQuestions.length) * finalScore);
      const algebraAccuracy = algebraCorrect / algebraQuestions.length;
      
      await fetch(`${window.API_URL}/subjectanalytics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          studentID: currentUser.userId,
          subject: 'Math',
          category: 'Algebra',
          score: algebraScore,
          accuracy: algebraAccuracy,
          questionsAnswered: algebraQuestions.length,
          gameNumber: 1
        })
      });
    }
  } catch (error) {
    console.error('Error saving subject performance:', error);
  }
}

// Initialize game function
function initGame() {
  console.log('Initializing Math Challenge...');
  startGame();
}

// Make initGame globally available
window.initGame = initGame;

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', initGame);
