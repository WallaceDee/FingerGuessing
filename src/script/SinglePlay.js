/**
 * 游戏控制脚本。定义了几个dropBox，bullet，createBoxInterval等变量，能够在IDE显示及设置该变量
 * 更多类型定义，请参考官方文档
 */
export default class SinglePlay extends Laya.Script {

    constructor() {
        super()
    }

    onEnable() {
        this.init()
    }

    init() {
        //出拳状态
        this.status = false
        this.owner.content.y=Laya.stage.height/2-this.owner.content.height/2
        this.timer = 0
        this.owner.backButton.on(Laya.Event.CLICK, this, this.onBackButtonClick)
        this.owner.goButton.on(Laya.Event.CLICK, this, this.onGoButtonClick)
    }

    onBackButtonClick() {
        Laya.Scene.open('Main/Index.scene')
    }

    onGoButtonClick() {
        if (this.status) {
            this.status = false
            this.timer = 0
            Laya.timer.clear(this, this.changeFinder)
            this.getRandomFinger()
            this.owner.goButton.label = 'Ready!'
        } else {
            this.status = true
            this.owner.goButton.label = 'Go!'
            Laya.timer.loop(120, this, this.changeFinder)
        }
    }

    changeFinder() {
        this.timer++
        this.owner.fingers.loadImage(`fingers/${this.timer % 3}.png`)
    }

    getRandomFinger() {
        // return 
        const randomIndex = Math.round(Math.random() * 2)
        this.owner.fingers.loadImage(`fingers/${randomIndex}.png`)
    }
}