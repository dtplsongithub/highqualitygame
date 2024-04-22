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
    let colors=["red","green","blue","yellow","orange","purple","pink","cyan","magenta","lime","white","black"]
    let playerList=[];
    for(let i=0;i<15;i++){
      playerList.push(new sources.playerClass(M.random(),M.random(),colors[i],i==0));
    }
    return playerList;
  }
  update(){
    for(let i=0;i<this.currentList.length;i++){
      this.currentList[i].update(M.random()-0.5,M.random()-0.5);
    }
  }
}