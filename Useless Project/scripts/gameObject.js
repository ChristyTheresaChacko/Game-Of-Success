export class GameObject
{
    constructor({ ctx, fps })
    {
        this.ctx = ctx;
        this.fps = fps;
        this.timeCounter = 0;
        this.timeInterval = 1000 / this.fps;
        this.nextFrameRenderable = true;
    }

    update(deltaTime)
    {
        this.timeCounter += deltaTime;
        if(this.timeCounter < this.timeInterval)
            this.nextFrameRenderable = false;
        else
        {
            this.timeCounter = this.timeCounter % this.timeInterval;
            this.nextFrameRenderable = true;
        }
    }
}