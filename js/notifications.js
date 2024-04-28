sources.notificationManageClass = class{
  constructor(){
    this.textList=[];
  }
  notify(text){
    this.textList.unshift({text:text,time:Date.now(),y:-10})
  }
  update(){
    this.textList=this.textList.filter((a)=>!(a.time+5000<Date.now()))
    for(let i=0;i<this.textList.length;i++){
      this.textList[i].y+=(i*30+30-this.textList[i].y)/10;
    }
  }
  render(ctx){
    for(let i=0;i<this.textList.length;i++){
      ctx.fillStyle="#000";
      ctx.font="24px Arial";
      ctx.globalAlpha=1-M.min(M.max((Date.now()-this.textList[i].time)/5000*5-4,0),1);
      ctx.fillText(this.textList[i].text,20,this.textList[i].y);
    }
    ctx.globalAlpha=1;
  }
}