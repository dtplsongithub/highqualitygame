function onError(e){
  console.error(e);
  let msg="";
  if(sources.languageText&&sources.languageText["unexpectedError"]){
    msg=sources.languageText["unexpectedError"]
  } else {
    msg="An unexpected error has occured. Please reload the page and try again.\nTechnical information: ";
  }
  alert(msg+(e.stack?e.stack:e))
}
try{
  window.game = new sources.gameClass();
  setInterval(()=>{window.game.update()},1000/60);
  window.renderer = new sources.rendererClass(q("#logs"),1152,864,onError);
  window.renderer.render(window.game);
  let playButton=new sources.buttonClass(sources.languageText["playButton"],526,400,100,35, "title");
  playButton.setClickEvent(()=>{window.game.start();})
  let settingsButton=new sources.buttonClass(sources.languageText["settingsButton"],526,437,100,35, "title");
  settingsButton.setClickEvent(()=>{window.game.menu="popup";window.renderer.popupList["settings"].open();})
  let powerupButton=new sources.buttonClass(sources.languageText["usePowerup"],120,70,140,35, "game");
  powerupButton.setClickEvent(()=>{window.game.playerList.currentList.filter((a)=>a.isHost)[0].usePowerup();});
  powerupButton.setHideCheckFunc(()=>{if(!window.game.playerList.currentList){return;};return !window.game.playerList.currentList.filter((a)=>a.isHost)[0].hasPowerup});
  window.renderer.interface.addButton(playButton);
  window.renderer.interface.addButton(settingsButton);
  window.renderer.interface.addButton(powerupButton);
  window.game.triggerPopupEvent((e)=>{console.log(e);window.renderer.popupList[e].open();})
} catch(e) {
  onError(e)
}