sources.popupClass = class{
  constructor(title,render,onclose,width,height,interfaceElement){
    [this.title,this.width,this.height,this.contentRender,this.onclose,this.interface]=[title,width,height,render,onclose,interfaceElement];
    this.toRender=false;
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
    let btn=new sources.buttonClass("Close",1152/2+this.width/2-100,864/2+this.height/2-35,100,35, "popup");
    btn.setClickEvent(()=>{this.close();this.onclose();});
    this.interface.addButton(btn);
    this.toRender=true;
  }
  close(){
    let btnidx = this.interface.buttonList.indexOf(this.interface.buttonList.filter((a)=>a.name=="Close"));
    this.interface.buttonList.splice(btnidx,1);
    this.toRender=false;
  }
}