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
        playerName: cc.Label,
        timer:0,
        MAX_TIME:0.5
    },
    
    // other methods
    setDestination(dest) {
        this.destination = dest;
        this.timer = 0;
    },

    // LIFE-CYCLE CALLBACKS:

    start () {
    },

    update (dt) {
        if(!this.node.position.equals(this.destination)) {
            this.timer += dt;
            if(this.timer > this.MAX_TIME){
                this.timer = this.MAX_TIME;
                this.node.position = this.destination;
            }else{
                let outPos = new cc.Vec2();
                this.node.position.lerp(this.destination, this.timer/this.MAX_TIME, outPos);
                this.node.position = outPos;
            }
        }
    },
});
