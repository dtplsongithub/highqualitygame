let M=Math,d=document,Q=(a)=>d.querySelectorAll(a),q=(a)=>Q(a)[0];
class Logs{
  constructor(){
    this.thisNode=q("#logs");
  }
  log(text){
    this.thisNode.innerText+="\n"+text;
  }
  error(text){
    text+="\n\nIt seems like an error has occured. Please let us know by opening an issue in out GitHub repository: https://github.com/dtplsongithub/highqualitygame/issues";
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
  load(url,type,callback){
    this.logElem.log("fetching "+url);
    fetch(url).then(data=>data[type]()).then(body=>{
      this.loaded[url]=body;
      callback(body);
    }).catch(err=>{
      this.logElem.error("an unexpected error has occured upon fetching "+url+".\nTechnical information: "+err);
    })
  }
  loadMultiple(urls,type,clear,callback){
    let idx=-1;
    let nextCallback=()=>{idx++;if(idx==urls.length){callback(this.loaded);if(clear){this.loaded={};}}else{this.load(urls[idx],type,nextCallback)};};
    nextCallback();
  }
}
let log=new Logs();
let loader=new Loader(log);
let sources={};
let images={};
let languagePacks={};
let scripts=["js/powerup.js","js/leaderboard.js","js/platforms.js","js/render.js","js/player.js","js/playerList.js","js/keyboard.js","js/settings.js","js/game.js","js/interface.js","js/popup.js","js/main.js"];
function loadScripts(){
  loader.loadMultiple(scripts,"text",false,(loaded)=>{
    let funcs={};
    for(e in loaded){
      log.log("converting "+e+" from text to function");
      funcs[e]=(new Function("sources","images","languagePacks",loaded[e]));
    }
    for(f in funcs){
      log.log("executing function "+f);
      try{
        funcs[f](sources,images,languagePacks);
      } catch (e) {
        log.error("an error has occured at function "+f+"\n"+e.message+"\n"+(e.stack?e.stack:e));
      }
    };
  });
};
function loadImages(callback){
  loader.loadMultiple(["images/freeze.svg","images/trophy.svg","images/booster.svg","images/teleporter.svg","images/freezer.svg","images/freeze-bullet.svg","images/black-hole.svg"],"blob",true,(loaded)=>{
    let urls={};
    for(e in loaded){
      log.log("converting "+e+" from blob to url");
      urls[e]=URL.createObjectURL(loaded[e]);
    };
    for(f in urls){
      log.log("assigning url "+f+" to image element");
      let img=d.createElement("img");
      img.src=urls[f];
      images[f]=img;
    }
    callback();
  })
};
function loadLanguagePacks(callback){
  loader.loadMultiple(["langData/en_US.json"],"json",true,(loaded)=>{
    languagePacks=loaded;
    callback();
  })
}
function callbackLoop(funcList,i){
  funcList[i](()=>{
    if(funcList.length>i){
      callbackLoop(funcList,i+1);
    }
  })
};
callbackLoop([loadLanguagePacks,loadImages,loadScripts],0)