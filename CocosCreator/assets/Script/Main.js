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

    onTouchBegan(event){
        let pos = this.node.convertToNodeSpace(event.touch.getLocation());
        cc.log(pos);
        this.curPlayer.setDestination(pos);
    },

    onTouchMoved(){

    },

    onTouchEnded(){

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.players = [];
        this.curPlayer = cc.instantiate(this.playerPrefab).getComponent("Player");
        this.curPlayer.node.setParent(this.node);
        // this.node.attach(this.curPlayer.node);
        this.players.push(this.curPlayer);
        this.initializeInputHandler();
    },

    start () {
        this.curPlayer.setDestination(new cc.Vec2(100, 100));
    },

    // update (dt) {},
});
