sources.rendererClass = class{
  constructor(node){
    this.canvas = document.createElement("canvas");
    [this.canvas.width,this.canvas.height]=[width,height];
    this.ctx=this.canvas.getContext("2d");
    node.appendChild(this.canvas);
  }
  renderTitlescreen(){
    this.ctx.clearRect(0,0,width,height);
    this.ctx.fillStyle="black";
    this.ctx.fillRect(0,0,width,height);
    this.ctx.fillStyle="white";
    this.ctx.font="20px Arial";
    this.ctx.fillText("highqualitygame v0.1.20240422",10,30+M.sin(Date.now()/1000)*10);
    this.ctx.fillText("press 'h' for help",10,50);
    this.ctx.fillText("press 's' for settings",10,70);
    this.ctx.fillText("press 'r' to reset",10,90);
    this.ctx.fillText("press 'p' to pause",10,110);
  }
  render(game){
    if(game.menu=="title") this.renderTitlescreen();
  }
}