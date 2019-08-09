import ScoreBoard from './ScoreBoard.js'
import SettingModal from './SettingModal.js'
export default class MultiPlay extends Laya.Script {

    constructor() {
        super()
    }

    onEnable() {
        this.init()
    }

    init() {
        console.log(this)
        this.owner.y = Laya.stage.height / 2 - this.owner.height / 2
        this.mode = 0
        this.players = ['0', '1']
        this.gameStatus = false
        this.currentGameResult = [-1, -1]
        //0：未出拳 1：已出拳 -1：等待对方出拳判断结果 
        this.playerStatus = [0, 0]
        this.timer = [0, 0]

        this.players.forEach((index) => {
            this.owner[`player${index}`].getChildByName('goButton').on(Laya.Event.CLICK, this, () => { this.onGoButtonClick(index) })
        })
        this.owner.backButton.on(Laya.Event.CLICK, this, this.onBackButtonClick)
        this.owner.restartButton.on(Laya.Event.CLICK, this, this.restart)

        const gameOverCallbackHandler = new Laya.Handler(this, () => {
            this.owner.restartButton.visible = true
            this.setPlayerChildVisible('goButton',false)
        })

        this.scoreBoard = new ScoreBoard(0, gameOverCallbackHandler)
        this.owner.stage.addChild(this.scoreBoard)

        const updateSettingCallbackHandle = new Laya.Handler(this, this.changeMode)
        this.settingModal = new SettingModal(updateSettingCallbackHandle)
        this.owner.stage.addChild(this.settingModal)
        this.owner.settingButton.on(Laya.Event.CLICK, this, () => { this.settingModal.visible = true })

    }
    changeMode(mode) {
        this.setPlayerChildVisible('goButton',true)
        this.scoreBoard.changeMode(mode)
    }
    setPlayerChildVisible(childName,stauts, array = this.players) {
        array.forEach((index) => {
            this.owner[`player${index}`].getChildByName(childName).visible = stauts
        })
    }
    restart() {
        this.gameStatus = false
        this.currentGameResult = [-1, -1]
        //0：未出拳 1：已出拳 -1：等待对方出拳判断结果 
        this.playerStatus = [0, 0]
        this.timer = [0, 0]
        this.setPlayerChildVisible('result',false)
        this.setPlayerChildVisible('goButton',true)
        this.owner.restartButton.visible = false
        this.scoreBoard.initScoreBoard(this.mode)
    }

    onGoButtonClick(playerIndex) {
        const index = playerIndex
        const enemyStatus = this.playerStatus[Math.abs(index - 1)]
        const currentStatus = this.playerStatus[index]

        if (this.playerStatus[index] === 0) {
            this.owner[`player${index}`].getChildByName('goButton').label = 'Go!'
            Laya.timer.loop(120, this, this[`changeFinder${index}`])
            this.playerStatus[index] = -1
        } else if (this.playerStatus[index] === -1) {
            this.playerStatus[index] === -1
            this.timer[index] = 0
            Laya.timer.clear(this, this[`changeFinder${index}`])
            const result = this.getRandomFingerIndex()
            this.currentGameResult[index] = result
            this.owner[`player${index}`].getChildByName('finger').loadImage(`fingers/${result}.png`)
            this.owner[`player${index}`].getChildByName('goButton').label = 'Ready!'
            this.setPlayerChildVisible('goButton',false, [index])
        }
        if (this.currentGameResult[0] !== -1 && this.currentGameResult[1] !== -1) {
            this.gameStatus = false
        } else {
            this.gameStatus = true
        }
        if (!this.gameStatus) {
            this.players.forEach((index) => {
                this.playerStatus[index] = 0
                this.setPlayerChildVisible('goButton',true, [index])
            })
            let currentWinnerIndex = this.getCurrentGameWinnerIndex()
            if (currentWinnerIndex !== -1) {
                this.scoreBoard.update(currentWinnerIndex)

                this.setPlayerChildVisible('result',true)
   
                this.owner[`player${currentWinnerIndex}`].getChildByName('result').dataSource = 'WIN'
                this.owner[`player${Math.abs(currentWinnerIndex - 1)}`].getChildByName('result').dataSource = 'LOSE'
                this.owner[`player${currentWinnerIndex}`].getChildByName('result').color = '#ef332f'
                this.owner[`player${Math.abs(currentWinnerIndex - 1)}`].getChildByName('result').color = '#69dd1b'

            } else {
                this.owner.drawLabel.visible = true
                Laya.timer.once(1000, this, () => {
                    this.owner.drawLabel.visible = false
                })
            }
        } else {
            this.setPlayerChildVisible('result',false)
        }
    }

    getCurrentGameWinnerIndex() {
        const result = this.currentGameResult
        this.currentGameResult = [-1, -1]
        const temp = result[0] - result[1]
        const isDrawn = result[0] === result[1]
        if (isDrawn) {
            return -1
        } else if (temp > 0) {
            if (temp === 1) {
                return 0
            } else {
                return 1
            }
        } else {
            if (temp === -1) {
                return 1
            } else {
                return 0
            }
        }
    }

    changeFinder0() {
        this.timer[0]++
        this.owner.player0.getChildByName('finger').loadImage(`fingers/${this.timer[0] % 3}.png`)
    }

    changeFinder1() {
        this.timer[1]++
        this.owner.player1.getChildByName('finger').loadImage(`fingers/${this.timer[1] % 3}.png`)
    }

    onBackButtonClick() {
        Laya.Scene.open('Main/Index.scene')
        this.scoreBoard.close()
    }
    getRandomFingerIndex() {
        const randomIndex = Math.round(Math.random() * 2)
        return randomIndex
    }
}