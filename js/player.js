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
    this.aiThinkSeed=M.random();
    this.difficulty=1; // 0: easy, 1: hard.
    console.log(this.aiThinkSeed)
  }
  eliminate(){
    this.eliminated=true;
  }
  checkSameLeg(leg,list){
    list=list.filter((a)=>!a.eliminated);
    let all=0;
    for(let i=0;i<list.length;i++){
      if(list[i].currentLeg>=leg){all++;}
    };
    console.log(all);
    if(all==list.length-1){
      list.filter((a)=>a.currentLeg<leg)[0].eliminate();
    }
  }
  getObjectivePlatformAI(){
    let difficulty=this.difficulty*2;
    let dv=1.9+(1-difficulty)*13.1;
    return M.floor(this.y/120-difficulty/2.5)+1+(this.vx>10)*M.max(M.round(this.aiThinkSeed+M.sin(this.aiThinkSeed*743.12+(this.y+this.aiThinkSeed*7318.111/111)/(5000+M.sin(this.aiThinkSeed*176.43+Date.now()/5000)*500))/1.9),1)
  }
  calculateAI(platformList){
    if(!this.aiObjectivePlatform){this.aiObjectivePlatform=this.getObjectivePlatformAI()}
    let platformIdx=this.aiObjectivePlatform;
    let platform=platformList.currentList[platformIdx];
    let platformX=platform.x+platform.width/2;
    return (platformX-this.x)/2
  }
  update(vx, vy, ai, platformList,list){
    if(!this.eliminated){
      //hold on

      if(ai){
        vx=this.calculateAI(platformList);
        vx=M.min(M.max(vx,-1),1);
      }
      
      this.x += this.vx; 
      this.vx *= 0.8;
      let a=3,m=8;
      if(vx>0) this.vx = M.max(this.vx+a, -m);
      if(vx<0) this.vx = M.min(this.vx-a, m);
      this.vy+=vy-1;
      //this.vy-=1;
      this.y+=this.vy;
      if(this.x<-300){this.x=-300;}
      if(this.x>300){this.x=300;}
      if(this.y<0||(platformList.touchingPlatform(this)&&this.vy<0)){
        this.aiObjectivePlatform=this.getObjectivePlatformAI()
        this.vy=25;
      }
      if(this.y<0){this.y=0;}
      if(this.y>(platformList.currentList.length-4)*120){platformList.addPlatform();}
      // "this.vy<0" to make sure the player is falling.
  
      if(this.currentLeg<M.floor(this.y/3000)){
        this.currentLeg=M.floor(this.y/3000);
        this.checkSameLeg(this.currentLeg,list);
      }
    }
  }
}