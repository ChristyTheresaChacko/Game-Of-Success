import { getRandomValueBetween, degreeToRadian } from "./utils.js" 

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;


class Player 
{
    constructor({ position, size })
    {
        this.position = position;
        this.size = size;
        this.radius = Math.floor(this.size / 2);
        this.color = "#fff";
        this.gunWidth = 10;
        this.gunHeight = 30;
        this.minAngle = -degreeToRadian(60);
        this.maxAngle = degreeToRadian(60);
        this.angle = degreeToRadian(0);
        this.angleSpeed = degreeToRadian(5);
        this.listenKeyboardEvents();
    }

    listenKeyboardEvents()
    {
        addEventListener("keydown", ({ key }) => {
            if(key == "ArrowRight")     
                this.angle += this.angleSpeed;
            else if(key == "ArrowLeft")     
                this.angle -= this.angleSpeed;
        });
    }

    draw(ctx)
    {   
        ctx.fillStyle = this.color;
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.angle);
        ctx.beginPath();
        let startX = -(this.radius) / 2 + this.gunWidth / 4;
        let startY = -(this.radius + this.gunHeight / 1.8);
        ctx.fillRect(startX, startY, this.gunWidth, this.gunHeight);
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
        ctx.fill(); 
        ctx.restore();
    }
}


class Enemy 
{
    constructor(ctx, player)
    {
        this.size = getRandomValueBetween(10, 20);
        this.ctx = ctx;
        this.player = player;
        this.speed = 1;
        this.radius = Math.floor(this.size / 2);

        this.position = Math.random() < 0.5 
            ? {
                x : Math.random() < 0.5 ? -this.size : this.ctx.canvas.width + this.size,
                y : getRandomValueBetween(0, this.ctx.canvas.height)
              }
            : {
                x : getRandomValueBetween(0, this.ctx.canvas.width),
                y : Math.random() < 0.5 ? -this.size : this.ctx.canvas.height + this.size,
              };
        this.removable = false;
        this.color = `hsl(${Math.random() * 360}, 80%, 50%)`;
    }

    draw(ctx)
    {   
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        ctx.fill(); 
    }

    update()
    {
        let dx = this.position.x - this.player.position.x;
        let dy = this.position.y - this.player.position.y;
        let distance = Math.hypot(dx, dy);
        this.position.x -= dx / distance * this.speed;
        this.position.y -= dy / distance * this.speed;       
    }
    
    hasCollided(object=null) 
    {
        if(object == null) object = this.player;
        let dx = this.position.x - object.position.x;
        let dy = this.position.y - object.position.y;
        let distance = Math.hypot(dx, dy);
        let minDistance = this.radius + object.radius;
        return distance <= minDistance;
    }
}

class Bullet
{
    constructor(ctx, player)
    {
        this.ctx = ctx;
        this.player = player;
        this.size = this.player.radius;
        this.speed = 5;
        this.angle = player.angle - Math.PI * 0.5;
        this.radius = Math.floor(this.size / 2);
        this.position = { ...player.position };
        this.removable = false;
        this.color = `hsl(${Math.random() * 360}, 80%, 100%)`;
    }

    draw(ctx)
    {   
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        ctx.fill(); 
    }
    
    update()
    {
        this.position.x += Math.cos(this.angle) * this.speed;
        this.position.y += Math.sin(this.angle) * this.speed;
        if(this.position.x < 0 || this.position.x > this.ctx.width)
            this.removable = true;
        if(this.position.y < 0 || this.position.y > this.ctx.height)
            this.removable = true;
    }
    
    checkCollision(enemies)
    {
       enemies.forEach(enemy => {
           if(enemy.hasCollided(this))
           {
               enemy.removable = true;
               this.removable = true;
           }
       });
    }
}
    
const player = new Player({
    position: { x: canvas.width/2, y: canvas.height/2 },
    size: 30
});

let enemies = [];

function createEnemies()
{
    let id = setInterval(() => {
        for(let i = 0; i < 3; i++)
            enemies.push(new Enemy(ctx, player));
    }, 3000);
}    
    
function animate()
{
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
 
    player.draw(ctx);

    enemies.forEach(enemy => {
        enemy.draw(ctx);
        enemy.update();
        if(enemy.hasCollided())
        {
            enemy.removable = true;
            player.color = "red";
        }
    });
    bullets.forEach(bullet => {
        bullet.draw(ctx);
        bullet.update();
        bullet.checkCollision(enemies);
    });
    enemies = enemies.filter(enemy => !enemy.removable);
    bullets = bullets.filter(bullet => !bullet.removable);
    requestAnimationFrame(animate);

}
    
let enemyId = createEnemies();
requestAnimationFrame(animate);
    
let bullets = [];
let bulletTimeout = false;

addEventListener("keydown", ({ key }) => {
    if(key == " " && bulletTimeout == false)
    {
        bullets.push(new Bullet(ctx, player))
        // bulletTimeout = true;
        // setTimeout(() => bulletTimeout = false, 500);
    }
});

canvas.addEventListener("mousemove", (event) => {
    let x = event.clientX;
    let y = event.clientY;
    let dx = player.position.x - x;
    let dy = player.position.y - y;
    player.angle = Math.atan2(-dx, dy);
    // bullets.push(new Bullet(ctx, player));
});