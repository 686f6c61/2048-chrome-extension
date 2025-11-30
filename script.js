/**
 * 2048 Chrome Extension - Lógica principal del juego
 *
 * @author 686f6c61
 * @version 2.0
 * @description Implementación completa del juego 2048 con características modernas:
 *              - Sistema de deshacer
 *              - Persistencia de estadísticas
 *              - Modo oscuro
 *              - Selector de dificultad
 *              - Accesibilidad completa
 *
 * @repository https://github.com/686f6c61/2048-chrome-extension
 * @license MIT
 * @created 2025-06-12
 * @updated 2025-11-18
 */

// ============ CONSTANTES ============
const GRID_SIZE = 4;
const WIN_TILE = 2048;
const CONFETTI_COUNT = 100;
const ANIMATION_DURATION = 3000;

// ============ ELEMENTOS DEL DOM ============
const gridContainer = document.getElementById("grid-container");
const scoreSpan = document.getElementById("score-value");
const restartButton = document.getElementById("restart");
const modeButtons = document.querySelectorAll(".mode-btn");
const winOverlay = document.getElementById("win-overlay");
const newGameBtn = document.getElementById("new-game");
const gameoverOverlay = document.getElementById("gameover-overlay");
const restartGameBtn = document.getElementById("restart-game");
const finalScoreSpan = document.getElementById("final-score");
const darkModeToggle = document.getElementById("dark-mode-toggle");
const undoBtn = document.getElementById("undo-btn");

// Estadísticas
const gamesPlayedSpan = document.getElementById("games-played");
const bestScoreSpan = document.getElementById("best-score");
const bestTileSpan = document.getElementById("best-tile");

// ============ VARIABLES GLOBALES ============
let grid;
let score;
let moveHistory = []; // Para funcionalidad de deshacer
let hasWon = false; // Para evitar múltiples overlay de victoria
let currentMode = 'medio'; // Modo actual

let spawnChances = {
  facil: 0.95, // 95% 2s, 5% 4s
  medio: 0.9,  // default
  dificil: 0.8,
  muy_dificil: 0.7,
};

// ============ GESTIÓN DE PERSISTENCIA ============

/**
 * Carga las estadísticas desde localStorage
 * @returns {Object} Objeto con estadísticas { gamesPlayed, bestScore, bestTile }
 */
function loadStats() {
  const stats = JSON.parse(localStorage.getItem('2048-stats') || '{"gamesPlayed":0,"bestScore":0,"bestTile":0}');
  gamesPlayedSpan.textContent = stats.gamesPlayed;
  bestScoreSpan.textContent = stats.bestScore;
  bestTileSpan.textContent = stats.bestTile;
  return stats;
}

/**
 * Guarda las estadísticas en localStorage y actualiza la UI
 * @param {Object} stats - Objeto con las estadísticas a guardar
 */
function saveStats(stats) {
  localStorage.setItem('2048-stats', JSON.stringify(stats));
  gamesPlayedSpan.textContent = stats.gamesPlayed;
  bestScoreSpan.textContent = stats.bestScore;
  bestTileSpan.textContent = stats.bestTile;
}

/**
 * Actualiza las estadísticas al finalizar una partida
 * Incrementa contador de partidas y actualiza récords si es necesario
 */
function updateStatsOnGameEnd() {
  const stats = loadStats();
  stats.gamesPlayed++;
  if (score > stats.bestScore) {
    stats.bestScore = score;
  }
  const maxTile = Math.max(...grid.flat());
  if (maxTile > stats.bestTile) {
    stats.bestTile = maxTile;
  }
  saveStats(stats);
}

/**
 * Carga la preferencia de modo oscuro desde localStorage
 * @returns {boolean} true si el modo oscuro está activado
 */
function loadDarkMode() {
  const isDark = localStorage.getItem('2048-darkMode') === 'true';
  if (isDark) {
    document.body.classList.add('dark-mode');
  }
  return isDark;
}

/**
 * Alterna entre modo claro y oscuro y persiste la preferencia
 */
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('2048-darkMode', isDark);
}

// ============ UTILIDADES ============

/**
 * Crea una copia profunda de un array 2D
 * @param {Array<Array>} arr - Array bidimensional a clonar
 * @returns {Array<Array>} Copia profunda del array
 */
function deepClone(arr) {
  return arr.map(row => [...row]);
}

/**
 * Inicializa un nuevo juego
 * Resetea el grid, score, historial y genera 2 tiles iniciales
 */
function init() {
  grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
  score = 0;
  moveHistory = [];
  hasWon = false;
  scoreSpan.textContent = score;
  undoBtn.disabled = true;
  addRandomTile();
  addRandomTile();
  render();
}

/**
 * Añade un tile aleatorio (2 o 4) en una posición vacía del grid
 * La probabilidad de generar 2 vs 4 depende del nivel de dificultad
 */
function addRandomTile() {
  const emptyTiles = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === 0) emptyTiles.push({ r, c });
    }
  }
  if (emptyTiles.length === 0) return;
  const { r, c } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
  const chance = spawnChances[currentMode];
  grid[r][c] = Math.random() < chance ? 2 : 4;
}

/**
 * Cambia el modo de dificultad y reinicia el juego
 * @param {string} mode - Modo de dificultad: 'facil' | 'medio' | 'dificil' | 'muy_dificil'
 */
function setMode(mode) {
  currentMode = mode;
  // Actualizar botones activos
  modeButtons.forEach(btn => {
    if (btn.dataset.mode === mode) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  init();
}

/**
 * Renderiza el grid en el DOM
 * Crea elementos para cada tile, añade atributos ARIA y verifica condición de victoria
 */
function render() {
  const prevScore = parseInt(scoreSpan.textContent) || 0;

  gridContainer.textContent = ""; // Más seguro que innerHTML
  grid.flat().forEach((value, index) => {
    const tile = document.createElement("div");
    tile.className = `tile tile-${value}`;
    tile.textContent = value === 0 ? "" : value;

    // Accesibilidad: añadir atributos ARIA
    if (value !== 0) {
      tile.setAttribute('role', 'gridcell');
      tile.setAttribute('aria-label', `Ficha con valor ${value}`);
    }

    gridContainer.appendChild(tile);
  });

  scoreSpan.textContent = score;

  // Animación cuando el score cambia
  if (score > prevScore) {
    scoreSpan.classList.add('score-change');
    setTimeout(() => scoreSpan.classList.remove('score-change'), 300);
  }

  // Check win condition
  if (!hasWon && grid.flat().includes(WIN_TILE)) {
    hasWon = true;
    showWin();
  }
}

function slide(row) {
  const arr = row.filter((v) => v);
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) {
      arr[i] *= 2;
      score += arr[i];
      arr[i + 1] = 0;
    }
  }
  const filtered = arr.filter((v) => v);
  return [...filtered, ...Array(GRID_SIZE - filtered.length).fill(0)];
}

function rotateClockwise(mat) {
  return mat[0].map((_, i) => mat.map((row) => row[i]).reverse());
}

function rotateCounterClockwise(mat) {
  return mat[0].map((_, i) => mat.map((row) => row[row.length - 1 - i]));
}

function hasMoves() {
  // Comprueba si existe al menos un cero o fichas adyacentes iguales
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === 0) return true;
      if (c < GRID_SIZE - 1 && grid[r][c] === grid[r][c + 1]) return true;
      if (r < GRID_SIZE - 1 && grid[r][c] === grid[r + 1][c]) return true;
    }
  }
  return false;
}

function gridsAreEqual(grid1, grid2) {
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid1[r][c] !== grid2[r][c]) return false;
    }
  }
  return true;
}

function saveState() {
  moveHistory.push({
    grid: deepClone(grid),
    score: score
  });
  // Limitar historial a 10 movimientos
  if (moveHistory.length > 10) {
    moveHistory.shift();
  }
  undoBtn.disabled = false;
}

function undo() {
  if (moveHistory.length === 0) return;
  const prevState = moveHistory.pop();
  grid = prevState.grid;
  score = prevState.score;
  render();
  undoBtn.disabled = moveHistory.length === 0;
}

function move(dir) {
  const oldGrid = deepClone(grid);
  const oldScore = score;

  switch (dir) {
    case "Left":
      grid = grid.map(slide);
      break;
    case "Right":
      grid = grid.map((row) => slide(row.reverse()).reverse());
      break;
    case "Up":
      grid = rotateCounterClockwise(grid);
      grid = grid.map(slide);
      grid = rotateClockwise(grid);
      break;
    case "Down":
      grid = rotateClockwise(grid);
      grid = grid.map(slide);
      grid = rotateCounterClockwise(grid);
      break;
  }

  if (!gridsAreEqual(oldGrid, grid)) {
    // Guardar estado anterior para deshacer
    saveState();
    moveHistory[moveHistory.length - 1] = { grid: oldGrid, score: oldScore };

    addRandomTile();
    render();

    // Verificar si quedan movimientos
    if (!hasMoves()) {
      setTimeout(() => {
        showGameOver();
      }, 300);
    }
  }
}

function showGameOver() {
  finalScoreSpan.textContent = score;
  gameoverOverlay.classList.remove("hidden");
  updateStatsOnGameEnd();
}

function showWin() {
  winOverlay.classList.remove("hidden");
  launchConfetti();
  updateStatsOnGameEnd();
}

function launchConfetti() {
  for (let i = 0; i < CONFETTI_COUNT; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    confetti.style.left = Math.random() * 100 + "%";
    confetti.style.setProperty("--c", `hsl(${Math.random()*360}, 70%, 60%)`);
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), ANIMATION_DURATION);
  }
}

// ============ EVENT LISTENERS ============
document.addEventListener("keydown", (e) => {
  // Prevenir movimientos accidentales con teclas modificadoras
  if (e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) return;

  if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
    e.preventDefault(); // Prevenir scroll de la página
    move(e.key.replace("Arrow", ""));
  }
});

restartButton.addEventListener("click", init);

// Event listeners para botones de modo
modeButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    setMode(btn.dataset.mode);
  });
});

newGameBtn.addEventListener("click", () => {
  winOverlay.classList.add("hidden");
  init();
});

restartGameBtn.addEventListener("click", () => {
  gameoverOverlay.classList.add("hidden");
  init();
});

darkModeToggle.addEventListener("click", toggleDarkMode);

undoBtn.addEventListener("click", undo);

// ============ INICIALIZACIÓN ============
loadDarkMode();
loadStats();
init();
