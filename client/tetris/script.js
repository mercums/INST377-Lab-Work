document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid');
  let squares = Array.from(document.querySelectorAll('.grid div'));
  const ScoreDisplay = document.querySelector('#score');
  const StartBtn = document.querySelector('#start-button');
  const width = 10;
  let nextRandom = 0;
  //  console.log(squares); allows browser view of squares in an array

  //The Tetriminos
  const lTetriminos = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
  ];
  const zTetriminos = [
    [width+1, width+2, width*2, width*2+1],
    [0, width, width+1, width*2+1],
    [width+1, width+2, width*2, width*2+1],
    [0, width, width+1, width*2+1]
  ];
  const oTetriminos = [
    [0, width, 1, width+1],
    [0, width, 1, width+1],
    [0, width, 1, width+1],
    [0, width, 1, width+1]    
  ];
  const tTetriminos = [
    [1, width+1, width, width+2],
    [1, width+1, width*2+1, width+2],
    [width, width+1, width+2, width*2+1],
    [width, 1, width+1, width*2+1]
  ];
  const iTetriminos = [
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3],
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3]
  ];

  const theTetriminos = [lTetriminos, zTetriminos, tTetriminos, oTetriminos, iTetriminos];

  let currentPosition = 4;
  let currentRotation = 0;

  // select random tetrimino and it's first rotation
  let random = Math.floor(Math.random()*theTetriminos.length);
  // console.log(random);

  let current = theTetriminos[random][currentRotation];

  // draw the tetrimino
  function draw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.add('tetrimino');
    })
  }

  function undraw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('tetrimino');
    })
  }

  // make the tetrimino move down ever second
  timerId = setInterval(moveDown, 1000);

  // assign functin to keyCodes
  function control (e) {
    if (e.keyCode === 37) {
      moveLeft();
    } else if (e.keyCode === 39) {
      moveRight();
    } else if (e.keyCode === 38) {
      rotate();
    } else if (e.keyCode === 40) {
      moveDown();
    }
  }
  document.addEventListener('keyup', control)

  // move down function
  function moveDown() {
    undraw();
    currentPosition += width;
    draw();
    freeze();
  }

  // freeze function
  function freeze() {
    if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
      current.forEach(index => squares[currentPosition + index].classList.add('taken'));
      // start a new tetrimino falling
      random = nextRandom;
      nextRandom = Math.floor(Math.random() * theTetriminos.length);
      current = theTetriminos[random][currentRotation];
      currentPosition = 4;
      draw();
      displayShape();
    }
  }

  // move the tetrimino left, until there is an edge or a blockage

  function moveLeft() {
    undraw();
    const isAtLeftEdge = current.some(index => (currentPosition + index) % 10 === 0);

    if(!isAtLeftEdge) currentPosition -= 1;

    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition +=1;
    }

    draw();
  }

  function moveRight() {
    undraw();
    const isAtRightEdge = current.some(index => (currentPosition +index) % 10 === width-1);

    if (!isAtRightEdge) currentPosition +=1;

    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition -= 1;
    }
    draw();
  }

  // rotate the tetrimino
  function rotate() {
    undraw();
    currentRotation++;
    if (currentRotation === current.length) { // if the current rotation gets to 4, loop back to 0
      currentRotation = 0;
    }

    current = theTetriminos[random][currentRotation];
    draw();
  }

  // show up-next tetrimino in mini-grid
  const displaySquares = document.querySelectorAll('.mini-grid div');
  const displayWidth = 4;
  let displayIndex = 0;

  // the tetriminos without rotations
  const upNextTetriminoes = [
    [1, displayWidth+1, displayWidth*2+1, 2], // lTetrimino
    [0, displayWidth, displayWidth+1, displayWidth*2+1], // zTetrimino
    [0, displayWidth, 1, displayWidth+1], // oTetrimino 
    [1, displayWidth+1, displayWidth, displayWidth+2],  // tTetrimino
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] // iTetrimino
  ];

  // display the shape in the mini-grid display
  function displayShape() {
    // remove any trace of a tetrimino from the entire mini grid
    displaySquares.forEach(square => {
      square.classList.remove('tetrimino');
    })
    upNextTetriminoes[nextRandom].forEach(index => {
      displaySquares[displayIndex + index].classList.add('tetrimino');
    })
  }
})