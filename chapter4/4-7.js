// 元に戻す機能を持つSystemStateクラス
class SystemState {
    systemData
    previousSystemData
    get() {
        return this.systemData
    }

    commit(previous, next) {
        var systemDataBeforeUpdate = this.systemData

        if(!Consitency.validate(previous, next)) {
            throw "The System data to be committed is invalid"
        }

        this.systemData = next
        this.previousSystemData = systemDataBeforeUpdate
    }

    undoLastMutation() {
        this.systemData = this.previousSystemData
    }
}