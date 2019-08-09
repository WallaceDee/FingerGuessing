/**
 * 游戏控制脚本。定义了几个dropBox，bullet，createBoxInterval等变量，能够在IDE显示及设置该变量
 * 更多类型定义，请参考官方文档
 */
// import SinglePlay from './SinglePlay'
export default class Index extends Laya.Script {

    constructor() { super(); }
    onEnable() {
        this.init()
    }

    init() {
        console.log(this, this.owner.startButton)
        this.owner.singlePlayButton.on(Laya.Event.CLICK, this, this.onSinglePlayButtonClick)
        this.owner.multiPlayButton.on(Laya.Event.CLICK, this, this.onMultiPlayButtonClick)
    }

    onSinglePlayButtonClick() {
        // console.log(Laya.stage.addChild(new SinglePlay))
        Laya.Scene.open('Game/SinglePlay.scene')
        // this.loadScene("Game/SinglePlay.scene");
    }

    onMultiPlayButtonClick(){
        Laya.Scene.open('Game/MultiPlay.scene')
    }
    
}