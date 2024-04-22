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
      playerList.push(new sources.playerClass(M.random(),M.random(),colors[i],i==0));
    }
    return playerList;
  }
  update(x,y,platformList){
    for(let i=0;i<this.currentList.length;i++){
      if(this.currentList[i].isHost){
        this.currentList[i].update(x,y,platformList,this.currentList);
      } else {
        this.currentList[i].update(M.random()-0.5,M.random()-0.5+0.9,platformList,this.currentList); // remove the 0.9 when done testing
      }
    }
  }
}