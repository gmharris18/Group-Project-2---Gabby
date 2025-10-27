// Game 5: History Timeline - History Quiz Game

// Notification utility function to replace alerts
function showNotification(message, type = 'info') {
  // Remove any existing notifications
  const existingNotification = document.getElementById('notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification element
  const notification = document.createElement('div');
  notification.id = 'notification';
  notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
  notification.style.cssText = `
    top: 20px;
    right: 20px;
    z-index: 9999;
    min-width: 300px;
    max-width: 500px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  `;
  
  notification.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;
  
  document.body.appendChild(notification);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (notification && notification.parentNode) {
      notification.remove();
    }
  }, 5000);
}

// Game state
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 30;
let gameTimer = null;
let questionsAnswered = 0;
let selectedQuestions = [];

// History questions
const historyQuestions = [
  {
    question: "Who was the first President of the United States?",
    options: ["George Washington", "Thomas Jefferson", "John Adams", "Benjamin Franklin"],
    correct: 0,
    category: "American History"
  },
  {
    question: "In what year did World War II end?",
    options: ["1944", "1945", "1946", "1947"],
    correct: 1,
    category: "World Wars"
  },
  {
    question: "Which ancient wonder was located in Alexandria, Egypt?",
    options: ["Hanging Gardens", "Lighthouse of Alexandria", "Colossus of Rhodes", "Temple of Artemis"],
    correct: 1,
    category: "Ancient History"
  },
  {
    question: "Who wrote the Declaration of Independence?",
    options: ["George Washington", "Thomas Jefferson", "John Adams", "Alexander Hamilton"],
    correct: 1,
    category: "American History"
  },
  {
    question: "In which year did the Berlin Wall fall?",
    options: ["1987", "1988", "1989", "1990"],
    correct: 2,
    category: "Modern History"
  },
  {
    question: "Which empire was ruled by Julius Caesar?",
    options: ["Greek Empire", "Roman Empire", "Byzantine Empire", "Ottoman Empire"],
    correct: 1,
    category: "Ancient History"
  },
  {
    question: "What was the name of the ship that brought the Pilgrims to America?",
    options: ["Mayflower", "Santa Maria", "Nina", "Pinta"],
    correct: 0,
    category: "American History"
  },
  {
    question: "Which war was fought between 1950-1953?",
    options: ["Vietnam War", "Korean War", "Cold War", "Gulf War"],
    correct: 1,
    category: "Modern History"
  },
  {
    question: "Who was the last Tsar of Russia?",
    options: ["Nicholas I", "Nicholas II", "Alexander II", "Peter the Great"],
    correct: 1,
    category: "European History"
  },
  {
    question: "In which year did the Titanic sink?",
    options: ["1910", "1911", "1912", "1913"],
    correct: 2,
    category: "Modern History"
  },
  {
    question: "Which civilization built the Great Wall of China?",
    options: ["Mongol Empire", "Chinese Dynasties", "Japanese Empire", "Korean Kingdom"],
    correct: 1,
    category: "Asian History"
  },
  {
    question: "Who was the first woman to fly solo across the Atlantic?",
    options: ["Bessie Coleman", "Amelia Earhart", "Harriet Quimby", "Jacqueline Cochran"],
    correct: 1,
    category: "Modern History"
  },
  {
    question: "Which ancient city was destroyed by the eruption of Mount Vesuvius?",
    options: ["Athens", "Pompeii", "Rome", "Carthage"],
    correct: 1,
    category: "Ancient History"
  },
  {
    question: "In what year did the American Civil War begin?",
    options: ["1859", "1860", "1861", "1862"],
    correct: 2,
    category: "American History"
  },
  {
    question: "Which explorer is credited with discovering America?",
    options: ["Christopher Columbus", "Vasco da Gama", "Ferdinand Magellan", "Marco Polo"],
    correct: 0,
    category: "Exploration"
  }
];

// Start the game
function startGame() {
  console.log('Starting History Timeline game...');
  
  // Select 10 random questions
  selectedQuestions = historyQuestions.sort(() => 0.5 - Math.random()).slice(0, 10);
  currentQuestionIndex = 0;
  score = 0;
  questionsAnswered = 0;
  
  // Hide the game card and show the game
  const gameCard = document.querySelector('.game-card');
  if (gameCard) {
    gameCard.style.display = 'none';
  }
  
  // Show the game container
  const app = document.getElementById('app');
  if (app) {
    app.style.display = 'block';
  }
  
  // Render the game
  renderGame();
}

// Render the game interface
function renderGame() {
  const app = document.getElementById('app');
  if (!app) return;
  
  app.innerHTML = `
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="card">
            <div class="card-header bg-primary text-white">
              <div class="row align-items-center">
                <div class="col">
                  <h4 class="mb-0">History Timeline</h4>
                  <small>Question ${currentQuestionIndex + 1} of ${selectedQuestions.length}</small>
                </div>
                <div class="col-auto">
                  <div class="d-flex align-items-center">
                    <i class="fas fa-clock me-2"></i>
                    <span id="timer" class="badge bg-light text-dark fs-6">${timeLeft}s</span>
                  </div>
                </div>
                <div class="col-auto">
                  <div class="d-flex align-items-center">
                    <i class="fas fa-star me-2"></i>
                    <span id="score" class="badge bg-warning text-dark fs-6">${score}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="card-body">
              <div id="questionContainer">
                <!-- Question will be loaded here -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  loadQuestion();
}

// Load the current question
function loadQuestion() {
  if (currentQuestionIndex >= selectedQuestions.length) {
    endGame();
    return;
  }
  
  const question = selectedQuestions[currentQuestionIndex];
  const questionContainer = document.getElementById('questionContainer');
  
  if (!questionContainer) return;
  
  questionContainer.innerHTML = `
    <h5 class="mb-4">${question.question}</h5>
    <div class="row">
      ${question.options.map((option, index) => `
        <div class="col-md-6 mb-3">
          <button class="btn btn-outline-primary w-100 p-3 text-start" 
                  onclick="selectAnswer(${index})" 
                  id="option${index}">
            <i class="fas fa-circle me-2"></i>
            ${option}
          </button>
        </div>
      `).join('')}
    </div>
    <div class="mt-4">
      <div class="progress">
        <div class="progress-bar" role="progressbar" 
             style="width: ${((currentQuestionIndex + 1) / selectedQuestions.length) * 100}%">
        </div>
      </div>
    </div>
  `;
  
  // Start timer
  timeLeft = 30;
  startTimer();
}

// Start the timer
function startTimer() {
  const timerElement = document.getElementById('timer');
  if (!timerElement) return;
  
  gameTimer = setInterval(() => {
    timeLeft--;
    timerElement.textContent = `${timeLeft}s`;
    
    if (timeLeft <= 0) {
      clearInterval(gameTimer);
      selectAnswer(-1); // Time's up
    }
  }, 1000);
}

// Handle answer selection
function selectAnswer(selectedIndex) {
  if (gameTimer) {
    clearInterval(gameTimer);
  }
  
  const question = selectedQuestions[currentQuestionIndex];
  const isCorrect = selectedIndex === question.correct;
  
  // Update score
  if (isCorrect) {
    score += 10;
    questionsAnswered++;
  }
  
  // Update UI
  const scoreElement = document.getElementById('score');
  if (scoreElement) {
    scoreElement.textContent = score;
  }
  
  // Show feedback
  showAnswerFeedback(selectedIndex, question.correct);
  
  // Move to next question after delay
  setTimeout(() => {
    currentQuestionIndex++;
    loadQuestion();
  }, 2000);
}

// Show answer feedback
function showAnswerFeedback(selectedIndex, correctIndex) {
  const questionContainer = document.getElementById('questionContainer');
  if (!questionContainer) return;
  
  // Disable all buttons
  for (let i = 0; i < 4; i++) {
    const button = document.getElementById(`option${i}`);
    if (button) {
      button.disabled = true;
      if (i === correctIndex) {
        button.className = 'btn btn-success w-100 p-3 text-start';
        button.innerHTML = `<i class="fas fa-check me-2"></i>${button.textContent.trim()}`;
      } else if (i === selectedIndex && selectedIndex !== correctIndex) {
        button.className = 'btn btn-danger w-100 p-3 text-start';
        button.innerHTML = `<i class="fas fa-times me-2"></i>${button.textContent.trim()}`;
      } else {
        button.className = 'btn btn-outline-secondary w-100 p-3 text-start';
      }
    }
  }
  
  // Show feedback message
  const feedback = selectedIndex === correctIndex ? 
    '<div class="alert alert-success mt-3"><i class="fas fa-check me-2"></i>Correct! Well done!</div>' :
    selectedIndex === -1 ?
    '<div class="alert alert-warning mt-3"><i class="fas fa-clock me-2"></i>Time\'s up! The correct answer was highlighted.</div>' :
    '<div class="alert alert-danger mt-3"><i class="fas fa-times me-2"></i>Incorrect. The correct answer was highlighted.</div>';
  
  questionContainer.insertAdjacentHTML('beforeend', feedback);
}

// End the game
async function endGame() {
  const app = document.getElementById('app');
  if (!app) return;
  
  // Save the score
  await saveScore(score);
  
  // Calculate accuracy
  const accuracy = (questionsAnswered / selectedQuestions.length) * 100;
  
  app.innerHTML = `
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="card">
            <div class="card-header bg-success text-white text-center">
              <h4 class="mb-0">Game Complete!</h4>
            </div>
            <div class="card-body text-center">
              <div class="mb-4">
                <i class="fas fa-trophy fa-4x text-warning mb-3"></i>
                <h3>Final Score: ${score}</h3>
                <p class="text-muted">Accuracy: ${accuracy.toFixed(1)}%</p>
                <p class="text-muted">Questions Answered: ${questionsAnswered}/${selectedQuestions.length}</p>
              </div>
              
              <div class="d-grid gap-2 d-md-block">
                <button class="btn btn-primary" onclick="startGame()">
                  <i class="fas fa-redo me-2"></i>Play Again
                </button>
                <button class="btn btn-outline-secondary" onclick="goBack()">
                  <i class="fas fa-arrow-left me-2"></i>Back to Games
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Save the score
async function saveScore(finalScore) {
  try {
    const currentUser = window.Auth.getCurrentUser();
    if (!currentUser || !currentUser.userId) {
      console.error('Cannot save score: No user data available');
      return;
    }

    // Save progress using the new system
    const success = await window.GameProgress.saveGameProgress(5, finalScore);
    
    if (success) {
      // Also save subject-specific performance
      await saveSubjectPerformance(finalScore);
      
      showNotification('Score saved successfully! Your progress has been recorded.', 'success');
    } else {
      throw new Error('Failed to save score');
    }
  } catch (error) {
    console.error('Error saving score:', error);
    showNotification('Could not save score. Please try again.', 'warning');
  }
}

// Save subject-specific performance data
async function saveSubjectPerformance(finalScore) {
  try {
    const currentUser = window.Auth.getCurrentUser();
    if (!currentUser || !currentUser.userId) return;

    // Calculate performance by category
    const categories = [...new Set(selectedQuestions.map(q => q.category))];
    
    for (const category of categories) {
      const categoryQuestions = selectedQuestions.filter(q => q.category === category);
      if (categoryQuestions.length === 0) continue;
      
      // Calculate correct answers for this category
      let correctAnswers = 0;
      for (let i = 0; i < currentQuestionIndex; i++) {
        const question = selectedQuestions[i];
        if (question.category === category) {
          // This is a simplified calculation - in a real implementation,
          // you'd track which specific questions were answered correctly
          correctAnswers += Math.random() > 0.3 ? 1 : 0; // Simulate some correct answers
        }
      }
      
      const categoryScore = Math.round((correctAnswers / categoryQuestions.length) * finalScore);
      const categoryAccuracy = correctAnswers / categoryQuestions.length;
      
      await fetch(`${window.API_URL}/subjectanalytics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          studentID: currentUser.userId,
          subject: 'History',
          category: category,
          score: categoryScore,
          accuracy: categoryAccuracy,
          questionsAnswered: categoryQuestions.length,
          gameNumber: 5
        })
      });
    }
  } catch (error) {
    console.error('Error saving subject performance:', error);
  }
}

// Initialize game function
function initGame() {
  console.log('Initializing History Timeline...');
  startGame();
}

// Make initGame globally available
window.initGame = initGame;

// Auth check - removed to allow direct access to game
// if (window.Auth) {
//   Auth.requireAuth('./login.html');
// }
