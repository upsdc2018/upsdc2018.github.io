"use strict"

let canvas = document.getElementById("mainCanvas");
let context = canvas.getContext("2d");

let base = 0;

if (window.innerWidth > window.innerHeight) {
    canvas.width = window.innerHeight;
    canvas.height = window.innerHeight;
} else {
    canvas.width = window.innerWidth;
    canvas.height = window.innerWidth;
}
