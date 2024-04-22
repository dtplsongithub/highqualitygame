sources.gameClass = class{
  constructor(){
    this.playerList = new sources.playerListClass();
    this.keyboard = new sources.keyboardClass();
    this.settings = new sources.settingsClass();
    this.menu="title";
  }
  update(){
    let keys = this.settings.keySettings;
    let horizontal=this.keyboard.hasKey(true,keys.right,"key")-this.keyboard.hasKey(true,keys.left,"key");
    this.playerList.update(horizontal,0);
  }
}