import Vector from "@creenv/vector";
import Particle from "../lib/index";
import BoundingRect from "../lib/bounding-rect";

let canvas = document.createElement("canvas");
let context = canvas.getContext("2d");

let colors = ["#00ff00", "#ff00ff", "#ff0000", "#00ffff"];

canvas.width = 500;
canvas.height = 500;

document.body.appendChild(canvas);

let particles = new Array(300);
let i = 0;

let bounds = new BoundingRect(new Vector(-2,-2), new Vector(502,502));


function setParticles() {
  for (let i = 0; i < particles.length; i++) {
    let direction = Math.random()*2*Math.PI;
    let speed = 2 * Math.random();
    particles[i] = new Particle(new Vector(250,250), new Vector(Math.cos(direction), Math.sin(direction)).multiplyScalar(speed), undefined, undefined, bounds);
    particles[i].color = colors[Math.floor(Math.random()*colors.length)];
    particles[i].active = true;
  }
}

function draw () {
  window.requestAnimationFrame(draw);
  i++;

  for (let particle of particles) {
    let direction = Math.random()*2*Math.PI;
    particle.applyForce(new Vector(0,0.05));
  }

  context.fillStyle = "#ffffff";
  context.fillRect(0,0,500,500);

  for (let particle of particles) {
    if (particle.active) {
      context.fillStyle = particle.color;
      if (!particle.update()) {
        particle.active = false;
        console.log("particle deleted");
      }
      context.fillRect(particle.position.components[0], particle.position.components[1], 4, 4);
    }
  }
}

setParticles();
draw();


let btn = document.createElement("button");
btn.innerHTML = "reload";
btn.addEventListener("click", setParticles);
document.body.appendChild(btn);
