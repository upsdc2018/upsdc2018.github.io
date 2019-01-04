"use strict"

<<<<<<< HEAD
let x = JSON.stringify({name:"km"});
console.log(x);
x = JSON.parse(x);
console.log(x);
=======
// object defintions

class Rect {
    constructor(x, y, width, height) {
        this.pos = new Vector(x, y);
        this.w = width;
        this.h = height;
    }

    get center() {
        return new Vector(this.pos.x + this.w/2, this.pos.y + this.h/2);
    }

    get topSide() {
        return this.pos.y;
    }
    
    get rightSide() {
        return this.pos.x + this.w;
    }

    get bottomSide() {
        return this.pos.y + this.h;
    }

    get leftSide() {
        return this.pos.x;
    }

    get x() {
        return this.pos.x;
    }

    set x (coordinate) {
        this.pos.x = coordinate;
    }

    get y() {
        return this.pos.y;
    }

    set y (coordinate) {
        this.pos.y = coordinate;
    }
}

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    addVec(vector) {
        this.x += vector.x
        this.y += vector.y
    }

    multVec(magnitude) {
        this.x *= magnitude;
        this.y *= magnitude;
    }
}

class Character {
    constructor(x, y, width, height) {
        this.rect = new Rect(x, y, width, height)
        this.onAir = true;
        this.jumpPos = y;

        // scalar
        this.acc = (this.rect.w + this.rect.h) * 0.02;
        this.jump = (this.rect.w + this.rect.h) * 0.1;
        this.velLimit = (this.rect.w + this.rect.h) * 0.02;

        // vector
        this.pos = new Vector(x, y);
        this.vel = new Vector(0, 0);
    }

    get center() {
        return this.rect.center;
    }

    get topSide() {
        return this.rect.topSide;
    }
    
    get rightSide() {
        return this.rect.rightSide;
    }

    get bottomSide() {
        return this.rect.bottomSide;
    }

    get leftSide() {
        return this.rect.leftSide;
    }

    get x() {
        return this.rect.x;
    }

    set x (coordinate) {
        this.rect.x = coordinate;
    }

    get y() {
        return this.rect.y;
    }

    set y (coordinate) {
        this.rect.y = coordinate;
    }

    get w() {
        return this.rect.w;
    }

    get h() {
        return this.rect.h;
    }

    set w (length) {
        this.rect.w = length;
    }

    set h (length) {
        this.rect.h = length;
    }

    moveRight() {
        if (this.vel.x < 0) {
            this.vel.multVec(0);
        }
        this.vel.addVec(new Vector(this.acc, 0));
    }

    moveLeft() {
        if (this.vel.x > 0) {
            this.vel.multVec(0);
        }
        this.vel.addVec(new Vector(-this.acc, 0));
    }

    moveJump() {
        if (!this.onAir) {
            this.onAir = true;
            this.vel.addVec(new Vector(0, -(this.jump)));
        }

    }

    moveStop() {
        this.vel.x *= 0;
    }

    update() {
        this.rect.pos.addVec(this.vel);

        if (this.vel.x < 0 && this.vel.x < -this.velLimit) {
            this.vel.x = -this.velLimit;
        }  else if (this.vel.x > 0 && this.vel.x > this.velLimit) {
            this.vel.x = this.velLimit;
        }
    }

    show(context, color) {
        context.fillStyle = color;
        context.fillRect(this.x, this.y, this.w, this.h);
    }
}


class World {
    constructor(canvas, ground, gravity) {
        this.ground = ground;
        this.gravity = gravity;
        this.gKeys = Object.keys(this.ground);
        this.gValues = Object.values(this.ground);
        this.viewWidth = canvas.width;
        this.viewHeight = canvas.height;
    }

    update(player) {
        player.vel.addVec(this.gravity);

        // check for collision
        for (let rectList of this.gValues) {
            for (let rect of rectList) {
                let lDistances = Object.create(null);
                let lDirection = null;
                if (rectCollision(player.rect, rect)) {
                    lDistances[String(Math.abs(player.topSide - rect.bottomSide))] = "topToBot";
                    lDistances[String(Math.abs(player.bottomSide - rect.topSide))] = "botToTop";
                    lDistances[String(Math.abs(player.leftSide - rect.rightSide))] = "leftToRight";
                    lDistances[String(Math.abs(player.rightSide - rect.leftSide))] = "rightToLeft";
                    lDirection = lDistances[String(Math.min(...Object.keys(lDistances).map(k => Number(k))))]
                    if (lDirection == "leftToRight") {
                        player.rect.x = rect.x + rect.w;
                        player.vel.x = 0;
                    } else if (lDirection == "rightToLeft") {
                        player.rect.x = rect.x - player.w;
                        player.vel.x = 0;
                    } else if (lDirection == "topToBot") {
                        player.rect.y = rect.y + rect.h;
                        player.vel.y = 0;
                    } else if (lDirection == "botToTop") {
                        player.rect.y = rect.y - player.h;
                        player.vel.y = 0;
                        player.onAir = false;
                    }
                }
            }
        }
    }

    show(context) {
        let lRectList = null;
        for (let c of this.gKeys) {
            context.fillStyle = c;
            lRectList = this.ground[c];
            for (let r of lRectList) {
                context.fillRect(r.x, r.y, r.w, r.h);
            }
        }
    }
}


function rectCollision(rect1, rect2) {
    // verdict
    let v = false;
    if (rect1.x < rect2.x + rect2.w && rect1.x + rect1.w > rect2.x &&
        rect1.y < rect2.y + rect2.h && rect1.y + rect1.h > rect2.y) {
        v = true;
    }
    return v;
}



// start
const W = 87;
const A = 65;
const S = 83;
const D = 68;


let canvas = document.getElementById("mainCanvas");
let context = canvas.getContext("2d");

let cell = 50;

let player = new Character(canvas.height * 0.1, canvas.height % 0.5, cell, cell*2);

// ground rect
const WORLD = {
    // "#AAAAAA" : [new Rect(450, 0, 50, 300), new Rect(0, canvas.height-50, canvas.width, 50), new Rect(450, canvas.height-100, 50, 50)]
    "#BBBBBB" : [new Rect(0, canvas.height, canvas.width, 50), new Rect(450, canvas.height-50, 200, 50)]
};

const GRAVITY = new Vector(0, 1);

let world = new World(canvas, WORLD, GRAVITY);

// handle events
document.addEventListener("keyup", function(event) {
    if ([A, D].includes(event.keyCode)) {
        player.moveStop()
    }
});

document.addEventListener("keydown", function(event) {
    if (event.keyCode == A) {
        // left
        player.moveLeft();
    } else if (event.keyCode == D) {
        // right
        player.moveRight();
    }

    if (event.keyCode == W) {
        // up
        player.moveJump();
    }
});


function gameLoop() {
    // update
    player.update(GRAVITY, WORLD);
    world.update(player);

    // draw
    context.fillStyle = "#000000";
    context.fillRect(0, 0, canvas.width, canvas.height)
    world.show(context);
    player.show(context, "#00AAFF");
}

setInterval(gameLoop, 10)
>>>>>>> c311b8798890ffd4ff8c6c6260f1af4524cc695a
