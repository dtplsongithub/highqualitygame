sources.rendererClass = class{
  constructor(node,width,height){
    this.canvas = document.createElement("canvas"); // i think it fails to do this because it says its undefined oh well deleting it worked
    // how does this even output an error???
    [this.canvas.width,this.canvas.height]=[width,height];
    this.ctx=this.canvas.getContext("2d");
    node.innerHTML="";
    this.canvas.setAttribute("id","mainCanvas");
    node.appendChild(this.canvas);
  }
  renderTitlescreen(){
    let width,height;[width,height]=[this.canvas.width,this.canvas.height];
    this.ctx.clearRect(0,0,width,height);
    this.ctx.fillStyle="black";
    this.ctx.fillRect(0,0,width,height);
    this.ctx.fillStyle="white";
    this.ctx.font="20px Arial";
    this.ctx.fillText("highqualitygame" ,10,30+M.sin(Date.now()/1000)*10);
    this.ctx.fillText("press 'h' for help",10,50);
    this.ctx.fillText("press 's' for settings",10,70);
    this.ctx.fillText("press 'r' to reset",10,90);
    this.ctx.fillText("press 'p' to pause",10,110);
  }
  render(game){
    if(game.menu=="title") this.renderTitlescreen();
    requestAnimationFrame(()=>{this.render(game)});
  }
}