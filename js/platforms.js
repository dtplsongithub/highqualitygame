sources.platformsClass = class{
  constructor(x,width,height,type,moveData){
    this.x=x;
    this.width=width;
    this.height=height;
    this.type=type;
    this.moveData=moveData;
  }
  update(){
    if(this.moveData[0]){
      this.x+=this.moveData[1]*this.moveData[2];
      if(this.x+this.width<-300){this.x=300;};
      if(this.x>300){this.x=(-300)-this.width;};
    }
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
    let type=0; // normal
    if(M.random()>0.97){
      type=1; // platform kills you
    }
    if(M.random()>0.95){
      type=2; // powerup platform
    }
    if(M.random()>0.96){
      type=3; // uncollidable platform
    }
    if(M.random()>0.92){
      type=4; // bouncey platform
    }
    let movable=(M.random()>0.95)
    let cond=(M.random()/10+this.currentList.length/200)<0.5;
    if(cond){
      type=0; // don't allow special platforms until a certain point is reached
      movable=false;
    }
    if(this.currentList.length!=0&&this.currentList[this.currentList.length-1].type!=0){type=0;}
    this.currentList.push(new sources.platformsClass(M.random()*500-300,M.random()*200+50,30,type,[movable,(M.random()>0.5)*2-1,M.random()*4+1]));
  }
  getCurrentPlatform(player){
    for(let i=0;i<this.currentList.length;i++){
      if(sources.touchingFunction(player.x,player.y,40,40,this.currentList[i].x,(i+1)*120,this.currentList[i].width,this.currentList[i].height)){
        return this.currentList[i];
      }
    };
    return false;
  }
  touchingPlatform(player){ // also i was thinking this could be in player but ok
    for(let i=0;i<this.currentList.length;i++){
      if(sources.touchingFunction(player.x,player.y,40,40,this.currentList[i].x,(i+1)*120,this.currentList[i].width,this.currentList[i].height)){
        return (this.currentList[i].type!=3);
      }
    };
    return false;
  }
  update(){
    for(let i in this.currentList){
      this.currentList[i].update();
    }
  }
}