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
    return idx.toString(10)+["th","st","nd","rd","th","th","th","th","th","th"][idx%10];
  }
  render(ctx){
    ctx.textAlign="left";
    ctx.fillStyle="#fff";
    ctx.fillRect(600, 0, 1152-600, 864);
    let players = this.smoothPlayerObject();
    for(let i in players){
      let player = players[i];
      ctx.fillStyle="#aaa";
      if(player.obj.eliminated){
        ctx.fillRect(620+player.x,20+player.y,320,80);
      }
      ctx.fillStyle=player.color;
      ctx.fillRect(630+player.x,30+player.y,60,60);
      ctx.font="24px Arial";
      ctx.fillText(player.color,710+player.x,50+player.y);
      ctx.font="16px Arial";
      ctx.fillText((player.obj.y+0).toFixed(1)+" cm",710+player.x,70+player.y);
      ctx.fillText("leg "+player.obj.currentLeg,710+player.x,90+player.y);
    };

    ctx.textAlign="right";
    let loss=this.findHostIdx()/(this.getSortedPlayers().filter((a)=>!a.eliminated).length-1);
    loss=loss**2;// square so it only does the effect when you're really bad
    if(this.getSortedPlayers()[this.findHostIdx()].eliminated){
      ctx.font="24px Arial";
      ctx.fillStyle="#000";
      ctx.fillText(`you got eliminated at ${this.getPlaceRepresentation(this.findHostIdx())} place`,ctx.canvas.width-20,ctx.canvas.height-50);
      ctx.fillText(`currently spectating ${this.getSortedPlayers()[0].color}`,ctx.canvas.width-20,ctx.canvas.height-20);
    } else {
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
  }
}