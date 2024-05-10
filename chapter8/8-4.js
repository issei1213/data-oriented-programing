class SystemState {
    systemData

    constructor() {
        this.systemData = new Atom()
    }

    get() {
        return this.systemData.get()
    }

    set(next) {
        this.systemData.set(next)
    }

    commit(previous, next){
        this.systemData.swap(function (current) {
            return SystemConsistency.reconcile(previous, current, next)
        })
    }
}