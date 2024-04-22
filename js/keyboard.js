sources.keyboardClass = class {
  constructor() {
    this.keysHold = [];
    this.keysPressed = [];
    d.addEventListener("keydown", (e) => {
      this.keysHold.push(e);
      this.keysPressed.push(e);
    })
    d.addEventListener("keyup", (e) => {
      this.keysHold.splice(this.keysHold.indexOf(e), 1);
    })
  }
  update() {
    this.keysPressed = [];
  }
  hasKey(holding,key,type){
    if(!["key","keyCode"].includes(type)){throw new Error("key type must be key or keyCode.\narguments:"+"\nholding = "+holding+"\nkey = "+key+"\ntype = "+type);}
    let toCheck=holding?this.keysHold:this.keysPressed;
    for(let i=0;i<toCheck.length;i++){
      if(toCheck[i]["type"]==key){return true}
    };
    return false;
  }
}