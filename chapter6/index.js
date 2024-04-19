import _ from "lodash"

console.log(_.isEqual({
    name: 'Alan Moore',
    bookIsbns: ['978-1779501127']
}, {
    name: 'Alan Moore',
    bookIsbns: ['bad=isbn']
}))

var dataIn = {
    //  入力
}

var dataOut = {
    // 期待される出力
}

_.isEqual(f(dataIn), dataOut)