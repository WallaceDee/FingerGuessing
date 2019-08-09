export default class ScoreBoard extends Laya.Scene {

    constructor(mode,overCallback) {
        super()
        //设置单例的引用方式，方便其他类引用
        this.overCallback=overCallback
        this.mode = mode
        console.log(this)
        this.loadScene("Component/ScoreBoard.scene")
    }
    onEnable() {
        this.players = ['0', '1']
        this.gameTimes = -1
        this.times = 0
        this.x = Laya.stage.width - this.width - 30
        this.y = Laya.stage.height / 2 - this.height / 2
        this.zOrder=1
        this.initScoreBoard()
    }
    changeMode(mode) {
        this.mode = mode
        this.initScoreBoard()
    }
    initScoreBoard() {
        this.resultLabel.visible = false
        switch (this.mode) {
            case 0:
            this.visible=true
                this.gameTimes = 1
                this.generateCheckBox()
                break
            case 1:
            this.visible=true
                this.gameTimes = 3
                this.generateCheckBox(3)
                break
            case 2:
            this.visible=true
                this.gameTimes = 5
                this.generateCheckBox(5)
                break
            default:
                this.gameTimes = -1
                // this.generateCheckBox(5)
                this.visible=false
                break
        }
    }

    generateCheckBox(count = 1) {
        this.players.forEach((playerIndex) => {
            let list = []
            for (let index = 0; index < count; index++) {
                let checkbox = new Laya.CheckBox
                checkbox.skin = 'comp/checkbox.png'
                checkbox.scaleX = .5
                checkbox.scaleY = .5
                checkbox.disabled = true
                checkbox.x = index * 40
                list.push(checkbox)
            }
            this.getChildByName(`player${playerIndex}Score`).destroyChildren()
            this.getChildByName(`player${playerIndex}Score`).addChildren(...list)
        })
    }
    update(winnerIndex) {
        if(this.gameTimes===-1){
            return false
        }
        this.getChildByName(`player${winnerIndex}Score`).getChildAt(this.times).selected = true
        this.judge()
    }
    judge() {
        let result = [0, 0]
        this.players.forEach((index) => {
            const currentPlayerScore = this.getChildByName(`player${index}Score`)
            const count = currentPlayerScore.numChildren
            for (let i = 0; i < count; i++) {
                // console.log()
                if (currentPlayerScore.getChildAt(i).selected) {
                    result[index]++
                }
            }
        })
       
        const isWinAready=result[0]===Math.ceil(this.gameTimes/2)||result[1]===Math.ceil(this.gameTimes/2)

        if (this.times === this.gameTimes - 1||isWinAready ) {
            let winnerIndex = result[0] > result[1] ? 0 : 1
            this.times = 0
            // this.initScoreBoard()
            // alert('游戏结束')
            this.resultLabel.visible = true
            this.resultLabel.getChildByName(`player${winnerIndex}`).dataSource = 'WINNER'
            this.resultLabel.getChildByName(`player${Math.abs(winnerIndex - 1)}`).dataSource = 'LOSER'
            this.resultLabel.getChildByName(`player${winnerIndex}`).color = '#ef332f'
            this.resultLabel.getChildByName(`player${Math.abs(winnerIndex - 1)}`).color = '#69dd1b'
            if(this.overCallback){
                this.overCallback.run()
            }

        } else {
            this.times++
        }


    }

}