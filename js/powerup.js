function getDistance(x0,y0,x1,y1){
  return Math.sqrt(Math.pow(x1-x0,2)+Math.pow(y1-y0,2))
}
function getAngle(x0,y0,x1,y1){
  return M.atan((y1-y0)/(x1-x0))/M.PI*180;
}
sources.powerupClass=class{
  constructor(pwlist,player,playerList,type,game,removeFunction){
    [this.player,this.playerList,this.type,this.remove,this.pwlist,this.gameElement]=[player,playerList,type,removeFunction,pwlist,game];
    console.log(this.playerList);
  }
  boosterUpdate(){
    if(!this.expire){
      this.expire=60*6;
      this.gameElement.notifyFunction(sources.languageText["eventPlayerBoost"].replace("%a",this.player.color));
      window.sfxManager.playAudio("sound/sfxBoost.mp3");
    }
    this.expire--;
    this.player.bounceVY=30;
    this.player.ignoreDeathlyPlatforms=true;
    if(this.expire==0){
      this.player.bounceVY=25;
      this.player.ignoreDeathlyPlatforms=false;
      this.remove();
    }
  }
  teleporterUpdate(){
    this.gameElement.notifyFunction(sources.languageText["eventPlayerTeleporter"].replace("%a",this.player.color))
    const list = [...this.playerList];
    let most = list.sort((a,b)=>b.y-a.y)[0].y;
    this.player.y=most+100;
    this.remove();
  }
  freezerUpdate(){
    if(!this.expire){this.expire=60*2.5;} // the reason why its this low is because of the leg height being small
    if(!this.freezedPlayer){
      const list = [...this.playerList];
      let sorted=list.sort((a,b)=>b.y-a.y);
      this.freezedPlayer = sorted[0];
      if(this.freezedPlayer==this.player){
        this.freezedPlayer=sorted[1];
      }
      this.gameElement.notifyFunction(sources.languageText["eventPlayerFreeze"].replace("%a",this.freezedPlayer.color).replace("%b",this.player.color))
    }
    this.freezedPlayer.freezed=true;
    this.freezedPlayer.freezeTime=this.expire;
    this.expire--;
    if(this.expire==0){
      this.freezedPlayer.freezed=false;
      this.remove();
    }
  }
  freezeBulletUpdate(){
    if(!this.x){this.x=this.player.x;}
    if(!this.y){this.y=this.player.y;}
    if(!this.speed){this.speed=1;}
    if(!this.rot){this.rot=0;}
    if(!this.expire){
      this.expire=60*10;
      this.gameElement.notifyFunction(sources.languageText["eventPlayerFreezeBullet"].replace("%a",this.player.color))
    }
    let closestPlayer=this.playerList.filter((a)=>a!=this.player).sort((a,b)=>getDistance(a.x,a.y,this.x,this.y)-getDistance(b.x,b.y,this.x,this.y))[0];
    let playerAngle=getAngle(this.x,this.y,closestPlayer.x,closestPlayer.y);
    playerAngle+=0; // try adjusting that so it actually goes to a player
    //console.log(playerAngle)
    this.rot+=M.min(M.max(playerAngle-this.rot,-4),4);
    this.speed+=(30-this.speed)/30
    this.x+=M.sin(this.rot/180*M.PI)*this.speed;
    this.y+=M.cos(this.rot/180*M.PI)*this.speed;
    this.x=M.min(M.max(this.x,-300),300);
    for(let i=0;i<this.playerList.length;i++){
      let player=this.playerList[i];
      if(player==this.player){continue;}
      if(sources.touchingFunction(this.x,this.y,50,50,player.x,player.y,40,40)){
        this.remove();
        this.pwlist.usePowerup({hasPowerup:true,currentPowerup:3},this.playerList);
        this.pwlist.powerupList[this.pwlist.powerupList.length-1].freezedPlayer=player;
      }
    }

    this.expire--;
    if(this.expire==0){this.remove();}
  }
  update(){
    switch(this.type){
      case 1:this.boosterUpdate();break;
      case 2:this.teleporterUpdate();break;
      case 3:this.freezerUpdate();break;
      case 4:this.freezeBulletUpdate();break;
    }
  }
  render(ctx){
    if(!this.player.isHost){return;}
    switch(this.type){
      case 1:
        ctx.fillStyle="#000";
        ctx.font="48px Arial";
        ctx.textAlign="center";
        let shake=6-this.expire/60;shake=(shake**2)/8;
        ctx.fillText(sources.languageText["boostPowerupStatus"].replace("%a",(this.expire/60).toFixed(2)),300+(M.random()-0.5)*shake,780+(M.random()-0.5)*shake);
        ctx.textAlign="left";
        break;
      case 3:
        ctx.fillStyle="#000";
        ctx.font="24px Arial";
        ctx.textAlign="center";
        ctx.fillText(sources.languageText["freezePowerupStatus"].replace("%a",(this.expire/60).toFixed(2)),300,780);
        ctx.textAlign="left";
        break;
      case 4:
        //ctx.fillStyle="#0ff";
        //ctx.fillRect(this.x-50+300,(renderer.cameraY-(this.y-50))+ctx.canvas.height/2,100,100);
        let renderX=this.x-50+300;
        let renderY=(renderer.cameraY-(this.y-50))+ctx.canvas.height/2;
        ctx.translate(renderX,renderY);
        ctx.rotate((this.rot-90) * Math.PI / 180);
        ctx.translate(-renderX,-renderY);
        sources.drawImageWithRatio(images["images/freeze-bullet.svg"],ctx,renderX,renderY,100,100);
        ctx.resetTransform();
        break;
    }
  }
}
sources.powerupManageClass=class{
  constructor(){
    this.powerupList=[];
  }
  usePowerup(player,playerList,game){
    if(!player.hasPowerup){throw new Error("tried to use powerup but doesn't have one.");};
    let pw=new sources.powerupClass(this,player,playerList,player.currentPowerup,game,()=>{
      this.powerupList.splice(this.powerupList.indexOf(pw),1);
    })
    this.powerupList.push(pw);
  }
  update(){
    this.powerupList.forEach((a)=>{a.update();});
  }
}