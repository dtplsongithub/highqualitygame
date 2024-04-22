let M=Math,d=document,Q=(a)=>d.querySelectorAll(a),q=(a)=>Q(a)[0];
class Logs{
  constructor(){
    this.thisNode=q("#logs");
  }
  log(text){
    this.thisNode.innerText+="\n"+text;
  }
  error(text){
    let errElem=d.createElement("span");
    errElem.innerText=text;
    errElem.style.backgroundColor="red";
    this.thisNode.appendChild(d.createElement("div"));
    this.thisNode.appendChild(errElem);
  }
}
class Loader{
  constructor(logs){
    this.logElem=logs;
    this.loaded={};
    logs.log("loader initiated");
  }
  load(url,callback){
    this.logElem.log("loading "+url);
    fetch(url).then(data=>data.text()).then(body=>{
      this.loaded[url]=body;
      callback(body);
    })
  }
  loadMultiple(urls,callback){
    let idx=-1;
    let nextCallback=()=>{idx++;if(idx==urls.length){callback(this.loaded)}else{this.load(urls[idx],nextCallback)};};
    nextCallback();
  }
}
let log=new Logs();
let loader=new Loader(log);
let sources={};
loader.loadMultiple(["js/render.js","js/player.js","js/playerList.js","js/keyboard.js","js/settings.js","js/game.js","js/main.js"],(loaded)=>{
  log.log("converting scripts to functions");
  let funcs=[];
  for(e in loaded){funcs.push(new Function("sources",loaded[e]))}
  for(f in funcs){
    log.log("executing function "+f);
    try{
      funcs[f](sources);
    } catch (e) {
      log.error("an error has occured at function "+f+"\n"+e.message+"\n"+(e.stack?e.stack:e));
    }
  };
})