// var mutex = new Mutex();
// var counter = 0
//
// function dbAccess() {
//     mutex.lock();
//     counter++;
//     mutex.unlock();
//     // データベースにアクセス
// }
//
// function logCounter() {
//     mutex.lock();
//     console.log('Number of database access: ' + counter);
//     mutex.unlock();
// }


var counter = new Atom()
counter.set(0)

function dbAccess() {
    // 引数xはアトムの現在地。counter.get()と同じ
    counter.swap(function (x) {
        return x + 1
    })
    // データベースにアクセス
}

function logCounter() {
    console.log('Number of database access: ' + counter.get());
}

class Atom {
    state

    constructor() {}

    get() {
        return this.state
    }

    set(state) {
        this.state = state
    }

    swap(f) {
        while (true) {
            var stateSnapshot = this.state
            var nextState = f(stateSnapshot)
            // 関数fの実行中に別のスレッドでthis.stateが変更されている可能性があるため、
            // 特別なスレッドセーフの比較演算を使う
            if(!atomicCompareAndSet(this.state, stateSnapshot, nextState)) {
                continue
            }

            return nextState
        }
    }
}