sources.settingsClass=class{
  constructor(){
    if(!localStorage["keySettings"]){
      this.keySettings={
        left:37, // left arrow key
        right:39, // right arrow key
        powerup:38 // up arrow key
      }
    } else {
      this.keySettings=JSON.parse(localStorage["keySettings"]);
    }
  }
  setKeys(keySettings){
    if(keySettings) this.keySettings=keySettings;
    localStorage["keySettings"]=JSON.stringify(keySettings);
  }
  getPopup(interfaceElement){
    let thisClass=this;
    function keySetButton(title,id,x,y,w,h){
      let btn=new sources.buttonClass("set "+title,x,y,w,h,"popup");
      btn.setClickEvent(()=>{
        btn.text="waiting...";
        sources.keyboard.onStart=((key)=>{
          btn.text="set "+title;
          sources.keyboard.onStart=null;
          let newkeys=thisClass.keySettings;
          newkeys[id]=key;
          thisClass.setKeys(newkeys);
        })
      });
      return btn;
    }
    function keyCodeRepresentation(code){
      if(code>=37&&code<=40){return ["left","up","right","down"][code-37]+" arrow key";}
      if(code>=48&&code<=57){return "number "+(code-48);}
      if(code>=65&&code<=90){return "letter "+String.fromCharCode(code);}
      if(code>=96&&code<=105){return "numpad "+(code-96);}
      if(code>=112&&code<=123){return "F"+(code-112);}
      return "keycode "+code;
    }
    return new sources.popupClass("Settings",(ctx)=>{
      ctx.font="bold 32px Arial";
      ctx.fillStyle="#fff";
      ctx.fillText("Keyboard",100,200);
      ctx.font="24px Arial";
      ctx.fillText("left: "+keyCodeRepresentation(this.keySettings.left),100,250);
      ctx.fillText("right: "+keyCodeRepresentation(this.keySettings.right),100,280);
      ctx.fillText("use powerup: "+keyCodeRepresentation(this.keySettings.powerup),100,310);
    },()=>{game.menu="title";},1000,700,interfaceElement,[
      keySetButton("left","left",400,230,100,25),
      keySetButton("right","right",400,260,100,25),
      keySetButton("powerup key","powerup",400,290,150,25)
    ])
  }
}