function onError(e){
  alert("An unexpected error has occured. Please reload the page and try again.\nTechnical information: "+e.message+"\n"+(e.stack?e.stack:e))
}
try{
  window.game = new sources.gameClass();
  setInterval(()=>{window.game.update()},1000/60);
  window.renderer = new sources.rendererClass(q("#logs"),1152,864,onError);
  window.renderer.render(window.game);
  let btn=new sources.buttonClass("play",526,400,100,35, "title");
  btn.setClickEvent(()=>{window.game.start();})
  window.renderer.interface.addButton(btn);
} catch(e) {
  onError(e)
}