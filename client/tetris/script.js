document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid');
  let squares = Array.from(document.querySelectorAll('.grid div'));
  const ScoreDisplay = document.querySelector('#score');
  const StartBtn = document.querySelector('#start-button');
  const width = 10;

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
      random = Math.floor(Math.random() * theTetriminos.length);
      current = theTetriminos[random][currentRotation];
      currentPosition = 4;
      draw();
    }
  }
})