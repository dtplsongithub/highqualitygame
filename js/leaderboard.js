sources.drawImageWithRatio=(img,ctx,x,y,width,height)=>{
  let ratioX = width / img.naturalWidth;
  let ratioY = height / img.naturalHeight;
  let ratio = Math.min(ratioX, ratioY);

  ctx.drawImage(img,x,y,img.naturalWidth * ratio, img.naturalHeight * ratio);
}
String.prototype.reverse = function() {
  return this.split("").reverse().join("");
}
String.prototype.replaceLast = function(a,b) {
  return this.reverse().replace(a,b).reverse();
}
sources.leaderboardClass = class{
  constructor(playerList){
    this.playerList=playerList;
    this.currentObject=this.getPlayerObject();
  }
  getSortedPlayers(){
    const list = [...this.playerList.currentList];
    return list.sort((a,b)=>b.y-a.y).sort((a,b)=>b.currentLeg-a.currentLeg).sort((a,b)=>a.eliminated-b.eliminated);
  }
  getPlayerObject(){
    let out={};
    let list = this.getSortedPlayers();
    for(let i=0;i<list.length;i++){
      out[list[i].color]={color:list[i].color,obj:list[i],x:M.floor(i/10)*300,y:(i%10)*80};
    };
    return out;
  }
  smoothPlayerObject(){
    let new_=this.getPlayerObject();
    let old=this.currentObject;
    for(let i in old){
      old[i].x+=(new_[i].x-old[i].x)/5;
      old[i].y+=(new_[i].y-old[i].y)/5;
    };
    return old;
  }
  findHostIdx(){
    let list = this.getSortedPlayers();
    return list.indexOf(list.filter((a)=>a.isHost)[0])
  }
  getPlaceRepresentation(idx){
    idx++;
    return idx.toString(10)+sources.languageText["placement"][M.floor(idx/10)%10==1?0:(idx%10)];
  }
  timeRepresentation(ms){
    let tm=[ms/60/1000,ms/1000%60,ms/10%100].map((a)=>M.floor(a)).map((a)=>a.toString().padStart(2,"0"));
    return tm.join(":").replaceLast(":",".");
  }
  render(ctx,game){
    ctx.textAlign="left";
    ctx.fillStyle="#fff";
    ctx.fillRect(600, 0, 1152-600, 864);
    let players = this.smoothPlayerObject();
    for(let i in players){
      let player = players[i];
      ctx.fillStyle="#aaa";
      if(player.obj.eliminated){
        ctx.fillRect(620+player.x,20+player.y,300,80);
      }
      ctx.fillStyle=player.color;
      if(player.obj.freezed){
        ctx.drawImage(images["images/freeze.svg"],630+player.x,30+player.y,60,60);
        ctx.fillRect(645+player.x,45+player.y,30,30);
        ctx.font="20px Arial";
        ctx.fillStyle="#fff";
        ctx.textAlign="center";
        ctx.fillText((player.obj.freezeTime/60).toFixed(2)+"s",660+player.x,60+player.y);
        ctx.textAlign="left";
        ctx.fillStyle=player.color;
      } else {
        ctx.fillRect(630+player.x,30+player.y,60,60);
      }
      ctx.font="24px Arial";
      ctx.fillText(player.color,710+player.x,50+player.y);
      ctx.font="16px Arial";
      ctx.fillText(player.obj.y+" cm",710+player.x,70+player.y);
      ctx.fillText((player.obj.eliminated?this.timeRepresentation(player.obj.elimTime-game.timeStart):sources.languageText["leg"].replace("%a",player.obj.currentLeg)),710+player.x,90+player.y);

      if(player.obj.hasPowerup){
        sources.drawImageWithRatio(images["images/"+["booster","teleporter","freezer","freeze-bullet","black-hole"][player.obj.currentPowerup-1]+".svg"],ctx,610+player.x,60+player.y,50,50)
      }
    };

    ctx.textAlign="right";
    let loss=this.findHostIdx()/(this.getSortedPlayers().filter((a)=>!a.eliminated).length-1);
    loss=loss**2;// square so it only does the effect when you're really bad
    if(this.getSortedPlayers()[this.findHostIdx()].eliminated){
      ctx.font="24px Arial";
      ctx.fillStyle="#000";
      ctx.fillText(sources.languageText["spectatorEliminated"].replace("%a",this.getPlaceRepresentation(this.findHostIdx())),ctx.canvas.width-20,ctx.canvas.height-50);
      ctx.fillText(sources.languageText["currentlySpectating"].replace("%a",this.getSortedPlayers()[0].color),ctx.canvas.width-20,ctx.canvas.height-20);
    } else {
      ctx.font="24px Arial";
      ctx.fillStyle="#000";
      ctx.fillText("/"+this.getSortedPlayers().filter((a)=>!a.eliminated).length,ctx.canvas.width-50,ctx.canvas.height-20);

      
      let trophyColors=["#aa0","#aaa","#a22"]
      ctx.font="italic bold ".repeat(this.findHostIdx()<3)+"64px Arial";
      if(this.findHostIdx()<3){ctx.fillStyle=trophyColors[this.findHostIdx()];}
      else{ ctx.fillStyle="rgb("+M.floor(loss*255)+",0,0)"; }
      ctx.fillText(this.getPlaceRepresentation(this.findHostIdx()),ctx.canvas.width-50+M.random()*loss*15,ctx.canvas.height-50+M.random()*loss*15);
      if(this.findHostIdx()<3){
        // make the text shiny by adding a tilted transparent rectangle
        ctx.fillStyle="#fff8";
        ctx.beginPath();
        ctx.moveTo(ctx.canvas.width-90,ctx.canvas.height-100);
        ctx.lineTo(ctx.canvas.width-40,ctx.canvas.height-100);
        ctx.lineTo(ctx.canvas.width-70,ctx.canvas.height-50);
        ctx.lineTo(ctx.canvas.width-120,ctx.canvas.height-50);
        ctx.fill();
      }
    }

    ctx.font="24px Arial";
    ctx.textAlign="left";
    ctx.fillStyle="#000";
    ctx.fillText(this.timeRepresentation(Date.now()-game.timeStart),620,ctx.canvas.height-20);

    if(game.playerList.currentList[0].hasPowerup){
      ctx.font="italic 48px Arial";
      ctx.fillText(sources.languageText["powerups"][game.playerList.currentList[0].currentPowerup-1],20,40);
      sources.drawImageWithRatio(images["images/"+["booster","teleporter","freezer","freeze-bullet","black-hole"][game.playerList.currentList[0].currentPowerup-1]+".svg"],ctx,20,60,70,70)
    }
  }
  renderPopup(ctx,lost,game){
    ctx.font="32px Arial";
    ctx.textAlign="center";
    ctx.fillText(sources.languageText["popupGameEliminated"].replace("%a",this.getPlaceRepresentation(this.findHostIdx())).repeat(lost)+sources.languageText["popupGameTime"].replace("%a",this.timeRepresentation(game.gameTime-game.timeStart)),ctx.canvas.width/2,170,970);
    ctx.textAlign="left";
    let players = this.getSortedPlayers();
    for(let i=0;i<3;i++){
      let player = players[i];
      ctx.fillStyle=player.color;
      ctx.fillRect(110,500+i*80,60,60);
      ctx.font="32px Arial";
      ctx.fillText(player.color,180,520+i*80);
      ctx.font="24px Arial";
      ctx.fillText((player.y+0).toFixed(1)+" cm",180,550+i*80);
      ctx.fillText(sources.languageText["leg"].replace("%a",player.currentLeg)+(", "+this.timeRepresentation(player.elimTime-game.timeStart)).repeat(player.eliminated),180,570+i*80);
    }
    for(let i=0;i<players.length-3;i++){
      let player = players[i+3];
      ctx.fillStyle=player.color;
      ctx.fillRect(500+M.floor(i/10)*200,190+(i%10)*60,40,40);
      ctx.fillText((player.y+0).toFixed(1)+" cm",550+M.floor(i/10)*200,210+(i%10)*60);
      ctx.fillText(this.timeRepresentation(player.elimTime-game.timeStart),550+M.floor(i/10)*200,235+(i%10)*60);
    }
  }
}