var canvas = document.getElementById('flappy-bird');
var tet = canvas.getContext('2d');
var button = document.getElementById('button');

tet.scale(15, 15);

var bird = [
    [1, 1],
    [1, 1],
];

/*Collision function if the bird collides with anything*/
function collide(arena, player){
    var [m, o] = [player.bird, player.pos];
    for(var y = 0; y < m.length; y++){
        for(var x = 0; x < m[y].length; x++){
            if(m[y][x] !== 0 && (arena[y+o.y] && arena[y+o.y][x+o.x]) !== 0)
                return true;
        }
    }
    return false;
}

/*Collision function if the bird collides with any of the pipes*/
function pipeCollision(arena, player){
    var [m, o] = [player.pipe1, player.pos1];
    var [n, p] = [player.pipe2, player.pos2];
    for(var i = 0; i < m.length; i++){
        if(player.pos.x == player.pos1.x && player.pos.y <= player.pipe1.length)
            return true;
    }
    for(var j = player.pos2.x; j < 26; j++){
    	if(player.pos.x === player.pos2.x && player.pos.y >= (26 - player.pipe2.length))
    		return true;
    }
    
    return false;
}

/*Create the arena with specified coordinates*/
function createArena(x, y){
    var matrix = [];
    while(y--)
        matrix.push(new Array(x).fill(0));
    return matrix;
}

/*After each bird movements, continuously call to get changes to the matrix*/
function merge(birdArena, player){
    player.bird.forEach((row, y) =>{
        row.forEach((value, x) =>{
            if(value !== 0){
                if(player.pos.y === -1){
                    birdArena[0][x + player.pos.x] = 0;
                }
                else{
                    birdArena[y + player.pos.y][x + player.pos.x] = value;
                }
            }
        });
    });
}

var birdArena = createArena(26,26);

var player = {
    bird: bird,
    pos: {x: 4, y: 11},
    pipe1: null,
    pos1: {x: 25, y: 0},
    pipe2: null,
    pos2: {x: 25, y: 0},
    pipe3: null,
    pos3: {x: 25, y: 0},
    pipe4: null,
    pos4: {x: 25, y: 0},
    score: 0,
};

function draw(){
    tet.fillStyle = "dodgerblue";
    tet.fillRect(0, 0, canvas.width, canvas.height);
    
    drawArena(birdArena, {x: 0, y: 0});
    drawArena(player.bird, player.pos);
    drawArena(player.pipe1, player.pos1);
    player.pos2.y = 26 - player.pipe2.length;
    drawArena(player.pipe2, player.pos2);

    if(player.pipe3 !== null && player.pipe4 !== null){
    	drawArena(player.pipe3, player.pos3);
    	player.pos4.y = 26 - player.pipe4.length;
    	drawArena(player.pipe4, player.pos4);
    }
}

function drawArena(matrix, offset){
    if(player.pos.y === -1)
        player.pos.y = 0;
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if(value !== 0){
                if(value === 1)
                    tet.fillStyle = "red";
                else
                    tet.fillStyle = "lightgreen";
                tet.fillRect(x + offset.x, y + offset.y, 1, 1);
                
            }
        });
    });
}



var dropCounter = 0;
var dropInterval = 85;
var lastTime = 0;

function update(time = 0){
    var deltaTime = time - lastTime;
    lastTime = time;
    dropCounter += deltaTime;
    if(dropCounter > dropInterval){
        player.pos.y++;
        if(player.pos.y >= 25)
            player.pos.y = 24;
        player.pos1.x--;
        player.pos2.x--;
        dropCounter = 0;
        updateScore();
        if(player.pipe3 !== null && player.pipe4 !== null){
            player.pos3.x--;
            player.pos4.x--;
        }
        if(pipeCollision(birdArena, player)){
	    button.style.display = "block";
            canvas.style.display = "none";
	    player.score = 0;
	    player.pos.x = 4;
	    player.pos.y = 11;
	    player.pos1.x = player.pos2.x = 25;
	    player.pos1.y = player.pos2.y = 0;
	    player.pipe3 = player.pipe4 = null;
	    generatePipes(0);
	}
	if(player.pos1.x === 12 && player.pos2.x === 12)
            generatePipes(1);
        
        if(player.pos1.x === -1 && player.pos2.x === -1){
            player.pos1.x = player.pos3.x;
            player.pos2.x = player.pos4.x;
            player.pipe1 = player.pipe3;
            player.pipe2 = player.pipe4;
            player.pos3.x = 25;
            player.pos4.x = 25;
            generatePipes(1);
        }
    }
    draw();
    requestAnimationFrame(update);
}

function flap(){
    player.pos.y -= 4;
    var original = player.pos.y;
    if(collide(birdArena, player) && player.pos.y <= -1){
        if(player.pos.y < -1)
            player.pos.y = -1;
    }
    else if(collide(birdArena, player) && player.pos.y >= 25){
        if(player.pos.y > 24){
            player.pos.y = 24;
        }
    }
}


function createPipes(type){
    if(type === '9'){
        return [
            [2],
            [2],
            [2],
            [2],
            [2],
            [2],
            [2],
            [2],
            [2],
        ];
    }
    else if(type === '0'){
        return [
            [2],
            [2],
            [2],
            [2],
            [2],
            [2],
            [2],
            [2],
            [2],
            [2],
        ];
    }
    else if(type === '1'){
        return [
            [2],
            [2],
            [2],
            [2],
            [2],
            [2],
            [2],
            [2],
            [2],
            [2],
            [2],
        ];
    }
}

function generatePipes(val){
    var pipeLength = '901';
    var randomizer1 = pipeLength[pipeLength.length * Math.random() | 0];
    var randomizer2 = pipeLength[pipeLength.length * Math.random() | 0];
    while(randomizer2 === randomizer1)
        randomizer2 = pipeLength[pipeLength.length * Math.random() | 0];

    if(val === 0){
        player.pipe1 = createPipes(randomizer1);
        player.pipe2 = createPipes(randomizer2);
    }
    
    else{
        player.pipe3 = createPipes(randomizer1);
        player.pipe4 = createPipes(randomizer2);
        player.pos3.x = 25;
        player.pos4.x = player.pos3.x;
        player.pos4.y = 0;
    }
}

function updateScore(){
	if(!pipeCollision(birdArena, player) && player.pos.x === player.pos1.x)
		player.score++;
	var score = document.getElementById('score');
	score.textContent = player.score;

}

button.addEventListener('click', function(){
    button.style.display = "none";
    canvas.style.display = "block";
    generatePipes(0);
    update();
});
                        
document.addEventListener('keydown', event => {
    if(event.keyCode === 32){
        flap();
    }
});
