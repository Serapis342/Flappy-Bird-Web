let handler = false;

window.onload = function()
{   
    document.body.style = 'margin: 0; padding: 0; overflow: hidden;';
    resizeCanvas();


    window.score = 0;
    window.highScore = localStorage.getItem('highScore_Flappy_Bird') || 0;
    window.KEY_SPACE = false;

    window.pipes = [];

    window.bird = {
        x: 50,
        y: 100,
        width: 30,
        height: 30,
        rotate: 'none',
        img: new Image(),
        src: 'images/bird.png'
    }
    bird.img.src = bird.src;

    window.canvas = document.getElementById('canvas');
    window.ctx = canvas.getContext('2d');
    
    window.AI = false;
    window.gravity = canvas.height / 100;

    createPipe();

    draw();
    setInterval(update, 1000 / 25);
    setInterval(createPipe, 3800);
}

window.onresize = function()
{
    resizeCanvas();
    location.reload();
}

function resizeCanvas()
{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function draw()
{
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(bird.img, bird.x, bird.y, bird.width, bird.height);
    pipes.forEach(pipe => {
        ctx.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height); 
    });

    pipes.forEach(pipe => {
        if (bird.x + bird.width >= pipe.x && bird.x <= pipe.x + pipe.width && bird.y + bird.height >= pipe.y && bird.y <= pipe.y + pipe.height) {
            gameOver();
        }
    });

    ctx.fillStyle = 'black';
    if(AI) {
        ctx.font = '6vw monospace';
        width = ctx.measureText('Highscore: ' + highScore + ' Score: ' + score).width;
        ctx.fillText('Highscore: ' + highScore + ' Score: ' + score, canvas.width / 2 - width / 2, canvas.height / 2);
    } else {
        ctx.font = '3vh monospace';
        width = ctx.measureText('Score: ' + score).width + 15;
        ctx.fillText('Score: ' + score, canvas.width - width, 45);
    }

    if(bird.y + bird.height >= canvas.height)
    {
        bird.y = -5
        gameOver();
    }

    if(bird.y <= 0)
    {
        bird.y = 0;
    }

    requestAnimationFrame(draw);
}

function update()
{
    if(!AI) {
        if(KEY_SPACE)
        {
            bird.y -= gravity;
        } else {
            bird.y += gravity;
        }
    } else {
        if(bird.x + bird.width < pipes[0].x + pipes[0].width + 40) {
            if(bird.y < pipes[0].y + pipes[0].height + 40)
            {
                bird.y += gravity;
            } else if(bird.y > pipes[0].y + pipes[0].height + 40) {
                bird.y -= gravity;
            } else {
                bird.y += 0;
            }

            if (bird.y > pipes[0].y + pipes[0].height + 40) {
                bird.y -= gravity;
            }
        } else {
            if (bird.y < pipes[2].y + pipes[2].height + 40) {
                bird.y += gravity;
            } else if (bird.y > pipes[2].y + pipes[2].height + 40) {
                bird.y -= gravity;
            } else {
                bird.y += 0;
            }

            if (bird.y > pipes[2].y + pipes[2].height + 40) {
                bird.y -= gravity;
            }
    }
}

    pipes.forEach(pipe => {
        pipe.x -= canvas.width / 200;
    });

    pipes.forEach(pipe => {
        if (pipe.x + pipe.width <= 0) {
            pipes.shift();
            
            if(handler === false)
            {
                if(!AI) score++;
                handler = true;
            } else handler = false;
        }
    });
}

function createPipe()
{
    let pipeBottom = {
        x: canvas.width,
        y: canvas.height + 20,
        width: 60,
        height: 200,
        img: new Image(),
        src: 'images/pipe.png'
    }
    
    let pipeTop = {
        x: canvas.width,
        y: -15,
        width: 60,
        height: Math.floor(Math.random() * (canvas.height - 100)) + 1,
        img: new Image(),
        src: 'images/pipe.png'
    }

    pipeTop.img.src = pipeTop.src;

    pipeBottom.height = canvas.height - pipeTop.height - 80;
    pipeBottom.y -= pipeBottom.height;
    pipeBottom.img.src = pipeBottom.src;
    
    pipes.push(pipeTop, pipeBottom);
}

function gameOver()
{
    localStorage.setItem('score', score);
    if(score > highScore)
    {
        localStorage.setItem('highScore_Flappy_Bird', score);
    }

    AI = true;
}

document.onkeydown = function (e) {
    if(e.code === "Space")
    {
        if(AI)window.location.replace('index.html');
        else {
            KEY_SPACE = true;
        } 
    }
}

document.onkeyup = function (e) {
    if(e.code === "Space")
    {
        KEY_SPACE = false;
    }
};

document.addEventListener('touchend', function(e) {
    KEY_SPACE = false; 
});

document.addEventListener('touchstart', function(e) {
    if (AI) window.location.replace('index.html');
    else {
        KEY_SPACE = true;
    }
});