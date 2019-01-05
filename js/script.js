"use strict"

let canvas = document.getElementById("mainCanvas");
let context = canvas.getContext("2d");

let base = 0;

if (window.innerWidth > window.innerHeight) {
    base = window.innerHeight;
    canvas.width = base;
    canvas.height = base;
} else {
    base = window.innerWidth;
    canvas.width = base;
    canvas.height = base;
}

canvas.style.margin = String(Math.floor((window.innerHeight - canvas.height) / 2)) + "px 0 0 0";

// start

// temporary
let pos = 20;
function print(text) {
    context.font = "16px Arial";
    context.fillStyle = "#FFFFFF";
    context.fillText(text, 0, pos);
    pos += 16;
}
let mpos = {x:0, y:0};


// main
let touchPos = {x: 0, y: 0};

canvas.addEventListener("click", getMousePos)
function getMousePos(e) {
    console.log("pumasok");
    mpos.x = e.clientX;
    mpos.y = e.clientY;
    context.fillStyle = "#FFFFFF";
    print(mpos.x + " | " + mpos.y);
}

canvas.addEventListener("touchstart", handleStart, false);
canvas.addEventListener("touchend", handleEnd, false);
// canvas.addEventListener("touchcancel", handleCancel, false);
canvas.addEventListener("touchmove", handleMove, false);


function handleStart(e) {
    e.preventDefault();
    touchPos.x = e.clientX;
    touchPos.y = e.clientY;
}

function handleEnd(e) {
    e.preventDefault();
}

function handleMove(e) {
    e.preventDefault();
    print(String(e.touches[0].clientX) + " " + String(e.touches[0].clientY));
}

context.fillStyle = "#FFFFFF";
context.fillRect(0, 0, 50, 50);
