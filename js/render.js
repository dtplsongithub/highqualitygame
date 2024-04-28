sources.rendererClass = class{
  constructor(node,width,height,onerror){
    this.canvas = document.createElement("canvas");
    [this.canvas.width,this.canvas.height]=[width,height];
    this.ctx=this.canvas.getContext("2d");
    node.innerHTML="";
    this.canvas.setAttribute("id","mainCanvas");
    node.appendChild(this.canvas);
    this.cameraY=0;
    this.interface = new sources.interfaceClass(this.canvas);
    this.popupList = {
      "win":new sources.popupClass(sources.languageText["popupWinTitle"],(ctx,game)=>{game.leaderboard.renderPopup(ctx,false,game);},()=>{game.menu="title"},1000,700,this.interface,[]),
      "lost":new sources.popupClass(sources.languageText["popupLostTitle"],(ctx,game)=>{game.leaderboard.renderPopup(ctx,true,game);},()=>{game.menu="title"},1000,700,this.interface,[]),
      "settings":game.settings.getPopup(this.interface)
    };
    this.onerror=onerror;
  }
  renderTitlescreen(){
    let width,height;[width,height]=[this.canvas.width,this.canvas.height];
    this.ctx.clearRect(0,0,width,height);
    this.renderBackground();
    this.ctx.fillStyle="black";
    this.ctx.font="64px Arial";
    this.ctx.textAlign="center";
    let gameName = sources.languageText["gameName"];
    for (let i in gameName) {
      this.ctx.fillText(gameName[i] ,this.canvas.width/2+(i-gameName.length/2)*40,300+M.sin(Date.now()/500+i/2)*16);
    }
    this.ctx.textAlign="left";
  }
  renderButton(btn) {
    if (btn.guiMenu == game.menu||btn.guiMenu=="popup") {
      this.ctx.font="20px Arial";
      this.ctx.fillStyle=btn.isButtonTouching(this.interface.cursorX, this.interface.cursorY)?"#fff":"#ddd";
      this.ctx.fillRect(btn.x,btn.y,btn.width,btn.height);
      this.ctx.fillStyle="#000"
      this.ctx.textAlign="center";
      this.ctx.fillText(btn.text,btn.x+btn.width/2,btn.y+btn.height/2+6);
      this.ctx.textAlign="left";
    }
  }
  renderSlider(sld){
    if(sld.guiMenu==game.menu||sld.guiMenu=="popup"){
      let val=(sld.value-sld.min)/(sld.max-sld.min);
      this.ctx.fillStyle="#48b";
      this.ctx.fillRect(sld.x,sld.y+sld.height/3,val*sld.width,sld.height/3);
      this.ctx.fillStyle="#ddd";
      this.ctx.fillRect(sld.x+val*sld.width,sld.y+sld.height/3,(1-val)*sld.width,sld.height/3);
      this.ctx.fillStyle="#08f";
      this.ctx.fillRect(sld.x+val*sld.width-sld.height/2,sld.y,sld.height,sld.height);
    }
  }
  renderInterface(){
    let btns=this.interface.buttonList;
    for(let i=0;i<btns.length;i++){
      let btn=btns[i];
      if(btn instanceof sources.buttonClass){
        if(!(btn.hideFunc&&btn.hideFunc())){
          this.renderButton(btn);
        }
      } else if(btn instanceof sources.sliderClass){
        this.renderSlider(btn);
      }
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
        else{
          if(player.freezed){
            this.ctx.drawImage(images["images/freeze.svg"],pos[0]-20,pos[1]-20,40*2,40*2);
          }
          this.ctx.fillStyle=player.color;
          this.ctx.fillRect(pos[0],pos[1],40,40);
          if(player.freezed){
            this.ctx.fillStyle="#fff";
            this.ctx.font="20px Arial";
            this.ctx.textAlign="center";
            this.ctx.fillText((player.freezeTime/60).toFixed(2)+"s",pos[0]+20,pos[1]+20);
            this.ctx.textAlign="left";
          }
        }
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
      if(platform.type==1){this.ctx.fillStyle="#800000";}
      if(platform.type==2){this.ctx.fillStyle="hsl("+M.floor(Date.now()/8%360)+"deg,100%,50%)";}
      if(platform.type==3){this.ctx.globalAlpha=0.7;}
      if(platform.type==4){this.ctx.fillStyle="#ffff00";}
      this.ctx.fillRect(platform.x+600/2,(this.cameraY-(i+1)*120)+this.canvas.height/2,platform.width,platform.height);
      this.ctx.globalAlpha=1;
    }
  }
  renderLeg(){
    this.ctx.fillStyle="#888";
    this.ctx.fillRect(0,((this.cameraY+this.canvas.height/2)%3000),1000,10);
  }
  renderPowerups(game){
    let pwlist=game.powerupList.powerupList;
    pwlist.forEach((a)=>{a.render(this.ctx);})
  }
  renderStartCountdown(game){
    if(!(game.timeStart>Date.now()-1000)){return;}
    let animTimer=1-(((game.timeStart-(Date.now()-1000))/1000)%1);
    this.ctx.textAlign="center";
    this.ctx.font="bold italic 72px Arial";
    this.ctx.translate(300,this.canvas.height/2);
    this.ctx.scale(2+animTimer/5,2+animTimer/5);
    let squash=M.min(((M.max(0.1-animTimer,0)+M.max(animTimer-0.9,0))**2)*100,1);
    this.ctx.scale(1+squash*2,1-squash)
    this.ctx.translate(-300,-this.canvas.height/2);
    this.ctx.textBaseline="middle";
    this.ctx.globalAlpha=1-squash;
    this.ctx.fillStyle="hsl(49deg,87%,"+M.max(100-(animTimer**.5)*80,50)+"%)";
    let timeShow=M.ceil((game.timeStart-Date.now())/1000);
    timeShow=sources.languageText["startCountdown"][timeShow];
    this.ctx.fillText(timeShow,300,this.canvas.height/2);
    this.ctx.globalAlpha=1;
    this.ctx.textBaseline="alphabetic";
    this.ctx.resetTransform();
    this.ctx.textAlign="left";
  }
  renderGame(game){
    if(game.playerList.currentList[0].eliminated){
      this.cameraY+=(game.playerList.currentList.filter((a)=>!a.eliminated).map((a)=>a.y).sort((a,b)=>b-a)[0]-this.cameraY)/30
    } else {
      this.cameraY+=(game.playerList.currentList[0].y-this.cameraY)/30;
    }
    this.renderBackground();
    this.renderPlayers(game)
    this.renderPlatforms(game);
    this.renderLeg();
    this.renderPowerups(game);
    game.leaderboard.render(this.ctx,game);
    this.renderStartCountdown(game);
  }
  renderPopups(game){
    for(let i in Object.keys(this.popupList)){
      //console.log(i);
      this.popupList[Object.keys(this.popupList)[i]].render(this.ctx,game);
    }
  }
  render(game){
    this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    try{
      this.interface.update();
      if(game.menu!="game") this.cameraY=0;
      if(game.menu=="title") this.renderTitlescreen();
      if(game.menu=="game") this.renderGame(game);
      if(game.menu=="popup") this.renderBackground();
      this.renderPopups(game);
      this.renderInterface();
      requestAnimationFrame(()=>{this.render(game)});
    } catch(e) {
      this.onerror(e);
    }
  }
}