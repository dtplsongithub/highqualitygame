sources.sfxManagerClass = class{
  constructor(){
    this.sfxObj = {};
    let sfxs=["sfxIntro.mp3","sfxBoost.mp3","sfxClick.wav", "sfxEliminate.mp3", "sfxGameover.mp3", "sfxLap.mp3", "sfxPowerup.mp3", "sfxPowerup2.mp3"].map((a)=>"sound/"+a);
    for(let i in sfxs){
      this.sfxObj[sfxs[i]]=new Audio(sound[sfxs[i]])
    };
    this.volume=1;
  }
  playAudio(name){
    console.log(name)
    this.sfxObj[name].currentTime=0;
    this.sfxObj[name].volume=this.volume;
    this.sfxObj[name].play();
  }
  hasUserInput(callback){
    let tmp=this.sfxObj["sound/sfxClick.wav"];
    tmp.volume=0;
    tmp.play().then(()=>{
      callback(true)
    }).catch(()=>{
      callback(false)
    })
  }
}
sources.bgmManagerClass = class{
  constructor(){
    this.currentAudio=new Audio();
    this.fadeVolume=this.volume=1;
  }
  fadeTo(time,name){
    let fadeInterval = setInterval(()=>{
      //console.log(this.volume)
      this.fadeVolume-=(1/time)*10;
      if(this.fadeVolume<=0){
        this.fadeVolume=1;
        clearInterval(fadeInterval);
        this.currentAudio=new Audio();
        this.currentAudio.volume=1;
        this.currentAudio.src=sound[name];
        this.currentAudio.loop=true;
        if(!sound[name]){window.renderer.notifications.notify("tried to play music that doesn't exist ("+name+")");return;}
        this.currentAudio.play().catch(()=>{
          window.renderer.notifications.notify("bgm cannot play - either user input is required or sound is broken")
          this.fadeTo(1000,name);
        });
      }
      this.volumeUpdate();
    },10)
  }
  volumeUpdate(){
    this.currentAudio.volume=this.volume*this.fadeVolume;
  }
}