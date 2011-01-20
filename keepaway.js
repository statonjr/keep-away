var TT = {};

TT.setup = function() {
  
  var board = document.getElementById("board");
  TT.boardWidth = board.clientWidth;
  TT.boardHeight = window.screen.availHeight * 0.6;
  
  TT.drawPieces();

  TT.moving = 0;
  TT.touch = 0;
  TT.gametime = 0; 
  TT.started = 0;
  TT.speed;
  TT.starttime;
  TT.endtime;
  TT.finaltime = 0;
  TT.clockValue = 0.0;
  TT.enemyxdir = new Array(1,1,1,1);
  TT.enemyydir = new Array(1,1,1,1);

};

TT.drawPieces = function() {
  var paper = Raphael("board",TT.boardWidth,TT.boardHeight);
  paper.safari(); // Handle rendering bug
  
  var player = paper.rect(TT.boardWidth * 0.50, TT.boardHeight * 0.50,40,40);
  player.attr("fill", "rgb(255,0,0)");
  player.node.id = "player";
  player.mousedown(function(evt){
    TT.start(evt);
    var board = document.getElementById("board");
    board.addEventListener("mousemove", function(evt){
      if (TT.moving === 1) {
        player.node.setAttribute("x", evt.offsetX);
        player.node.setAttribute("y", evt.offsetY);
      }
    }, false);
  });
  
  var enemy0 = paper.rect(TT.boardWidth * 0.10, TT.boardHeight * 0.10, 120, 30);
  enemy0.attr("fill", "#000");
  enemy0.node.id = "enemy0";
  var enemy1 = paper.rect(TT.boardWidth * 0.18, TT.boardHeight * 0.83, 60, 60);
  enemy1.attr("fill", "#000");
  enemy1.node.id = "enemy1";
  var enemy2 = paper.rect(TT.boardWidth * 0.75, TT.boardHeight * 0.70, 40, 140);
  enemy2.attr("fill", "#000");
  enemy2.node.id = "enemy2";
  var enemy3 = paper.rect(TT.boardWidth * 0.70, TT.boardHeight * 0.22, 90, 60);
  enemy3.attr("fill", "#000");
  enemy3.node.id = "enemy3";
};

TT.startClock = function() {
  var today = new Date(); 
  TT.starttime = today.getTime();
  TT.updateClock();
};

TT.updateClock = function() {
  var time = parseFloat(document.getElementsByClassName("timer")[0].textContent, 10);
  console.log(time);
  if (TT.moving === 1) {
    time += 0.1;
    document.getElementsByClassName("timer")[0].textContent = Math.round(time * Math.pow(10,2))/Math.pow(10,2);
    setTimeout("TT.updateClock()", 100);
  }
}

TT.endClock = function() {
  var today = new Date(); 
  TT.endtime = today.getTime();
};

TT.calctime = function() {
  return (TT.endtime - TT.starttime - 0)/1000;
};

TT.giveposX = function(obj) {
  return parseInt(document.getElementById(obj).getAttribute("x"), 10);
};

TT.giveposY = function(obj) {
  return parseInt(document.getElementById(obj).getAttribute("y"), 10);
};

TT.setposX = function(obj, xpos) {
  document.getElementById(obj).setAttribute("x", xpos);
};

TT.setposY = function(obj, ypos) {
  document.getElementById(obj).setAttribute("y", ypos);
};

TT.givesize = function(obj, dimension) {
  var size = 0;
  if (dimension == 'y') {
    size = parseInt(document.getElementById(obj).getAttribute("height"), 10);
  }
  else if (dimension == 'x') {
    size = parseInt(document.getElementById(obj).getAttribute("width"), 10);
  }

  return size;
};

// check to see if 'player' is touching 'enemy' or wall
TT.checktouching = function(num) {

  var enemy = "enemy" + num + "";
  var difX = TT.giveposX('player') - TT.giveposX(enemy) - 0;
  var difY = TT.giveposY('player') - TT.giveposY(enemy) - 0;

  // set touch = 1 if it is touching an enemy
  if (difX > (-1 * TT.givesize('player', 'x')) && 
      difX < TT.givesize(enemy, 'x') && 
      difY > (-1 * TT.givesize('player', 'y')) && 
      difY < TT.givesize(enemy, 'y')) {
    TT.touch = 1;
  } else {
    TT.touch = 0;
  }
  
  if (TT.moving === 1 && TT.touch === 0) {
    var gameBoard = document.getElementById("board");
    if (TT.giveposX("player") > TT.boardWidth - TT.givesize("player", "x") ||
        TT.giveposY("player") > TT.boardHeight - TT.givesize("player", "y") ||
        TT.giveposX("player") <= 0 ||
        TT.giveposY("player") <= 0) {
          TT.touch = 1;
        } else {
          TT.touch = 0;
        }
  }

};

TT.moveEnemy = function(num,step_x,step_y) {

  var enemy = "enemy" + num + "";
  var enemyXPosition = TT.givesize(enemy, 'x');
  var enemyYPosition = TT.givesize(enemy, 'y');

  if (TT.giveposX(enemy) >= (TT.boardWidth - enemyXPosition) || TT.giveposX(enemy) <= 0) {
    TT.enemyxdir[num] = -1 * TT.enemyxdir[num];
  }
  if (TT.giveposY(enemy) >= (TT.boardHeight - enemyYPosition) || TT.giveposY(enemy) <= 0) {
    TT.enemyydir[num] = -1 * TT.enemyydir[num];
  }

  var newposx = TT.giveposX(enemy) + (step_x*TT.enemyxdir[num]) + 0;
  var newposy = TT.giveposY(enemy) + (step_y*TT.enemyydir[num]) + 0;

  if (TT.moving === 1) {
    TT.setposX(enemy, newposx);
    TT.setposY(enemy, newposy);
  }

  TT.checktouching(num + "");
  if (TT.touch === 1) {
    TT.stop(); 
    TT.reset();
  }
};

TT.moveEnemies = function() {

  TT.gametime += 1;

  if (TT.gametime >= 0 && TT.gametime < 100) TT.speed = 80;
  else if (TT.gametime >= 100 &&  TT.gametime < 200) TT.speed = 60;
  else if (TT.gametime >= 200 &&  TT.gametime < 300) TT.speed = 40;
  else if (TT.gametime >= 300 &&  TT.gametime < 400) TT.speed = 30;
  else if (TT.gametime >= 400 &&  TT.gametime < 500) TT.speed = 20;
  else TT.speed = 10;

  TT.moveEnemy(0,-10,12);
  TT.moveEnemy(1,-12,-20);
  TT.moveEnemy(2,15,-13);
  TT.moveEnemy(3,17,11);

  setTimeout(TT.moveEnemies,TT.speed);
};

TT.start = function(evt) {

  if (TT.started == 0) { 
    TT.moving = 1;
    TT.moveEnemies();
    TT.startClock();
    TT.started = 1;
  }

};

TT.stop = function(e) {
  TT.moving = 0;
};

TT.reset = function(e) {
  
  TT.endClock();
  TT.moving = 0;

  if (TT.finaltime === 0) {
    TT.finaltime = TT.calctime();
    console.log('You survived ' + TT.finaltime + ' seconds !');
  }
};

window.addEventListener('load', TT.setup, false);
