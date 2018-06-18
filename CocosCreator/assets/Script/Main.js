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
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchBegan.bind(this));
    },
    initializeRoom(){
        this.client = new Colyseus.Client("wss:mygameserver4test.herokuapp.com");
        this.room = this.client.join("testColyseus");

        this.room.listen("players/:id/:position", (function(change) {
            cc.log("position",change);
            let id = change.path.id;
            if(change.operation.includes("add")) {
                if(!this.players[id]) {
                    this.players[id] = cc.instantiate(this.playerPrefab).getComponent("Player");
                    this.players[id].node.setParent(this.node);
                    this.players[id].setDestination(JSON.parse(change.value));
                    this.players[id].setName(id);
                }
            }else{
                if(this.players[id]){
                    this.players[id].setDestination(JSON.parse(change.value));
                }
            }
        }).bind(this));
    },

    onTouchBegan(event){
        let pos = this.node.convertToNodeSpace(event.touch.getLocation());
        this.room.send(pos);
    },
    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        this.players = {};
        this.initializeInputHandler();
        this.initializeRoom();
    },

    start () {
    },

    // update (dt) {},
});
