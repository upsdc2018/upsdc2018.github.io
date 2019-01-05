"use strict"


// start
class Rect {
    constructor(x, y, width, height) {
        this.pos = new Vector(x, y);
        this.w = width;
        this.h = height;
    }

    get center() {return new Vector(this.pos.x + this.w/2, this.pos.y + this.h/2);}
    get topSide() {return this.pos.y;}
    get rightSide() {return this.pos.x + this.w;}
    get bottomSide() {return this.pos.y + this.h;}
    get leftSide() {return this.pos.x;}

    get x() {return this.pos.x;}
    set x (coordinate) {this.pos.x = coordinate;}

    get y() {return this.pos.y;}
    set y (coordinate) {this.pos.y = coordinate;}
}

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    addVec(vector) {
        this.x += vector.x;
        this.y += vector.y;
    }

    multVec(magnitude) {
        this.x *= magnitude;
        this.y *= magnitude;
    }
}

class Character {
    constructor(x, y, width, height) {
        this.rect = new Rect(x, y, width, height);
        this.move = false;

        //scalar
        this.vel = 1;

        // vector
        this.pos = new Vector(x, y);
    }

    get center() {return this.rect.center}
    get topSide() {return this.rect.topSide;}
    get rightSide() {return this.rect.rightSide;}
    get bottomSide() {return this.rect.bottomSide;}
    get leftSide() {return this.rect.leftSide;}

    get x() {return this.rect.x;}
    set x (coordinate) {this.rect.x = coordinate;}

    get y() {return this.rect.y;}
    set y (coordinate) {this.rect.y = coordinate;}

    get w() {return this.rect.w;}
    get h() {return this.rect.h;}

    set w (length) {this.rect.w = length;}
    set h (length) {this.rect.h = length;}

    move() {this.move = true;}
    stop() {this.move = false;}

    moveUp() {
        this.pos.y -= this.vel;
    }

    moveDown() {
        this.pos.y += this.vel;
    }

    moveLeft() {
        this.pos.x -= this.vel;
    }

    moveRight() {
        this.pos.x += this.vel;
    }

    show(context, color) {
        this.rect.x = this.pos.x;
        this.rect.y = this.pos.y;

        context.fillStyle = color;
        context.fillRect(this.x, this.y, this.w, this.h);
    }
}


class World {
    constructor(canvas, ground, bgImage) {
        this.ground = ground;
        this.gKeys = Object.keys(this.ground);
        this.gValues = Object.values(this.ground);
        this.viewWidth = canvas.width;
        this.viewHeight = canvas.height;
        this.bg = bgImage;
        this.bgRect = new Rect(-this.bg.height + canvas.height, 0, this.bg.width, this.bg.height);
    }

    update(player, direction) {
        if (player.move) {
            if (direction == "up") {
                this.bgRect.y += player.vel;
            } else if (direction == "down") {
                this.bgRect.y -= player.vel;
            } else if (direction == "left") {
                this.bgRect.x += player.vel;
            } else if (direction == "right") {
                this.bgRect.x -= player.vel;
            }
        }
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
                    }
                }
            }
        }
    }

    showBg(context) {
        context.drawImage(this.bg, this.bgRect.x, this.bgRect.y);
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

function getAngle(canvasCenter, vector) {
    let lOpp = canvasCenter.y - vector.y;
    let lAdj = vector.x - canvasCenter.x;
    let radToDeg = 57.2957795;
    let lAngle = null;
    // console.log(`center (${canvasCenter.x}, ${canvasCenter.y}) opp ${lOpp} adj ${lAdj}`);

    if (lOpp != 0 && lAdj != 0) {
        if (lOpp > 0) {
            if (lAdj > 0) {
                lAngle = Math.atan(Math.abs(lOpp/lAdj)) * radToDeg;
            } else {
                lAngle = 180 - Math.atan(Math.abs(lOpp/lAdj)) * radToDeg;
            }
        } else {
            if (lAdj > 0) {
                lAngle = 360 - Math.atan(Math.abs(lOpp/lAdj)) * radToDeg;
            } else {
                lAngle = 180 + Math.atan(Math.abs(lOpp/lAdj)) * radToDeg;
            }
        }
    } else {
        if (lOpp == 0) {
            if (lAdj > 0) {
                lAngle = 0;
            } else {
                lAngle = 180;
            }
        } else {
            if (lOpp > 0) {
                lAngle = 90;
            } else {
                lAngle = 270;
            }
        }
    }

    return lAngle;
}


// initialization

let canvas = document.getElementById("mainCanvas");
let context = canvas.getContext("2d");

let gameMap = new Image();
gameMap.style.display = "none";
gameMap.src = "js/assets/map.png";

if (window.innerWidth > gameMap.width || window.innerHeight > gameMap.height) {
    if (window.innerWidth > gameMap.width) {
        canvas.width = gameMap.width;
    }
    if (window.innerHeight > gameMap.height) {
        canvas.height = gameMap.height;
    }
} else {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// let base = 0;
//
// if (window.innerWidth > window.innerHeight) {
//     base = window.innerHeight;
//     canvas.width = base;
//     canvas.height = base;
// } else {
//     base = window.innerWidth;
//     canvas.width = base;
//     canvas.height = base;
// }


canvas.style.margin = String(Math.floor((window.innerHeight - canvas.height) / 2)) + "px 0 0 0";

let center = new Vector(canvas.width/2, canvas.height/2);


// ######################### temporary ##########################
let mpos = new Vector(0, 0);

canvas.addEventListener("mousemove", getMousePos);

function getMousePos(e) {
    mpos.x = e.clientX;
    mpos.y = e.clientY;
    let angle = getAngle(center, mpos);
    if (angle >= 45 && angle < 135) {
        direction = "up";
    } else if (angle >= 135 && angle < 225) {
        direction = "left";
    } else if (angle >= 225 && angle < 315) {
        direction = "down";
    } else {
        direction = "right";
    }
}
// ######################### temporary ##########################


// touch events
canvas.addEventListener("touchstart", handleStart, false);
canvas.addEventListener("touchend", handleEnd, false);
// canvas.addEventListener("touchcancel", handleCancel, false);
canvas.addEventListener("touchmove", handleMove, false);

let touchPos = new Vector(0, 0);
let direction = null

// map
let world = null;
let cell = 20;

gameMap.onload = gameSetup(cell);


let player = new Character(canvas.width/2 - cell/2, canvas.height/2 - cell/2, cell, cell);



function handleStart(e) {
    e.preventDefault();
    touchPos.x = e.clientX;
    touchPos.y = e.clientY;
    let angle = getAngle(center, touchPos);
    if (angle >= 45 && angle < 135) {
        direction = "up";
    } else if (angle >= 135 && angle < 225) {
        direction = "left";
    } else if (angle >= 225 && angle < 315) {
        direction = "down";
    } else {
        direction = "right";
    }
    player.move();
    context.fillStyle = "#FF0000";
    context.fillRect = (0, 0, 50, 50);
    document.body.style.background-color = "red";
}

function handleEnd(e) {
    e.preventDefault();
    player.stop();
    document.body.style.background-color = "black";
}

function handleMove(e) {
    e.preventDefault();
    touchPos.x = e.clientX;
    touchPos.y = e.clientY;
}

// ground rect



function gameSetup(cell) {
    const WORLD = {
        "#BBBBBB" : [new Rect(0, canvas.height, canvas.width, cell),
                     new Rect(0, -cell, canvas.width, cell),
                     new Rect(-cell, 0, cell, canvas.height),
                     new Rect(canvas.width, 0, cell, canvas.height)]
    };

    world = new World(canvas, WORLD, gameMap);

    setInterval(gameLoop, 10);
}

function gameLoop() {
    context.fillStyle = "#FFFFFF";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // updates
    context.drawImage(gameMap, 0, 0);
    world.update(player, direction);

    canvas.onclick = function() {
        player.move = !player.move;
    };

    // draw
    world.showBg(context);
    world.show(context);
    player.show(context, "#00AA00");
}
