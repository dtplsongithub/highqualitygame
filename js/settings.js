sources.settingsClass=class{
  constructor(){
    if(!localStorage["keySettings"]){
      this.keySettings={
        left:"a",
        right:"d",
      }
    } else {
      this.keySettings=JSON.parse(localStorage["keySettings"]);
    }
  }
  setKeys(keySettings){
    if(keySettings) this.keySettings=keySettings;
    localStorage["keySettings"]=JSON.stringify(keySettings);
  }
}