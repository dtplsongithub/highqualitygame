sources.rendererClass = class{
  constructor(node,width,height,onerror){
    this.canvas = document.createElement("canvas"); // i think it fails to do this because it says its undefined oh well deleting it worked
    // how does this even output an error???
    [this.canvas.width,this.canvas.height]=[width,height];
    this.ctx=this.canvas.getContext("2d");
    node.innerHTML="";
    this.canvas.setAttribute("id","mainCanvas");
    node.appendChild(this.canvas);
    this.interface = new sources.interfaceClass(this.canvas);
    this.onerror=onerror;
  }
  renderTitlescreen(){
    let width,height;[width,height]=[this.canvas.width,this.canvas.height];
    this.ctx.clearRect(0,0,width,height);
    this.ctx.fillStyle="#aaa";
    this.ctx.fillRect(0,0,width,height);
    this.ctx.fillStyle="black";
    this.ctx.font="40px Arial";
    this.ctx.fillText("highqualitygame" ,10,30+M.sin(Date.now()/1000)*10);
  }
  renderButton(btn) {
    if (btn.guiMenu == game.menu) {
      this.ctx.font="20px Arial";
      this.ctx.fillStyle="#fff";
      this.ctx.fillRect(btn.x,btn.y,btn.width,btn.height);
      this.ctx.fillStyle="#000"
      this.ctx.textAlign="center";
      this.ctx.fillText(btn.text,btn.x+btn.width/2,btn.y+btn.height/2+6);
      this.ctx.textAlign="left";
    }
  }
  renderButtons(){
    let btns=this.interface.buttonList;
    for(let i=0;i<btns.length;i++){
      let btn=btns[i];
      this.renderButton(btn);
    }
  }
  render(game){
    try{
      this.interface.update();
      if(game.menu=="title") this.renderTitlescreen();
      this.renderButtons();
      requestAnimationFrame(()=>{this.render(game)});
    } catch(e) {
      this.onerror(e);
    }
  }
}