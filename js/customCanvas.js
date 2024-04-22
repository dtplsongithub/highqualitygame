/* sources.colorClass = class{
  constructor(r,g,b,float){
    if(r instanceof sources.colorClass){
      this.setRGB(r.r,r.g,r.b);
    } else {
      if((r)&&(!g)&&(!b)){
        (float?this.setMonoFloat:this.setMono)(r);
      } else if(r&&g&&b) {
        (float?this.setRGBFloat:this.setRGB)(r,g,b);
      } else {
        throw new Error("invalid arguments: must be either a color object or a single number or 3 consecuitive numbers");
      }
    }
  }
  getRGB(){
    return [this.r,this.g,this.b];
  }
  getRGBFloat(){
    return this.getRGB().map(e=>e/255);
  }
  getHexString(){
    return "#"+this.getRGB().map((a)=>a.toString(16).padStart(2,"0")).join("")
  }
  setRGB(r,g,b){
    [this.r,this.g,this.b]=[r,g,b];
  }
  setRGBFloat(r,g,b){
    [r,g,b]=[r,g,b].map(a=>a*255);
    this.setRGB(r,g,b);
  }
  setMono(v){
    this.setRGB(v,v,v);
  }
  setMonoFloat(v){
    this.setRGBFloat(v,v,v);
  }
  setCSS(str){
    let c=document.createElement("canvas"),x=c.getContext("2d");
    x.fillStyle=str;
    x.fillRect(0,0,1,1);
    this.setRGB(x.getImageData(0,0,1,1).data);
  }
}
sources.canvasClass = class{
  constructor(node,width,height){
    this.canvas = document.createElement("canvas");
    [this.canvas.width,this.canvas.height]=[width,height];
    this.ctx=this.canvas.getContext("2d");
    node.appendChild(this.canvas);
    this.fillStyle=new sources.colorClass(255,255,255);
    this.strokeStyle=new sources.colorClass(0,0,0);
  }
  fill(r,g,b){
    let color = new sources.colorClass(r,g,b);
    this.fillStyle=color;
    ctx.fillStyle=color.getHexString();
  }
  stroke(r,g,b){
    let color = new sources.colorClass(r,g,b);
    this.strokeStyle=color;
    ctx.strokeStyle=color.getHexString();
  }
  line(x0,y0,x1,y1){
    let ctx=this.ctx;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
  }
  rect(x,y,w,h){
    this.ctx.fillRect(x,y,w,h);
  }
  circle(x,y,r){
    this.ctx.arc(100, 75, 50, 0, 2 * Math.PI);
  }
}*/ // well no i dont think so ok