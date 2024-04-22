sources.platformsClass = class{
  constructor(x,width,height,type){
    this.x=x;
    this.width=width;
    this.height=height;
    this.type=type;
  }
  update(){
    /*this.x+=this.vx;
    this.y+=this.vy;
    this.vx*=0.99;
    this.vy*=0.99;*/
  }
}
sources.platformList = class{
  constructor(){
    this.currentList=[];
  }
  makeRandom(){
    this.currentList=[];
    for(let i=0;i<10;i++){
      this.addPlatform();
    }
  }
  addPlatform(){
    this.currentList.push(new sources.platformsClass(M.random()*500-300,M.random()*200+50,30,0));
  }
  touchingPlatform(player){ // also i was thinking this could be in player but ok
    for(let i=0;i<this.currentList.length;i++){
      if(sources.touchingFunction(player.x,player.y,40,40,this.currentList[i].x,(i+1)*120,this.currentList[i].width,this.currentList[i].height)){
        return true;
      }
    };
    return false;
  }
}