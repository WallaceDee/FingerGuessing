export default class SettingModal extends Laya.Scene {

    constructor(updateSettingCallbackHandle) {
        super()
        this.updateSettingCallbackHandle=updateSettingCallbackHandle
        this.loadScene("Component/SettingModal.scene")
        this.visible=false
    }
    onEnable() {
        this.init()
    }
    init(){
        this.mode=0
        this.zOrder=2
        this.closeButton.on(Laya.Event.CLICK,this,this.close)
        this.okButton.on(Laya.Event.CLICK,this,this.onOkButtonClick)
        this.restartButton.on(Laya.Event.CLICK,this,this.onOkButtonClick)
        
        this.modeRadio.selectHandler = new Laya.Handler(this, (index) => {
            this.mode = index
        })
    }
    close(){
        this.visible=false
    }
    onOkButtonClick(){
        this.updateSettingCallbackHandle.runWith(this.mode)
        this.close()
    }
}