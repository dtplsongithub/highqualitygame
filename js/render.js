sources.rendererClass = class{
  constructor(node,width,height,onerror){
    this.canvas = document.createElement("canvas"); // i think it fails to do this because it says its undefined oh well deleting it worked
    // how does this even output an error???
    [this.canvas.width,this.canvas.height]=[width,height];
    this.ctx=this.canvas.getContext("2d");
    node.innerHTML="";
    this.canvas.setAttribute("id","mainCanvas");
    node.appendChild(this.canvas);
    this.cameraY=0;
    this.interface = new sources.interfaceClass(this.canvas);
    this.onerror=onerror;
  }
  renderTitlescreen(){
    let width,height;[width,height]=[this.canvas.width,this.canvas.height];
    this.ctx.clearRect(0,0,width,height);
    this.renderBackground();
    this.ctx.fillStyle="black";
    this.ctx.font="64px Arial";
    this.ctx.textAlign="center";
    let gameName = "highqualitygame";
    for (let i in gameName) {
      this.ctx.fillText(gameName[i] ,this.canvas.width/2+(i-gameName.length/2)*40,300+M.sin(Date.now()/500+i/2)*16);
    }
    this.ctx.textAlign="left";
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
  renderBackground(){
    this.ctx.fillStyle="#aaa";
    this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
  }
  renderArrow(x,y0,y1,direction){
    let ctx = this.ctx;
    direction=direction*2-1;
    ctx.fillRect(x-5,y0,10,(y1-y0))
    ctx.beginPath();
    ctx.moveTo(x-10,y1);
    ctx.lineTo(x+10,y1);
    ctx.lineTo(x,y1+10*direction);
    ctx.fill();
  }
  renderPlayers(game){
    let players = game.playerList.currentList;
    for(let i=0;i<players.length;i++){
      let player=players[i];
      //console.log("render gaem");
      if(!player.eliminated){
        this.ctx.fillStyle=player.color;
        let pos=[player.x+600/2,(this.cameraY-player.y)+this.canvas.height/2]
        if(pos[1]>this.canvas.height){this.renderArrow(pos[0],this.canvas.height-20-M.min(M.abs(player.y-this.cameraY)/10,75),this.canvas.height-20,true);}
        else if(pos[1]<0){this.renderArrow(pos[0],M.min(M.abs(player.y-this.cameraY)/30,75)+20,20,false)}
        else{ this.ctx.fillRect(pos[0],pos[1],40,40); }
      }
      //this.renderArrow(players,i);
      //this.ctx.fillRect(pos[0],pos[1],40,40);
    }
  }
  renderPlatforms(game){
    let platforms = game.platformList.currentList;
    for(let i=0;i<platforms.length;i++){
      let platform=platforms[i];
      this.ctx.fillStyle="#000000";
      this.ctx.fillRect(platform.x+600/2,(this.cameraY-(i+1)*120)+this.canvas.height/2,platform.width,platform.height);
    }
  }
  renderLeg(game){
    this.ctx.fillStyle="#000";
    this.ctx.fillRect(0,300-(this.cameraY%300),1000,10); // lower than usual for testing
  }
  renderGame(game){
    if(game.playerList.currentList[0].eliminated){
      this.cameraY+=(game.playerList.sort((a,b)=>b.y-a.y).currentList[0].y-this.cameraY)/30
    } else {
      this.cameraY+=(game.playerList.currentList[0].y-this.cameraY)/30;
    }
    this.renderBackground();
    this.renderPlayers(game)
    this.renderPlatforms(game);
    game.leaderboard.render(this.ctx);
  }
  render(game){
    this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    try{
      this.interface.update();
      if(game.menu=="title") this.renderTitlescreen();
      if(game.menu=="game") this.renderGame(game);
      this.renderButtons();
      requestAnimationFrame(()=>{this.render(game)});
    } catch(e) {
      this.onerror(e);
    }
  }
}