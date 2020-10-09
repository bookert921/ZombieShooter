/* Create Title of Game */
const title = document.createElement('h1');
title.setAttribute('class', 'title');
title.innerHTML = "Zombie Shooter";
document.body.appendChild(title);

/* Create Score */
const resultDisplay = document.createElement('h3');
document.body.appendChild(resultDisplay);
const score = document.createElement('span');
score.setAttribute('id', 'result');
resultDisplay.innerHTML = 'Score: ';
resultDisplay.appendChild(score);
document.body.querySelector('#result');
let result = 0;

/* Create Container for Grid */
const createContainer = document.createElement('div');
createContainer.setAttribute('class', 'square');
document.body.appendChild(createContainer);

function startGame() {
// Remove Option to Click Start Repeatedly (Glitch the Game) - Replace with Restart Button
  startButton.removeEventListener('click', startGame);
  startButton.style.display = 'none';
  const restart = document.createElement('button');
  restart.setAttribute('class', 'restart');
  restart.innerHTML = "Restart Game";
  document.body.appendChild(restart);
  restart.addEventListener('click', function () {
    location.reload();
    return false;
  });

  /* Create Grid */
  for (let index = 0; index < 225; index++) {
    const createGrid = document.createElement('div');
    createGrid.setAttribute('class', 'box');
    createContainer.appendChild(createGrid);
  }

  /* Set Grid Boxes to a Variable */
  const gridSquares = document.querySelectorAll('.square div');

  /* Position Zombies on Grid */
  let currentZombieIndex = 0;
  const zombiePosition = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    15,16,17,18,19,20,21,22,23,24,
    30,31,32,33,34,35,36,37,38,39
  ];
  zombiePosition.forEach(zombie => gridSquares[currentZombieIndex + zombie].classList.add('zombie'));
  let zombieKilled = [];
  let zombieId;

  /* Position Shooter */
  let currentShooterIndex = 202;

  /* Define Width and Direction for Pieces to Move */
  let direction = 1;
  let width = 15;

  /* Move Shooter Along Width*/
  gridSquares[currentShooterIndex].classList.add('shooter');
    function moveShooter(e) {
    gridSquares[currentShooterIndex].classList.remove('shooter');
    switch(e.keyCode) {
      case 37:
        if(currentShooterIndex % width !== 0) currentShooterIndex--;
        break;
      case 39:
        if(currentShooterIndex % width < width - 1) currentShooterIndex++;
        break;
    }
    gridSquares[currentShooterIndex].classList.add('shooter');
  }
  document.addEventListener('keydown', moveShooter);

  //Move Zombies Down the Grid
  function moveZombies(e) {
    const leftEdge = zombiePosition[0] % width === 0;
    const rightEdge = zombiePosition[zombiePosition.length - 1] % width === width - 1;

      if((leftEdge && direction === -1) || (rightEdge && direction === 1)){
        direction = width;
      } else if (direction === width) {
      if (leftEdge) direction = 1;
      else direction = -1;
      }
      for (let i = 0; i <= zombiePosition.length - 1; i++) {
        gridSquares[zombiePosition[i]].classList.remove('zombie');
      }
      for (let i = 0; i <= zombiePosition.length - 1; i++) {
        zombiePosition[i] += direction;
      }
      for (let i = 0; i <= zombiePosition.length - 1; i++) {
        if (!zombieKilled.includes(i)){
          gridSquares[zombiePosition[i]].classList.add('zombie');
        }
      }

  /* Ending the Game: Lose */
  /* For Collision */
    if(gridSquares[currentShooterIndex].classList.contains('zombie', 'shooter')) {
      resultDisplay.textContent = 'You Died... Horribly...';
      gridSquares[currentShooterIndex].classList.add('boom');
      clearInterval(zombieId);
      document.removeEventListener('keydown', shoot);
      document.removeEventListener('keydown', moveShooter);
    }
  /* For Zombies Reaching the End */
    for (let i = 0; i <= zombiePosition.length - 1; i++){
      if(zombiePosition[i] > (gridSquares.length - (width -1))){
        resultDisplay.textContent = 'You Died... Horribly...';
        clearInterval(zombieId);
        document.removeEventListener('keydown', shoot);
        document.removeEventListener('keydown', moveShooter);
      }
    }

  /* Ending the Game: Win */
    if(zombieKilled.length === zombiePosition.length) {
      console.log(zombieKilled.length);
      console.log(zombiePosition.length);
      resultDisplay.textContent = 'Hail to the King, Baby!';
      clearInterval(zombieId);
      document.removeEventListener('keydown', shoot);
      document.removeEventListener('keydown', moveShooter);
    }
  }
  zombieId = setInterval(moveZombies, 500);

  /* Shooting Zombies */
  function shoot(e) {
    let laserId;
    let currentLaserIndex = currentShooterIndex;

    function moveLaser() {
      gridSquares[currentLaserIndex].classList.remove('laser');
      currentLaserIndex -= width;
      gridSquares[currentLaserIndex].classList.add('laser');
  /* Tagging a Zombie */
      if(gridSquares[currentLaserIndex].classList.contains('zombie')) {
        // Remove Laser
        gridSquares[currentLaserIndex].classList.remove('laser');
        // Remove Zombie
        gridSquares[currentLaserIndex].classList.remove('zombie');
        // Boom!
        gridSquares[currentLaserIndex].classList.add('boom');

        setTimeout(() => gridSquares[currentLaserIndex].classList.remove('boom'), 250);
        clearInterval(laserId);

  /* For Every Zombie Dead (Again) */
        const dead = zombiePosition.indexOf(currentLaserIndex);
        zombieKilled.push(dead);
        result++;
        score.textContent = result;
      }

      if(currentLaserIndex < width) {
        clearInterval(laserId);
        setTimeout(() => gridSquares[currentLaserIndex].classList.remove('laser'), 100);
      }
    }

  /* Shoot Keybinding */
    switch(e.keyCode) {
      case 32:
        laserId = setInterval(moveLaser, 100);
        break;
    }
  }
  document.addEventListener('keydown', shoot);

}


/* Create Start Button */
const startButton = document.createElement('button');
startButton.setAttribute('class', 'startBtn');
startButton.innerHTML = 'Start Killin!';
document.body.appendChild(startButton);
startButton.addEventListener('click', startGame);
