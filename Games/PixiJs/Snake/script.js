
function positiveMod(n, m) {
    return ((n % m) + m) % m;
}

class SnakePart {
    // nextPart = null;
    // prevPart = null;
    // head = false;
    // tail = false;
    straightGraphic = null;
    cornerGraphic = null;

    constructor(gridX, gridY, tileSize,
                head = false, tail = false,
                nextPart = null, prevPart = null){
        this.pos = {x: gridX, y: gridY};
        this.tileSize = tileSize;
        this._head = head;
        this._tail = tail;
        this.nextPart = nextPart;
        this.prevPart = prevPart;
        if(this.isHead()){
            this.straightGraphic = new PIXI.Graphics();
            //this.straightGraphic.rect(0, 0, this.tileSize, this.tileSize-10);
            this.straightGraphic.moveTo(this.tileSize, 0)
                                .lineTo(0, this.tileSize/2)
                                .lineTo(this.tileSize, this.tileSize);
            this.straightGraphic.fill(0x00FF00);
            app.stage.addChild(this.straightGraphic);
        }
        else if(this.isTail()){
            this.straightGraphic = new PIXI.Graphics();
            this.straightGraphic.moveTo(this.tileSize, this.tileSize/4)
                                .lineTo(0, this.tileSize/2)
                                .lineTo(this.tileSize, this.tileSize*3/4);
            this.straightGraphic.fill(0xFF0000);
            app.stage.addChild(this.straightGraphic);
        }
        else {
            this.straightGraphic = new PIXI.Graphics();
            this.straightGraphic.rect(0, this.tileSize/4, this.tileSize, this.tileSize/2);
            this.straightGraphic.fill(0xFFFF00);
            app.stage.addChild(this.straightGraphic);
            this.cornerGraphic = new PIXI.Graphics();
            this.cornerGraphic.moveTo(this.tileSize/4, 0)
                              .lineTo(this.tileSize, this.tileSize*3/4)
                              .lineTo(this.tileSize, this.tileSize/4)
                              .lineTo(this.tileSize*3/4, 0);
            this.cornerGraphic.fill(0xFFFF00);
            app.stage.addChild(this.cornerGraphic);
        }
    }

    drawPart() {
        // Use position of next and previous part to know the direction of the part
        // For the head we can use the direction of the next part
        // For the tail we can use the direction of the previous part
        if(this.isHead()){
            this.straightGraphic.pivot.set(this.tileSize / 2, this.tileSize / 2);
            this.straightGraphic.position.set((this.pos.x+0.5) * this.tileSize, (this.pos.y+0.5) * this.tileSize);
            this.straightGraphic.rotation = Math.atan2(this.nextPart.pos.y - this.pos.y, this.nextPart.pos.x - this.pos.x);
        }
        else if(this.isTail()){
            this.straightGraphic.pivot.set(this.tileSize / 2, this.tileSize / 2);
            this.straightGraphic.position.set((this.pos.x+0.5) * this.tileSize, (this.pos.y+0.5) * this.tileSize);
            this.straightGraphic.rotation = Math.atan2(this.prevPart.pos.y - this.pos.y, this.prevPart.pos.x - this.pos.x);
        }
        else{
            const angleWithNext = Math.atan2(this.nextPart.pos.y - this.pos.y, this.nextPart.pos.x - this.pos.x);
            const angleWithPrev = Math.atan2(this.prevPart.pos.y - this.pos.y, this.prevPart.pos.x - this.pos.x);
            //console.log(angleWithNext, angleWithPrev);
            if(Math.abs(angleWithNext - angleWithPrev) == Math.PI){
            //if(Math.abs(angleWithNext - angleWithPrev) == Math.PI/2){
                //console.log("Straight");
                this.straightGraphic.visible = true;
                this.cornerGraphic.visible = false;
                this.straightGraphic.pivot.set(this.tileSize / 2, this.tileSize / 2);
                this.straightGraphic.position.set((this.pos.x+0.5) * this.tileSize, (this.pos.y+0.5) * this.tileSize);
                //this.straightGraphic.rotation = Math.atan2(this.nextPart.pos.y - this.pos.y, this.nextPart.pos.x - this.pos.x);
                this.straightGraphic.rotation = angleWithNext
            }
            else if (Math.abs(Math.abs(angleWithNext) - Math.abs(angleWithPrev)) == Math.PI/2){
                //console.log(angleWithNext, angleWithPrev);
                //console.log("Corner");
                this.straightGraphic.visible = false;
                this.cornerGraphic.visible = true;
                this.cornerGraphic.pivot.set(this.tileSize / 2, this.tileSize / 2);
                this.cornerGraphic.position.set((this.pos.x+0.5) * this.tileSize, (this.pos.y+0.5) * this.tileSize);
                //this.cornerGraphic.rotation = Math.max(Math.atan2(this.nextPart.pos.y - this.pos.y, this.nextPart.pos.x - this.pos.x),
                //                                       Math.atan2(this.prevPart.pos.y - this.pos.y, this.prevPart.pos.x - this.pos.x));
                //this.cornerGraphic.rotation = angleWithNext + angleWithPrev;
                this.cornerGraphic.rotation = (Math.abs(angleWithNext-angleWithPrev) > Math.PI) ? 3*Math.PI/2 : Math.max(angleWithNext, angleWithPrev);
            }
            else{
                console.log(angleWithNext, angleWithPrev);
            }
        }
    }

    setNextPart(part){this.nextPart = part;}
    setPrevPart(part){this.prevPart = part;}
    getNextPart(){return this.nextPart;}
    getPrevPart(){return this.prevPart;}
    isHead(){return this._head;}
    isTail(){return this._tail;}
}

// Double linked list that starts at the head and ends at the tail
class Snake {
    velocity = {x: 0, y: -1};
    score = 0;
    expand = false;
    dead = false;

    constructor(gameGrid){
        this.gameGrid = gameGrid;
        const startPosition = {x: Math.floor(Math.random()*(this.gameGrid.width-1)),
                                y: Math.floor(Math.random()*(this.gameGrid.height-Math.floor(0.25*this.gameGrid.height))) + Math.floor(0.3*this.gameGrid.height)};
        //const startPosition = {x: 48, y: 10};
        console.log("Start position: ", startPosition);
        console.log(startPosition.x*gameGrid.tileSize, startPosition.y*gameGrid.tileSize);
        this.head = new SnakePart(startPosition.x, startPosition.y, this.gameGrid.tileSize, true);
        this.body = [new SnakePart(startPosition.x, startPosition.y + 1, this.gameGrid.tileSize,
                                   false, false, null, this.head)];
        this.tail = new SnakePart(startPosition.x, startPosition.y + 2,  this.gameGrid.tileSize,
                                  false, true, this.head, this.body[0]);
        this.head.setPrevPart(this.tail);
        this.head.setNextPart(this.body[0]);
        this.body[0].setNextPart(this.tail);
        console.log(this.tail);
    }

    drawSnake(x, y){
        this.head.drawPart();
        for(let part of this.body){
            part.drawPart();
        }
        this.tail.drawPart();
    }
    
    moveSnake(){
        if (((this.head.pos.x + this.velocity.x) == this.gameGrid.width) ||
            ((this.head.pos.y + this.velocity.y) == this.gameGrid.height) ||
            ((this.head.pos.x + this.velocity.x) < 0) ||  ((this.head.pos.y + this.velocity.y) < 0)){
            this.dead = true;
        }
        else{
            this.gameGrid.setCell(this.tail.pos.x, this.tail.pos.y, 0);
            // This syntax copies the dictionary
            // Because otherwise a reference is assigned
            // Source https://stackoverflow.com/a/54460487
            this.tail.pos = {...this.tail.prevPart.pos};
            const oldHeadPos = this.head.pos;
            for(let i = this.body.length - 1; i > 0; i--){
                const oldPos = this.body[i].pos;
                this.dead = oldPos.x == oldHeadPos.x + this.velocity.x && oldPos.y == oldHeadPos.y + this.velocity.y;
                this.body[i].pos = {...this.body[i - 1].pos};
            }
            //this.body[0].pos = oldHeadPos;
            this.body[0].pos = {...this.body[0].prevPart.pos};
            // this.head.pos.x += this.velocity.x;
            // this.head.pos.y += this.velocity.y;
            // this.head.pos.x = (this.head.pos.x + this.velocity.x) % this.gameGrid.width;
            // this.head.pos.y = (this.head.pos.y + this.velocity.y) % this.gameGrid.height;
            //this.head.pos.x = positiveMod((this.head.pos.x + this.velocity.x), this.gameGrid.width);
            //this.head.pos.y = positiveMod((this.head.pos.y + this.velocity.y), this.gameGrid.height);
            this.head.pos.x += this.velocity.x;
            this.head.pos.y += this.velocity.y;
            if(this.gameGrid.getCell(this.head.pos.x, this.head.pos.y) == 2){
                this.expand = true;
            }
            else if(this.gameGrid.getCell(this.head.pos.x, this.head.pos.y) == 1){
                this.dead = true;
            }
            this.gameGrid.setCell(this.head.pos.x, this.head.pos.y, 1);
        }
    }

    expandSnake(){
        let newPart = new SnakePart(this.tail.pos.x, this.tail.pos.y,  this.gameGrid.tileSize,
                                    false, false, this.tail, this.body[this.body.length - 1]);
        this.tail.setPrevPart(newPart);
        this.body[this.body.length - 1].setNextPart(newPart);
        this.tail.pos.x += (this.tail.pos.x - this.body[this.body.length - 1].pos.x);
        this.tail.pos.y += (this.tail.pos.y - this.body[this.body.length - 1].pos.y);
        //this.tail.pos.y++;
        this.gameGrid.setCell(this.tail.pos.x, this.tail.pos.y, 1);
        this.body.push(newPart);
        this.score++;
        this.expand = false;
    }

    updateSnake(){
        // Technically it is impossible to eat and expand to oneself
        // Because points are only on empty cells
        // So move the snake, then check if we are at a fruit and expand if so.
        // Might wanna move this function to a game class
    }

    setVelocity(x, y){
        this.velocity.x = x;
        this.velocity.y = y;
    }
}

class Fruit {
    active = true;
    pos = {x: 0, y: 0};

    constructor(gameGrid){
        this.gameGrid = gameGrid;
        this.genPos();
        this.graphic = new PIXI.Graphics();
        this.graphic.circle(this.gameGrid.tileSize/2, this.gameGrid.tileSize/2, this.gameGrid.tileSize/2);
        this.graphic.pivot.set(this.gameGrid.tileSize/2, this.gameGrid.tileSize/2);
        this.graphic.fill(0xFFFF00);
        this.graphic.position.set((this.pos.x + 0.5) * this.gameGrid.tileSize, (this.pos.y + 0.5) * this.gameGrid.tileSize);
        app.stage.addChild(this.graphic);
    }

    genPos(){
        this.pos = {x: Math.floor(Math.random()*this.gameGrid.width),
                    y: Math.floor(Math.random()*this.gameGrid.height)};
        let iters = 0;
        while((this.gameGrid.getCell(this.pos.x, this.pos.y) != 0) && iters < 25){
            this.pos = {x: Math.floor(Math.random()*this.gameGrid.width),
                        y: Math.floor(Math.random()*this.gameGrid.height)};
            iters++;
        }
        if(iters == 25){
            this.active = false;
        }
        else {
            this.gameGrid.setCell(this.pos.x, this.pos.y, 2);
        }
        //console.log("Current fruit position: ", this.pos);
    }

    drawFruit(){
        if(this.active){
            this.graphic.visible = true;
            this.graphic.position.set((this.pos.x + 0.5) * this.gameGrid.tileSize, (this.pos.y + 0.5) * this.gameGrid.tileSize);
        }
        else{
            this.graphic.visible = false;
        }

    }
}

// Used mainly to check if a grid cell is occupied
class Grid {
    grid = [];
    width = 0;
    height = 0;

    constructor(width, height, tileSize){
        this.width = width;
        this.height = height;
        this.tileSize = tileSize;
        for(let x = 0; x < width; x++){
            this.grid.push([]);
            for(let y = 0; y < height; y++){
                this.grid[x].push(0);
            }
        }
    }

    setCell(x, y, value){this.grid[x][y] = value;}
    getCell(x, y){return this.grid[x][y];}
}

//$(window).on('load', async function() {

    const windowWidth = $(window).width();
    const windowHeight = $(window).height();
    const aspectRatio = windowWidth / windowHeight;
    console.log(aspectRatio);
    const aspectRatios = [1/1, 4/3, 16/10, 16/9, 13/6];
    const tileSize = 20;
    const numFruits = 1;
    let gameWidth = 0;
    let gameHeight = 0;
    if(aspectRatio > 1){
        gameWidth = Math.floor(windowWidth * 0.75 / tileSize)*tileSize;
        let index = 0;
        gameHeight = Math.floor(gameWidth / aspectRatios[index] / tileSize)*tileSize;
        index++;
        while(gameHeight > windowHeight - 110 && index < aspectRatios.length){
            gameHeight = Math.floor(gameWidth / aspectRatios[index] / tileSize)*tileSize;
            index++;
        }
        console.log("Chose aspect ratio: ", index - 1);
    }
    else {
        gameWidth = Math.floor(windowWidth * 0.75 / tileSize)*tileSize;
        let index = aspectRatios.length - 1;
        gameHeight = Math.floor(gameWidth * aspectRatios[index] / tileSize)*tileSize;
        index--;
        while(gameHeight > windowHeight * 0.75 && index >= 0){
            gameHeight = Math.floor(gameWidth * aspectRatios[index] / tileSize)*tileSize;
            index--;
        }
        console.log("Chose aspect ratio: ", index + 1);
    }
    const gameDiv = $("#game-div");
    console.log(gameDiv[0]);
    console.log(windowWidth, windowHeight);
    console.log(gameWidth, gameHeight);
    // Create the application helper and add its render target to the page
    const app = new PIXI.Application();
    //console.log($(document).height(), $(window).height());
    console.log(gameDiv.width(), gameDiv.height());
    //await app.init({ width: $(window).width(), height: $(window).height()});
    //await app.init({ width: gameDiv.width(), height: gameDiv.height()});
    await app.init({ width: gameWidth, height: gameHeight});
    // $(window).on("resize", async() => {
    //     //console.log($(document).width(), $(window).height());
    //     console.log(gameDiv.width(), gameDiv.height());
    //     //await app.resize({ width: gameDiv.width(), height: gameDiv.height()});
    // });
    //app.canvas.style.flex = "0 0 auto";
    app.canvas.style.border = "4px solid tomato";
    app.canvas.style.borderRadius = "10px";
    $("#game-div")[0].appendChild(app.canvas);
    let running = true;
    const gameGrid = new Grid(gameWidth / tileSize, gameHeight / tileSize, tileSize);
    const snake = new Snake(gameGrid);
    const fruits = [];
    for(let i = 0; i < numFruits; i++){
        fruits.push(new Fruit(gameGrid));
    }
    let activeFruits = numFruits;
    const initSpeed = 800/(gameGrid.width+gameGrid.height);
    let keyPressed = false;
    // for(let i = 0; i < 1; i++){
    //     snake.expandSnake();
    // }
    snake.drawSnake();

    let elapsed = 0.0;
    app.ticker.add((ticker) => {
        elapsed += ticker.deltaTime;
        if(elapsed > initSpeed){
            if(running){
                snake.moveSnake();
                if (snake.dead){
                    running = false;
                    console.log("Game Over");
                    alert("Game Over\nScore: " + snake.score);
                }
                else if (snake.expand){
                    snake.expandSnake();
                    for(let fruit of fruits){
                        if(fruit.pos.x == snake.head.pos.x && fruit.pos.y == snake.head.pos.y){
                            fruit.genPos();
                            activeFruits = fruit.active ? activeFruits : activeFruits - 1;
                            break;
                        }
                    }   
                    if (activeFruits == 0){
                        running = false;
                    }
                }
                snake.drawSnake();
                for(let fruit of fruits){
                    fruit.drawFruit();
                }
                elapsed = 0.0;
                keyPressed = false;
            }
            //else{
            //    console.log("Game Over");
            //    alert("Game Over");
            //    running = false;
            //}
        }
    })

    document.onkeyup = (e) => {
        if(!keyPressed){   
            //console.log(e.key);
            switch(e.key){
                case "ArrowUp":
                case "w":
                    if(snake.velocity.y == 0){
                        snake.setVelocity(0, -1);
                        keyPressed = true;
                    }
                    break;
                case "ArrowDown":
                case "s":
                    if(snake.velocity.y == 0){
                        snake.setVelocity(0, 1);
                        keyPressed = true;
                    }
                    break;
                case "ArrowLeft":
                case "a":
                    if(snake.velocity.x == 0){
                        snake.setVelocity(-1, 0);
                        keyPressed = true;
                    }
                    break;
                case "ArrowRight":
                case "d":
                    if(snake.velocity.x == 0){
                        snake.setVelocity(1, 0);
                        keyPressed = true;
                    }
                    break;
                default:
                    break;
            }
        }
    }

    // Testing the different behaviour between circle and rect
    // const testGraphic = new PIXI.Graphics();
    // testGraphic.circle(tileSize/2, tileSize/2, tileSize/2);
    // testGraphic.fill(0xFFFFFF);
    // testGraphic.moveTo(0, tileSize/2)
    //            .lineTo(tileSize/2, 0)
    //            .lineTo(tileSize, tileSize/2);
    // //testGraphic.rect(0, 0, tileSize, tileSize);
    // testGraphic.fill(0xFF0000);
    // app.stage.addChild(testGraphic);
    // //testGraphic.position.set(0, 0);
    // testGraphic.pivot.set(tileSize/2, tileSize/2);
    // testGraphic.position.set(0.5*tileSize, 0.5*tileSize);
    // testGraphic.rotation = Math.PI/2;
    // running = false;

    // // Create the sprite and add it to the stage
    // await PIXI.Assets.load('sample.png');
    // let sprite = PIXI.Sprite.from('sample.png');
    // app.stage.addChild(sprite);
    // // console.log(stage.width, stage.height);
    // sprite.x = 640/ 2;
    // sprite.y = 480/ 2;
    // sprite.scale.set(0.5);


    // // Add a ticker callback to move the sprite back and forth
    // let elapsed = 0.0;
    // app.ticker.add((ticker) => {
    //     elapsed += ticker.deltaTime;
    //     //sprite.x = 100.0 + Math.cos(elapsed/50.0) * 100.0;
    //     sprite.rotation = Math.PI + Math.sin(elapsed/50.0) * Math.PI;
    // });
//});