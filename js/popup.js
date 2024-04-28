sources.popupClass = class{
  constructor(title,render,onclose,width,height,interfaceElement,buttons){
    [this.title,this.width,this.height,this.contentRender,this.onclose,this.interface,this.buttons]=[title,width,height,render,onclose,interfaceElement,buttons];
    this.toRender=false;
    this.closeButton=new sources.buttonClass(sources.languageText["popupElementClose"],1152/2+this.width/2-100,864/2+this.height/2-35,100,35, "popup");
    this.closeButton.setClickEvent(()=>{this.close();this.onclose();});
  }
  render(ctx,game){
    if(this.toRender){
      ctx.fillStyle="#000a";
      ctx.fillRect(ctx.canvas.width/2-this.width/2,ctx.canvas.height/2-this.height/2,this.width,this.height);
      ctx.fillStyle="#fff";
      ctx.textAlign="center";
      ctx.font="bold 48px Arial";
      ctx.fillText(this.title,ctx.canvas.width/2,ctx.canvas.height/2+(this.height/-2)+48);
      ctx.textAlign="left";
      this.contentRender(ctx,game);
    }
  }
  open(){
    console.log(this.interface);
    this.interface.addButton(this.closeButton);
    for(let i=0;i<this.buttons.length;i++){
      this.interface.addButton(this.buttons[i]);
    }
    this.toRender=true;
  }
  close(){
    let btnidx = this.interface.buttonList.indexOf(this.closeButton);
    this.interface.buttonList.splice(btnidx,1);
    for(let i=0;i<this.buttons.length;i++){
      let btnidx = this.interface.buttonList.indexOf(this.buttons[i]);
      this.interface.buttonList.splice(btnidx,1);
    }
    this.toRender=false;
  }
}