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

canvas.addEventListener("touchstart", handleStart, false);
canvas.addEventListener("touchend", handleEnd, false);
// canvas.addEventListener("touchcancel", handleCancel, false);
// canvas.addEventListener("touchmove", handleMove, false);

function handleStart(event) {
    event.preventDefault();
    context.fillStyle = "#FF0000";
    context.fillRect(0, 0, canvas.width, canvas.height);
}

function handleEnd(event) {
    event.preventDefault();
    context.fillStyle = "#000000";
    context.fillRect(0, 0, canvas.width, canvas.height);
}
