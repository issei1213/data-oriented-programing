import Ajv from 'ajv'

// var searchBooksRequestSchema = {
//     type: 'object',
//     properties: {
//         title: { type: 'string'},
//         fields: { type: 'array', items: {type: 'string'}},
//     },
//     required: ['title', 'fields']
// }

// var invalidSearchBooksRequest = {
//     myTitle: 'habit',
//     fields: ['title', 'weight', 'number_of_pages']
// }


// var ajv = new Ajv()
// ajv.validate(searchBooksRequestSchema, invalidSearchBooksRequest)
// console.log(ajv.errorsText(ajv.errors))


// 複数の検証エラーを補足
var searchBooksRequestSchema = {
    type: 'object',
    properties: {
        title: { type: 'string'},
        fields: { type: 'array', items: {type: 'string'}},
    },
    required: ['title', 'fields']
}

// 三つのエラーを発生させるリクエスト
var invalidSearchBooksRequest = {
    myTitle: 'habit',
    fields: [1, 2]
}

// 複数のエラーを補足するために、AjvコンストラクをallErrors: trueで呼び出す
var ajv = new Ajv({allErrors: true})
ajv.validate(searchBooksRequestSchema, invalidSearchBooksRequest)

// エラーを人間が理解しやすい形式に変換
console.log(ajv.errorsText(ajv.errors));


{
    "type": "array",
    "items": {
        
    }
}