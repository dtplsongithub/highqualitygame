sources.leaderboardClass = class{
  constructor(playerList){
    this.playerList=playerList;
    this.currentObject=this.getPlayerObject();
  }
  getSortedPlayers(){
    const list = [...this.playerList.currentList];
    return list.sort((a,b)=>b.y-a.y);
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
  render(ctx){
    ctx.fillStyle="#fff";
    ctx.font="24px Arial"
    ctx.fillRect(600, 0, 1152-600, 864);
    let players = this.smoothPlayerObject();
    for(let i in players){
      let player = players[i];
      ctx.fillStyle=player.color;
      ctx.fillRect(630+player.x,30+player.y,60,60);
      ctx.fillText(player.color,710+player.x,50+player.y);
      ctx.fillText((player.obj.y+0).toFixed(1)+" cm",710+player.x,80+player.y);
    }
  }
}