import { createConfetti } from "../scripts/confetti.js"
import { getRandomValueBetween } from "./utils.js";

const canvas = document.querySelector("#canvas");
const container = document.querySelector("#container");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

const resultPage = document.querySelector("#resultPage");
const fact = document.querySelector("#fact");
let factIndex = 0;
let resources = [];
let resourceCount = 0;

let confetti = [];
let balls = [];
for(let i=0; i < 10; i++)
    balls.push(createNumberBall(Math.floor(Math.random() * 30 + 1)));


function createNumberBall(number)
{
    const MAX_SPEED = 4;
    let ball = document.createElement("span");
    ball.classList.add("ball");
    
    let randomValue = Math.floor(Math.random() * 360);  
    let randomColor = `hsl(${randomValue}, 80%, 50%)`;

    ball.style.backgroundColor = randomColor;
    ball.setAttribute("anim", false);
    ball.setAttribute("directionX", getRandomValueBetween(-MAX_SPEED, MAX_SPEED));
    ball.setAttribute("directionY", getRandomValueBetween(-MAX_SPEED, MAX_SPEED));
    ball.addEventListener("click", (event) => {
        const pos = {
            x : event.clientX,
            y : event.clientY
        }
        createConfetti(ctx, confetti, pos, 100, 200);
        document.body.removeChild(ball);
        fact.innerHTML = facts[factIndex];
        factIndex += 1
        fact.innerHTML += "<br><br><br>You obtained a resource!<br>";
        fact.innerHTML += `Resource worth : ${randomValue}`
        fact.classList.add("active");
        resources.push(randomValue);
        resourceCount += 1;
        setInterval(() => {
            fact.classList.remove("active");
            if(resourceCount >= 2) {
                resultPage.classList.add("active");
                sendData(resources);
                window.location.href = "/puzzle"
            }
        }, 10000);
    });

    document.body.appendChild(ball);
    return ball;
}

function sendData(resources) {
    const dataToSend = {
        resource1: resources[0],
        resource2: resources[1]
    };

    console.log("Data", dataToSend);

    fetch('/puzzle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
    })
    .then(response => response.json())
    .then(data => { console.log(data); })
    .catch(error => { console.error('Error:', error);
    });
}
function animateBall(ball, speed=1)
{
    let x = parseInt(ball.offsetLeft);
    let y = parseInt(ball.offsetTop);
    let size = ball.offsetWidth;
    let dirX = ball.getAttribute("directionX");
    let dirY = ball.getAttribute("directionY");
    let destX = x + dirX * speed;
    let destY = y + dirY * speed;
    if(destX < 0)
    {
        destX = 0;
        ball.setAttribute("directionX", dirX * -1);
    }
    else if(destX > (innerWidth - size))
    {
        destX = innerWidth - size;
        ball.setAttribute("directionX", dirX * -1);
    }
    if(destY < 0)
    {
        destY = 0;
        ball.setAttribute("directionY", dirY * -1);
    }
    else if(destY > innerHeight - size)
    {
        destY = innerHeight - size;
        ball.setAttribute("directionY", dirY * -1);
    }
    ball.style.left = `${destX}px`
    ball.style.top = `${destY}px`
}

function animate()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    balls.forEach(ball => animateBall(ball))
    confetti.forEach(confette => { 
        confette.draw();
        confette.update();
    });
    confetti = confetti.filter(confette => !confette.isRemovable());
    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
