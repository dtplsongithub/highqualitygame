function onError(e){
  alert("An unexpected error has occured. Please reload the page and try again.\nTechnical information: "+e.message+"\n"+(e.stack?e.stack:e))
}
try{
  window.game = new sources.gameClass();
  window.renderer = new sources.rendererClass(q("#logs"),1152,864,onError);
  window.renderer.render(window.game);
  let btn=new sources.buttonClass("test button",200,200,150,35, "title");
  btn.setClickEvent(()=>{console.log("you clicked me!");})
  window.renderer.interface.addButton(btn);
} catch(e) {
  onError(e)
}