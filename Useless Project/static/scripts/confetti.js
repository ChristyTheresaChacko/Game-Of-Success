import { GameObject } from "./gameObject.js";

export class Confetti extends GameObject
{
    constructor({ ctx, x, y })
    {
        super({ ctx, fps: 40 });
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.#initProps();
    }

    #initProps()
    {
        this.size = { min: 5, max: 10 };
        this.width = Math.floor(Math.random() * (this.size.max - this.size.min)) + this.size.min;
        this.height = this.width / 9 * 16;
        this.color = `hsl(${Math.random() * 360}, 80%, 50%)`;
        this.drag = 0.05;
        this.gravity = 0.3;
        this.spread = 5;
        this.thrust = 10;
        this.terminalVelocity = 15;
        this.rotation = Math.random() * (Math.PI * 2);
        this.velocity = {
            x: Math.random() * (this.spread * 2) - this.spread,
            y: Math.random() * -this.thrust,
        }
    }

    draw()
    {
        this.ctx.fillStyle = this.color;
        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.ctx.rotate(this.rotation);
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.restore();
    }

    isRemovable()
    {
        return this.y > this.ctx.canvas.height;
    }

    update(deltaTime)
    {
        super.update(deltaTime);
        if(!this.nextFrameRenderable)
            return;
        
        this.velocity.x -= this.velocity.x * this.drag;
        this.velocity.x += Math.random() * 2 - 1;
        
        this.velocity.y = Math.min(this.velocity.y + this.gravity, this.terminalVelocity); 
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}

export function createConfetti(ctx, confetti, position, confettiCount, maxConfettiCount = 20)
{
    if(confetti.length + confettiCount > maxConfettiCount)
        confettiCount = maxConfettiCount - confetti.length;
    for(let i=0; i < confettiCount; i++)
    {
        let confette = new Confetti({ ctx, ...position });
        confetti.push(confette);
    }
}