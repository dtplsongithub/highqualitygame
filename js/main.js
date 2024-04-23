function onError(e){
  alert("An unexpected error has occured. Please reload the page and try again.\nTechnical information: "+e.message+"\n"+(e.stack?e.stack:e))
}
try{
  window.game = new sources.gameClass();
  setInterval(()=>{window.game.update()},1000/60);
  window.renderer = new sources.rendererClass(q("#logs"),1152,864,onError);
  window.renderer.render(window.game);
  let playButton=new sources.buttonClass("play",526,400,100,35, "title");
  playButton.setClickEvent(()=>{window.game.start();})
  let settingsButton=new sources.buttonClass("settings",526,435,100,35, "title");
  settingsButton.setClickEvent(()=>{window.game.start();})
  window.renderer.interface.addButton(playButton);
  window.game.triggerPopupEvent((e)=>{console.log(e);window.renderer.popupList[e].open();})
} catch(e) {
  onError(e)
}