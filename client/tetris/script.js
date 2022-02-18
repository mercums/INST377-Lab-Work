/* eslint-disable no-trailing-spaces */
/* eslint-disable no-use-before-define */
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid');
  let squares = Array.from(document.querySelectorAll('.grid div'));
  const scoreDisplay = document.querySelector('#score');
  const startBtn = document.querySelector('#start-button');
  const width = 10;
  let nextRandom = 0;
  let timerId;
  let score = 0;

  const colors = [
    'orange',
    'red',
    'purple',
    'green',
    'blue'
  ]

  // The Tetriminos
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
      squares[currentPosition + index].style.backgroundColor = colors[random];

    })
  }

  function undraw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('tetrimino');
      squares[currentPosition + index].style.backgroundColor = ''
    })
  }

  // make the tetrimino move down ever second
  // timerId = setInterval(moveDown, 1000);

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
      addScore();
      gameOver();
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
  const displayIndex = 0;

  // the tetriminos without rotations
  const upNextTetriminoes = [
    [1, displayWidth+1, displayWidth*2+1, 2], // lTetrimino
    [0, displayWidth, displayWidth+1, displayWidth*2+1], // zTetrimino
    [1, displayWidth+1, displayWidth, displayWidth+2],  // tTetrimino
    [0, displayWidth, 1, displayWidth+1], // oTetrimino 
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] // iTetrimino
  ];

  // display the shape in the mini-grid display
  function displayShape() {
    // remove any trace of a tetrimino from the entire mini grid
    displaySquares.forEach(square => {
      square.classList.remove('tetrimino');
      square.style.backgroundColor = '';
    })
    upNextTetriminoes[nextRandom].forEach(index => {
      displaySquares[displayIndex + index].classList.add('tetrimino');
      displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom];
    })
  }

  // add button functionality
  startBtn.addEventListener('click', () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    } else {
      draw();
      timerId = setInterval(moveDown, 1000);
      nextRandom = Math.floor(Math.random()*theTetriminos.length);
      displayShape();
    }
  })

  // add score
  function addScore() {
    for (let i = 0; i <199; i += width) {
      const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];
      
      if (row.every(index => squares[index].classList.contains('taken'))) {
        score += 10;
        scoreDisplay.innerHTML = score;
        row.forEach(index => {
          squares[index].classList.remove('taken');
          squares[index].classList.remove('tetrimino');
          squares[index].style.backgroundColor = '';
        })
        const squaresRemoved = squares.splice(i, width);
        squares = squaresRemoved.concat(squares);
        squares.forEach(cell => grid.appendChild(cell ))
      }
    }
  }

  // game over
  function gameOver() {
    if(current.some(index => squares[currentPosition+index].classList.contains('taken'))) {
      scoreDisplay.innerHTML = 'end';
      clearInterval(timerId);
    }
  }
})