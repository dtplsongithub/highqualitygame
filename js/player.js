sources.playerClass = class{
  constructor(x, y, color, isHost) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.color = color;
    this.isHost = isHost;
    this.currentLeg=0;
    this.eliminated=false;
  }
  eliminate(){
    this.eliminated=true;
  }
  checkSameLeg(leg,list){
    console.log(list);
    let all=0;
    for(let i=0;i<list.length;i++){
      if(list[i].currentLeg>=leg){all++;}
    };
    if(all==list.length){this.eliminate()}
  }
  update(vx, vy, platformList,list){
    if(!this.eliminated){
      //hold on
      this.x += this.vx; 
      this.vx *= 0.8;
      let a=3,m=8;
      if(vx>0) this.vx = M.max(this.vx+a, -m);
      if(vx<0) this.vx = M.min(this.vx-a, m);
      this.vy+=vy-1;
      //this.vy-=1;
      this.y+=this.vy;
      if(this.x<-400){this.x=-400;}
      if(this.x>400){this.x=400;}
      if(this.y<0||(platformList.touchingPlatform(this)&&this.vy<0)){
        this.vy=25;
      }
      if(this.y<0){this.y=0;}
      if(this.y>(platformList.currentList.length-4)*120){platformList.addPlatform();}
      // "this.vy<0" to make sure the player is falling.
  
      if(this.currentLeg!=M.floor(this.y/3000)){
        this.currentLeg=M.floor(this.y/3000);
        this.checkSameLeg(this.currentLeg,list);
      }
    }
  }
}