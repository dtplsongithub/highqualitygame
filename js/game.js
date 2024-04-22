sources.gameClass = class{
  constructor(){
    this.playerList = new sources.playerListClass();
    //this.keyboard = new sources.keyboardClass();
    this.settings = new sources.settingsClass();
    this.platformList = new sources.platformList();
    this.menu="title";
  }
  start(){
    this.menu="game";
    this.playerList.generateRandom();
    this.platformList.makeRandom();
    this.leaderboard = new sources.leaderboardClass(this.playerList);
  }
  update(){
    if(this.menu=="game"){
      let keys = this.settings.keySettings;
      //let horizontal=this.keyboard.hasKey(true,keys.right,"key")-this.keyboard.hasKey(true,keys.left,"key");
      let horizontal=sources.keyboard.includes(keys.right)-sources.keyboard.includes(keys.left);
      this.playerList.update(horizontal,0,this.platformList);
    }
  }
}