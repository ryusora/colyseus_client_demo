// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        playerPrefab: cc.Prefab
    },

    // Input handler
    initializeInputHandler(){
        cc.log("initialize Input Handler");
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchBegan.bind(this));
    },
    initializeLobbyRoom(){
        let lobbyRoom = this.client.join("lobby", {contextID: this.roomID});
        lobbyRoom.onMessage.add(function(message) {
            if(message.roomReady) {
                lobbyRoom.leave(); // force player leave lobby
                this.initializeRoom();
                this.initializeInputHandler();
            }
        }.bind(this));
    },
    getPlayerAt(id){
        if(!this.players[id]) {
            this.players[id] = cc.instantiate(this.playerPrefab).getComponent("Player");
            this.players[id].node.setParent(this.node);
        }
        return this.players[id];
    },
    initializeRoom(){
        cc.log("initialize Context Room : " + this.roomID);
        this.room = this.client.join(this.roomID, {playerID: FBInstant.player.getID()});
        
        this.room.listen("players/:id/:attribute", (function(change) {
            cc.log("position",change);
            let id = change.path.id;
            let player = this.getPlayerAt(id);
            
            if(change.path.attribute == "position")
                player.setDestination(JSON.parse(change.value));
            else if(change.path.attribute == "name")
                player.setName(change.value)
        }).bind(this));

        this.room.onJoin.add(function(client){
            cc.log("new client has join");
            this.room.send({name: FBInstant.player.getName()});
        }.bind(this));
        
    },

    onTouchBegan(event){
        let pos = this.node.convertToNodeSpace(event.touch.getLocation());
        this.room.send(pos);
    },
    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        this.client = new Colyseus.Client("wss:mygameserver4test.herokuapp.com");
        this.players = {};
        this.roomID = FBInstant.context.getID() || FBInstant.player.getID();
        this.initializeLobbyRoom();
    },

    start () {
    },

    // update (dt) {},
});
