sources.gameClass = class{
  constructor(){
    this.playerList = new sources.playerListClass();
    //this.keyboard = new sources.keyboardClass();
    this.settings = new sources.settingsClass();
    this.platformList = new sources.platformList();
    this.multiplayer = new sources.multiplayerClass(this);
    this.leaderboard = new sources.leaderboardClass({"currentList":[]});
    this.menu="intro";
    setTimeout(()=>{this.menu="title"},4000)
    this.timeStart=Date.now();
  }
  triggerPopupEvent(event){
    this.popupTrigger=event;
  }
  notifyEvent(event){
    this.notifyFunction=event;
  }
  assignBgmManager(bgmManager){
    this.bgmManager=bgmManager;
  }
  start(isOnline){
    this.menu="game";
    this.online=!!isOnline;
    this.powerupList = new sources.powerupManageClass(this);
    if(!isOnline)this.playerList.generateRandom(this.settings.aiDifficulty);
    this.playerList.assignPowerupClass(this.powerupList);
    this.platformList.makeRandom();
    this.leaderboard = new sources.leaderboardClass(this.playerList);
    this.timeStart=Date.now()+3000;
    this.bgmManager.fadeTo(1000,"sound/bgmGame.mp3")
  }
  update(){
    if(this.menu=="game"){
      let keys = this.settings.keySettings;
      //let horizontal=this.keyboard.hasKey(true,keys.right,"key")-this.keyboard.hasKey(true,keys.left,"key");
      let horizontal=sources.keyboard.includes(keys.right)-sources.keyboard.includes(keys.left);
      this.platformList.update();
      this.playerList.update(horizontal,0,this.platformList,sources.keyboard.includes(keys.powerup),this);
      this.powerupList.update();
      if(this.playerList.currentList.filter((a)=>!a.eliminated).length==1){
        this.gameTime=Date.now();
        this.popupTrigger(this.playerList.currentList.filter((a)=>a.isHost)[0].eliminated?"lost":"win");
        this.menu="popup";
      }
    }
  }
}