/*sources.keyboardClass = class {
  constructor() {
    this.keysHold = [];
    this.keysPressed = [];
    d.addEventListener("keydown", (e) => {
      //console.log(this.keysHold);
      if(!this.hasKey(true,e.key,"key")){
        this.keysHold.push(e);
        this.keysPressed.push(e);
      }
    })
    d.addEventListener("keyup", (e) => {
      //console.log(this.keysHold)
      this.keysHold.splice(this.keysHold.indexOf(e), 1);
      this.keysPressed.splice(this.keysPressed.indexOf(e), 1);
    })
  }
  update() {
    this.keysPressed = [];
  }
  hasKey(holding,key,type){
    if(!["key","keyCode"].includes(type)){throw new Error("key type must be key or keyCode.\narguments:"+"\nholding = "+holding+"\nkey = "+key+"\ntype = "+type);}
    let toCheck=holding?this.keysHold:this.keysPressed;
    for(let i=0;i<toCheck.length;i++){
      if(toCheck[i][type]==key){return true}
    };
    return false;
  }
}*/
sources.keyboard = [];
d.addEventListener("keydown",(e)=>{
  if(!sources.keyboard.includes(e.keyCode)){
    sources.keyboard.push(e.keyCode)
    if(sources.keyboard.onStart){sources.keyboard.onStart(e.keyCode)}
  }
})

d.addEventListener("keyup",(e)=>{
  if(sources.keyboard.includes(e.keyCode)){
    sources.keyboard.splice(sources.keyboard.indexOf(e.keyCode), 1);
    if(sources.keyboard.onEnd){sources.keyboard.onEnd(e.keyCode)}
  }
})