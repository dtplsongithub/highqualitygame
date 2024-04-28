function getKeyByValue(object, value) {
    return Object.keys(object).find(key =>
        object[key] === value);
}
if(!localStorage["language"]){
  let navLangs=navigator.languages.filter((a)=>languagePacks["langData/"+a.replaceAll("-","_")+".json"]);
  if(navLangs[0]){
    localStorage["language"]=navLangs[0].replaceAll("-","_");
  } else {
    localStorage["language"]="en_US";
  }
}
sources.languageText=languagePacks["langData/"+localStorage["language"]+".json"];
if(!sources.languageText){
  console.warn("failed to load language cookie ("+localStorage["language"]+"): defaulting to english");
  sources.languageText=languagePacks["langData/en_US.json"];
  localStorage["language"]="en_US";
}
sources.settingsClass=class{
  constructor(){
    if(!localStorage["keySettings"]){
      this.keySettings={
        left:37, // left arrow key
        right:39, // right arrow key
        powerup:38 // up arrow key
      };
    } else {
      this.keySettings=JSON.parse(localStorage["keySettings"]);
    }
    if(!localStorage["aiDifficulty"]){
      this.aiDifficulty=0.5;
    } else {
      this.aiDifficulty=parseFloat(localStorage["aiDifficulty"]);
    }
  }
  setKeys(keySettings){
    if(keySettings) this.keySettings=keySettings;
    localStorage["keySettings"]=JSON.stringify(keySettings);
  }
  setAIDifficulty(aiDifficulty){
    if(aiDifficulty) this.aiDifficulty=aiDifficulty;
    localStorage["aiDifficulty"]=aiDifficulty;
  }
  getPopup(interfaceElement){
    let thisClass=this;
    function keySetButton(title,id,x,y,w,h){
      let btn=new sources.buttonClass(sources.languageText["settingsKeySetBtn"].replace("%a",title),x,y,w,h,"popup");
      btn.setClickEvent(()=>{
        btn.text=sources.languageText["settingsWaitingKey"];
        sources.keyboard.onStart=((key)=>{
          btn.text=sources.languageText["settingsKeySetBtn"].replace("%a",title);
          sources.keyboard.onStart=null;
          let newkeys=thisClass.keySettings;
          newkeys[id]=key;
          thisClass.setKeys(newkeys);
        })
      });
      return btn;
    }
    function keyCodeRepresentation(code){
      if(code>=37&&code<=40){return sources.languageText["settingsArrowKey"].replace("%a",sources.languageText["settingsArrowKeyDirections"][code-37]);}
      if(code>=48&&code<=57){return sources.languageText["settingsNumberKey"].replace("%a",code-48);}
      if(code>=65&&code<=90){return sources.languageText["settingsLetterKey"].replace("%a",String.fromCharCode(code));}
      if(code>=96&&code<=105){return sources.languageText["settingsNumpadKey"].replace("%a",code-96);}
      if(code>=112&&code<=123){return sources.languageText["settingsFunctionKey"].replace("%a",code-112+1);}
      return sources.languageText["settingsUnknownKey"].replace("%a",code);
    };
    function swapButton(x,y,direction,list,elem,set){
      let btn=new sources.buttonClass((direction==1?"->":"<-"),x,y,30,30,"popup");
      btn.setClickEvent(()=>{
        console.log(elem,list);
        let index=Object.keys(list).indexOf(getKeyByValue(list,elem));
        console.log(index);
        if(index==-1){return;}
        if(direction==-1){index--;};
        if(direction==1){index++;};
        if(index<0){index=Object.keys(list).length-1;}
        if(index>=Object.keys(list).length){index=0;}
        console.log(index);
        elem=list[Object.keys(list)[index]];
        console.log(elem);
        set(elem);
      });
      return btn;
    }
    return new sources.popupClass(sources.languageText["settingsPopupTitle"],(ctx)=>{
      ctx.font="bold 32px Arial";
      ctx.fillStyle="#fff";
      ctx.fillText(sources.languageText["settingsKeyboardGroup"],100,200);
      ctx.font="24px Arial";
      ctx.fillText(sources.languageText["settingsControlsLeft"]+": "+keyCodeRepresentation(this.keySettings.left),100,250);
      ctx.fillText(sources.languageText["settingsControlsRight"]+": "+keyCodeRepresentation(this.keySettings.right),100,280);
      ctx.fillText(sources.languageText["settingsControlsPowerup"]+": "+keyCodeRepresentation(this.keySettings.powerup),100,310);
      ctx.font="bold 32px Arial";
      ctx.fillStyle="#fff";
      ctx.fillText(sources.languageText["settingsLanguageGroup"],100,360);
      ctx.font="24px Arial";
      ctx.fillText(sources.languageText["langPackMeta"]["languageName"],100,400);
      ctx.fillText(sources.languageText["settingsLanguageCode"].replace("%a",sources.languageText["langPackMeta"]["languageCode"]),100,430);
      ctx.fillText(sources.languageText["settingsLanguageAuthor"].replace("%a",sources.languageText["langPackMeta"]["author"]),100,460);
      let desc=sources.languageText["langPackMeta"]["description"].split("\n");
      for(let i=0;i<M.min(desc.length,3);i++){
        ctx.fillText(desc[i],100,500+i*28,ctx.canvas.width-100*2);
      }
      ctx.font="bold 32px Arial";
      ctx.fillStyle="#fff";
      ctx.fillText(sources.languageText["settingsSingleplayerGroup"],100,600);
      ctx.font="24px Arial";
      ctx.fillText(sources.languageText["settingsSingleplayerPlayerDifficulty"],100,630);
    },()=>{
      console.log(sources.languageText["langPackMeta"]["languageCode"],localStorage["language"])
      if(sources.languageText["langPackMeta"]["languageCode"]!=localStorage["language"]){
        localStorage["language"]=sources.languageText["langPackMeta"]["languageCode"];
        location.reload();
        return;
      }
      game.menu="title";
    },1000,700,interfaceElement,[
      keySetButton(sources.languageText["settingsKey"],"left",460,230,100,25),
      keySetButton(sources.languageText["settingsKey"],"right",460,260,100,25),
      keySetButton(sources.languageText["settingsKey"],"powerup",460,290,100,25),
      swapButton(360,338,-1,languagePacks,sources.languageText,(a)=>{sources.languageText=a}),
      swapButton(400,338,1,languagePacks,sources.languageText,(a)=>{sources.languageText=a}),
      new sources.sliderClass(400,610,200,20,0,1,this.aiDifficulty,"popup",(a)=>{thisClass.setAIDifficulty(a)})
    ])
  }
}