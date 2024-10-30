sources.socketClass = class{
  constructor(){
    this.socket="none";
  }
  connect(url,callback){
    if(!io){throw new Error("socket.io does not exist.");}
    this.socket=io(url);
    this.socket.on("connect",()=>{
      //this.socket.emit("join");
      console.log(this.socket.id);
      callback();
    })
  }
  disconnect(){
    try{
      this.socket.disconnect();
    } catch {
      console.warn("could not disconnect socket.");
    }
    this.socket="none";
  }
  hasSocket(){
    return this.socket!="none";
  }
  send(type,data){
    if(!this.hasSocket()){throw new Error("tried to send data, while no socket exists");};
    if(type!="gamePlayerMove")console.log("->",type,data)
    this.socket.emit(type,data);
  }
  on(type,callback){
    if(!this.hasSocket()){throw new Error("tried to send data, while no socket exists");};
    this.socket.on(type,(a,b,c,d)=>{
      if(type!="gamePlayerMove")console.log("<-",type,a,b,c,d);
      callback(a,b,c,d);
    });
  }
}
sources.multiplayerClass = class{
  constructor(game){
    this.game=game;
    this.socket = new sources.socketClass();
    this.playerList=[];
  }
  connect(url,rulesCallback){
    this.socket.connect(url,()=>{
      /*this.socket.on("disconnect",()=>{
        this.game.menu="title";
      })*/
      this.socket.on("disconnect",()=>{
        this.socket.disconnect();
        this.game.menu="title";
      })
      this.socket.send("joinCredentials",{"id":this.socket.socket.id,"name":this.getNickname(),"color":this.getColor()});
      this.socket.on("confirmRules",(rules)=>{
        rulesCallback(rules,(accepted)=>{
          console.log(accepted);
          if(!accepted){
            this.disconnect();
            this.game.menu="title";
            return;
          };
          this.socket.send("rulesAccepted");
          this.chatHistory=[];
          this.socket.on("setState",(state)=>{
            if(state==0){this.game.menu="onlineLobby"} // chatting
            if(state==1){this.game.start(true);this.game.menu="game";this.updatePlayerList();};
          });
          this.socket.on("playerList",(list)=>{
            this.playerList=list;
            this.updatePlayerList();
          });
          this.socket.on("message",(msg)=>{
            this.chatHistory.push({"message":msg.message,"user":this.playerList.find(a=>a.id==msg.user),"uid":msg.user});
          });
          this.socket.on("gamePlayerMove",(data)=>{
            if(data.id==this.socket.socket.id){return;} // dont want lag!
            let player = this.game.leaderboard.playerList.currentList.find(a=>a.onlineId==data.id);
            [player.x,player.y]=[data.x,data.y];
          });
          this.socket.on("platformData",(data)=>{
            this.clearPlatforms();
            for(let i=0;i<data.length;i++){
              this.addPlatform(data[i]);
            }
          });
          this.socket.on("eliminatePlayer",(pid)=>{
            //alert(pid+" got eliminated");
            this.game.leaderboard.playerList.currentList.find(a=>a.onlineId==pid).eliminate(true);
          })
          this.socket.on("legPassed",(leg,pid)=>{
            //alert(pid+" passed leg and is now at leg "+leg)
            this.game.leaderboard.playerList.currentList.find(a=>a.onlineId==pid).currentLeg=leg;
          })
          this.socket.on("playerFreeze",(data)=>{
            let pid=data.id,time=data.time;
            this.game.playerList.currentList.find(a=>a.onlineId==pid).freezed=true;
            this.game.playerList.currentList.find(a=>a.onlineId==pid).freezeTime=time;
          })
          this.socket.on("playerUnfreeze",(pid)=>{
            this.game.playerList.currentList.find(a=>a.onlineId==pid).freezed=false;
          })
          this.socket.on("freezeBulletUpdate",(data)=>{
            let pw=game.powerupList.powerupList.find(a=>a.onlineId==data.id);
            if(pw){
              if(pw.onlineFromHost){
                return;
              } // dont want lag!
              console.log(pw.x,data.x);
              pw.x=data.x;
              console.log(pw.x);
              pw.y=data.y;
              pw.rot=data.rot;
            } else if(data.pid!=this.socket.socket.id) {
              this.game.powerupList.usePowerup({hasPowerup:true,currentPowerup:4},this.playerList,this.game);
              pw=this.game.powerupList.powerupList[this.game.powerupList.powerupList.length-1];
              [pw.x,pw.y,pw.rot,pw.onlineId]=[data.x,data.y,data.rot,data.id];
              pw.expire=60*10 // crucial for no freeze bullet cloning!!
              /*this.game.powerupList.powerupList[this.pwlist.powerupList.length-1].x=data.x;
              this.game.powerupList.powerupList[this.pwlist.powerupList.length-1].y=data.y;
              this.game.powerupList.powerupList[this.pwlist.powerupList.length-1].rot=data.rot;
              this.game.powerupList.powerupList[this.pwlist.powerupList.length-1].onlineId=data.id
              this.game.powerupList.powerupList[this.pwlist.powerupList.length-1].onlineFromHost=false;
              this.game.powerupList.powerupList[this.pwlist.powerupList.length-1].expire=60*10 // crucial!!*/
            }
          });
          this.socket.on("freezeBulletBreak",(data)=>{
            let pw = game.powerupList.powerupList.find(a=>a.onlineId==data.id)
            if(pw){
              pw.remove();
            } else {
              console.error("freeze bullet not found! id="+data.id);
            }
          })
        })
      })
    });
  }
  sendPlayerMove(player){
    this.socket.send("gamePlayerMove",{"id":this.socket.socket.id,"x":player.x,"y":player.y});
  }
  disconnect(){
    this.socket.disconnect();
  }
  getNickname(){
    if(!localStorage["onlineNickname"]){
        localStorage["onlineNickname"]="player"+[...Array(4)].map(()=>M.floor(M.random()*10)).join("");
    }
    return localStorage["onlineNickname"];
  }
  setNickname(name){
    localStorage["onlineNickname"]=name;
  }
  getColor(){
    if(!localStorage["onlineColor"]){
      localStorage["onlineColor"]="#"+M.floor(0xffffff*M.random()).toString(16).padStart(6,"0")
    }
    return localStorage["onlineColor"];
  }
  setColor(color){
    localStorage["onlineColor"]=color.split("").filter(a=>"#0123456789abcdef".split("").includes(a)).join("");
  }
  getPopup(interfaceElem){
    let linkElem = new sources.textInputClass(100,210,800,40,"popup","https://5808e17c-dbf2-44f9-b91a-4195d5593ef9-00-374xxw181cajj.spock.replit.dev/");
    let nameInput = new sources.textInputClass(100,300,800,40,"popup",this.getNickname());
    nameInput.setChangeEvent((a)=>{console.log(a);this.setNickname(a);});
    let colorInput = new sources.textInputClass(200,390,700,40,"popup",this.getColor());
    colorInput.setChangeEvent((a)=>{console.log(a);this.setColor(a);});
    let connectBtn = new sources.buttonClass("Connect",1152/2-1000/2,864/2+700/2-35,100,35,"popup");
    let out = new sources.popupClass("Multiplayer",(ctx)=>{
      ctx.font="24px Arial";
      ctx.fillStyle="#fff";
      ctx.fillText("Server link:",100,200);
      ctx.fillText("Name:",100,290);
      ctx.fillText("Color:",100,380);
      ctx.fillStyle=this.getColor();
      ctx.fillRect(100,390,60,60);
      ctx.fillStyle="#fff";
      let notes=["You're currently trying to join from a public IP address.\nPlease make sure that this address is legitimate before connecting.","You're currently trying to join from \"localhost\".\nOnly your computer will be able to join this room, unless you find your private IP address.","You're currently trying to join from a private IP address.\nMake sure that the computer hosting in this address has the same network as this computer.","You're currently trying to join from a human-friendly domain name, as HTTPS.","You're currently trying to join from a human-friendly domain name, as HTTP.\nDo not send any personal information while you're connected: passwords, credit card numbers, etc."].map(a=>a+"\nYou will get a popup of the server rules every time you try to connect.");
      let nidx=-1;
      let lnk=linkElem.value;
      if(lnk.split(".").filter(a=>(parseInt(a).toString()==a)).length==4){
        if(lnk.startsWith("192.168.1.")){
          nidx=2;
        } else {
          nidx=0;
        }
      }
      if(lnk.startsWith("localhost")){nidx=1;}
      if(lnk.startsWith("127.0.0.1")){nidx=1;}
      if(lnk.startsWith("http")&&lnk.split(".").length>=2&&lnk.replace("https","").replace("http","").replace("://","").split(".").filter(a=>(parseInt(a).toString()!=a)).length!=0){
        if(lnk.startsWith("https://")){nidx=3;}
        if(lnk.startsWith("http://")){nidx=4;}
      }
      let note=(nidx<0?"Invalid link":notes[nidx]).split("\n");
      for(let i=0;i<note.length;i++){
        ctx.fillText(note[i],100,650+i*28,900);
      }
    },()=>{this.game.menu="title";},1000,700,interfaceElem,[linkElem,nameInput,colorInput,connectBtn]);

    connectBtn.setClickEvent(()=>{
      this.game.menu="onlineConnecting";
      out.close();
      this.connect(linkElem.value,
        (rules,resume)=>{
          this.rules=rules;
          this.rulesConfirm=resume;
          renderer.popupList["onlineRules"].open();
        }
      );
    })
    
    return out;
  }
  getRulesPopup(interfaceElem){
    let acceptBtn=new sources.buttonClass("Accept",1152/2-1000/2,864/2+700/2-35,100,35,"popup");
    let out=new sources.popupClass("Server rules",(ctx)=>{
      let rulesDisp=(this.rules?this.rules:"No rules have been loaded yet").split("\n");
      ctx.font="24px Arial";
      ctx.fillStyle="#fff";
      for(let i=0;i<rulesDisp.length;i++){
        ctx.fillText(rulesDisp[i],100,170+i*28,900);
      };
    },()=>{this.rulesConfirm(false);},1000,700,interfaceElem,[acceptBtn]);
    acceptBtn.setClickEvent(()=>{this.rulesConfirm(true);out.close();})
    return out;
  }
  updatePlayerList(){
    //console.log(this.playerList);
    this.game.playerList.currentList=[]
    this.game.leaderboard.playerList.currentList=[]
    for(let i=0;i<this.playerList.length;i++){
      let cred=this.playerList[i].credentials;
      let player = new sources.playerClass(0,0,cred.color,cred.id==this.socket.socket.id,this.game.difficulty,cred.name);
      player.onlineId=this.playerList[i].id;
      console.log(player);
      //this.game.playerList.currentList.push(player);
      this.game.leaderboard.playerList.currentList.push(player);
      if(this.game.menu=="onlineLobby")player.eliminated=false;
    }
  }
  addPlatform(platform){
    //console.log(platform);
    let toAdd=new sources.platformsClass(platform.x,platform.width,platform.height,platform.type,platform.extraData);
    //console.log(toAdd);
    this.game.platformList.currentList.push(toAdd);
  }
  clearPlatforms(){
    this.game.platformList.currentList=[];
  }
  sendMessage(msg){
    this.socket.send("message",{"message":msg,"user":this.socket.socket.id});
  }
  startGame(){
    this.socket.send("requestGameStart");
  }
  requestPlatforms(){
    this.socket.send("requestPlatforms");
  }
  eliminatePlayer(pid){
    this.socket.send("eliminatePlayer",pid)
  }
  passedLeg(currentLeg){
    //alert("leg is now "+currentLeg);
    this.socket.send("legPassed",currentLeg);
  }
  unfreeze(pid){
    this.socket.send("playerUnfreeze",pid);
  }
  freezeUpdate(pid,time){
    this.socket.send("playerFreeze",{id:pid,time:time});
  }
  sendFreezeBulletUpdate(pw){
    if(!pw.onlineFromHost){return;}
    this.socket.send("freezeBulletUpdate",{"id":pw.onlineId,"pid":this.socket.socket.id,"x":pw.x,"y":pw.y,"rot":pw.rot});
  }
  sendFreezeBulletBreak(pw){
    if(!pw.onlineFromHost){return;}
    this.socket.send("freezeBulletBreak",{"id":pw.onlineId});
  }
}