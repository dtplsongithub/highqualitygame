sources.playerClass = class{
  constructor(x, y, color, isHost) {
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.color = color;
    this.isHost = isHost;
  }
  update(vx, vy){
    this.vx+=vx;
    this.vy+=vy;
    this.x+=this.vx;
    this.y+=this.vy;
  }
}