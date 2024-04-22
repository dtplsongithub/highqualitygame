function isTouching(x0, y0, w0, h0, x1, y1, w1, h1){ // this could also be used for box colisions i guess
  return (x0 + w0 >= x1 && 
          x0 <= x1 + h1 &&
          y0 + h0 >= y1 &&
          y0 <= y1 + h1)
}
sources.buttonClass = class{
  constructor(text,x,y,width,height, guiMenu) {
    [this.text, this.x, this.y, this.width, this.height, this.guiMenu]=[text,x,y,width,height, guiMenu];
    this.currentlyClicking=false;
    this.hasOnclick=false;
    this.hasOnclickend=false;
  }
  setClickEvent(callback){
    this.onclick=callback;
    this.hasOnclick=true;
  }
  setClickEndEvent(callback){
    this.onclickend=callback;
    this.hasOnclickend=true;
  }
  isButtonTouching(cursorX,cursorY){
    return isTouching(this.x, this.y, this.width, this.height, cursorX, cursorY, 1, 1);
  }
  update(cursorX,cursorY,clicking){
    if(clicking&&this.isButtonTouching(cursorX,cursorY)&&!this.currentlyClicking){
      this.currentlyClicking=true;
      if(this.hasOnclick)this.onclick();
    }
    if(this.currentlyClicking&&!clicking){
      this.currentlyClicking=false;
      if(this.hasOnclickend)this.onclickend();
    }
  }
}
sources.interfaceClass = class{
  constructor(cnv){
    this.buttonList=[];
    this.cursorX=0;
    this.cursorY=0;
    this.clicking=false;
    cnv.addEventListener("mousemove",(e)=>{
      [this.cursorX,this.cursorY]=[e.clientX,e.clientY]; // change "client" if smth buggy
    });
    cnv.addEventListener("mousedown",(e)=>{
      this.clicking=true;
    });
    cnv.addEventListener("mouseup",(e)=>{
      this.clicking=false;
    });
  }
  addButton(button){
    this.buttonList.push(button);
  }
  update(){
    for(let i=0;i<this.buttonList.length;i++){
      this.buttonList[i].update(this.cursorX,this.cursorY,this.clicking);
    }
  }
}