const gameBoard = document.querySelector("#gameBoard");//its canvas for draw
const ctx = gameBoard.getContext("2d");//to paint on the canvas we have to getContext
const scoreText = document.querySelector("#scoreText");
const resetBtn = document.querySelector("#resetBtn");
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "white";
const snakeColor = "lightgreen";
const snakeBorder = "black";
const foodColor = "red";
const unitSize = 25;
let running = false;//we'll examine running to see if our game is currently running or not
let xVelocity = unitSize;/*xVelocity will be how far we move on the X-axis every single game tick. I will set this to be the unit size, we'll be moving 25px o the x-axis every game tick. 
If Velocity is a postive number, we'll move to the right,,if it's negative move to the left.*/
let yVelocity = 0;//That means we're not moving up or down. If we would like to move down, we would set this to unitSize,,if we would like to move up, we would set that to negative -unitSize let yVelocity = -unitSize;
let foodX;
let foodY;
let score = 0;
let snake = [
    {x:unitSize*4, y:0},
    {x:unitSize*3, y:0},
    {x:unitSize*2, y:0},
    {x:unitSize*1, y:0},
    {x:0, y:0}
];

window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame);

gameStart();
createFood();
drawFood();

function gameStart(){
    running = true;
    scoreText.textContent = score;
    createFood();
    drawFood();
    nextTick();//what we want to do every round. Every time we update the clock
};
function nextTick(){
    if(running){
        setTimeout(() =>{//after the right curly brace how often do we want a game tick to occur. Maybe 100 miliseconds
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
        }, 100);
    }
    else{
        displayGameOver();
    }
};
function clearBoard(){
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0,0, gameWidth, gameHeight);
};
function createFood(){
    function randomFood(min,max){
        const randNum = Math.round((Math.random() * (max-min) + min)/unitSize)*unitSize; //between 0 & (500-25=475) AND tam sayı olsun diye unitsize a bölünüp carpıldı
        return randNum;
    }
    foodX = randomFood(0, gameWidth - unitSize);
    foodY = randomFood(0, gameWidth - unitSize);
};
function drawFood(){
    ctx.fillStyle = foodColor;
    ctx.fillRect(foodX, foodY, unitSize, unitSize)//The fillRect() method draws a "filled" rectangle.
};
function moveSnake(){
    //create a new head of the snake in the direction that we're moving then eliminate the tail
    const head = {x: snake[0].x + xVelocity,// + xVelocity right, -xVelocity left.
                  y: snake[0].y + yVelocity};
//to add this new head to our snake, we can use the unshift method
    snake.unshift(head);
    //if food is eaten
    if(snake[0].x == foodX && snake[0].y == foodY){
        score+=1;
        scoreText.textContent = score;
        createFood();
    }
    else{//eliminate tail.
        snake.pop();
    }
};
function drawSnake(){
    ctx.fillStyle = snakeColor;
    ctx.strokeStyle = snakeBorder;
    snake.forEach(snakePart => {
        ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
        ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
    })
};
function changeDirection(event){
    const keyPressed = event.keyCode;
    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;//direction's code

    const goingUp = (yVelocity == -unitSize);//-unitsize mean movingup
    const goingDown = (yVelocity == unitSize);
    const goingRight = (xVelocity == unitSize);
    const goingLeft = (xVelocity == -unitSize);//these are boolean variable write switch

    switch(true){
        case(keyPressed == LEFT && !goingRight):
        xVelocity = -unitSize;
        yVelocity= 0;
        break;
        case(keyPressed == UP && !goingDown):
        xVelocity = 0;
        yVelocity= -unitSize;
        break;
        case(keyPressed == RIGHT && !goingLeft):
        xVelocity = unitSize;
        yVelocity= 0;
        break;
        case(keyPressed == DOWN && !goingUp):
        xVelocity = 0;
        yVelocity= unitSize;
        break;
    }
};
function checkGameOver(){
    switch(true){
        case(snake[0].x <0)://we went over the left border
        running= false;
        break;
        case(snake[0].x >= gameWidth):
        running= false;
        break;
        case(snake[0].y < 0):
        running= false;
        break;
        case(snake[0].y >= gameHeight):
        running= false;
        break;
    }
    for(let i = 1; i < snake.length; i+=1){//anybody parts of the snake overlap
        if(snake[i].x == snake[0].x && snake[i].y == snake[0].y){
            running= false;
        }
    }
};
function displayGameOver(){
    ctx.font = "50px MV Boli";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER!", gameWidth / 2, gameHeight / 2);
    running = false;
};
function resetGame(){
    score =0;
    xVelocity = unitSize;
    yVelocity =0;
    snake = [
        {x:unitSize*4, y:0},
        {x:unitSize*3, y:0},
        {x:unitSize*2, y:0},
        {x:unitSize*1, y:0},
        {x:0, y:0}
    ];
    gameStart();
};