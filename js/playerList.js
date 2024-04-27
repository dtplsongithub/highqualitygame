sources.playerListClass = class{
  constructor(players){
    if(!players){
      this.currentList=this.generateRandom();
    } else {
      this.currentList=players;
    }
  }
  set(players){
    if(players) this.currentList=players;
  }
  generateRandom(){
    let colors=["blue","red","orange","yellow","lightgreen","cyan","navy","purple","black","gray","pink","maroon","darkgreen","lightseagreen","lightcoral"]
    let playerList=[];
    for(let i=0;i<15;i++){
      playerList.push(new sources.playerClass((M.random()-0.5)*400,M.random(),colors[i],i==0));
    }
    this.currentList=playerList;
  }
  update(x,y,platformList,usePowerup){
    for(let i=0;i<this.currentList.length;i++){
      if(this.currentList[i].isHost){
        this.currentList[i].update(x,y,false,platformList,this.currentList,this.powerupClass,usePowerup);
      } else {
        this.currentList[i].update(0,0,true,platformList,this.currentList,this.powerupClass,false);
      }
    }
  }
  assignPowerupClass(pwc){
    this.powerupClass=pwc;
  }
}