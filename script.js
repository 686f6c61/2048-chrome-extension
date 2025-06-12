// 2048 Chrome Extension - Lógica principal del juego
// Autor: 686f6c61
// Descripción: Implementa la mecánica de 2048 y la integración con los controles de dificultad.
// Fecha: 2025-06-12

const gridContainer = document.getElementById("grid-container");
const scoreSpan = document.getElementById("score-value");
const restartButton = document.getElementById("restart");
const modeSelect = document.getElementById("mode");

let grid;
let score;

let spawnChances = {
  facil: 0.95, // 95% 2s, 5% 4s
  medio: 0.9,  // default
  dificil: 0.8,
  muy_dificil: 0.7,
};

function init() {
  grid = Array.from({ length: 4 }, () => Array(4).fill(0));
  score = 0;
  scoreSpan.textContent = score;
  addRandomTile();
  addRandomTile();
  render();
}

function addRandomTile() {
  const emptyTiles = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (grid[r][c] === 0) emptyTiles.push({ r, c });
    }
  }
  if (emptyTiles.length === 0) return;
  const { r, c } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
  const chance = spawnChances[modeSelect.value];
  grid[r][c] = Math.random() < chance ? 2 : 4;
}

function render() {
  gridContainer.innerHTML = "";
  grid.flat().forEach((value) => {
    const tile = document.createElement("div");
    tile.className = `tile tile-${value}`;
    tile.textContent = value === 0 ? "" : value;
    gridContainer.appendChild(tile);
  });
  scoreSpan.textContent = score;
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
  return [...arr.filter((v) => v), ...Array(4 - arr.filter((v) => v).length).fill(0)];
}

function rotateClockwise(mat) {
  return mat[0].map((_, i) => mat.map((row) => row[i]).reverse());
}

function rotateCounterClockwise(mat) {
  return mat[0].map((_, i) => mat.map((row) => row[row.length - 1 - i]));
}

function move(dir) {
  let oldGrid = JSON.stringify(grid);
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
  if (oldGrid !== JSON.stringify(grid)) {
    addRandomTile();
    render();
  }
}

document.addEventListener("keydown", (e) => {
  if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
    move(e.key.replace("Arrow", ""));
  }
});

restartButton.addEventListener("click", init);
modeSelect.addEventListener("change", () => {
  init();
});

init();
