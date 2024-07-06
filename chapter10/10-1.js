import Ajv from 'ajv';
// JSON-Schemaのカンペ
// {
//     "type": "array",
//     "itmes": {
//         "type": "object",
//         "properties": {
//             "myNumber": { "type": "number" },
//             "myString": { "type": "string" },
//             "myEnum": { "enum": ["myVal", "yourVal"] },
//             "myBool": { "type": "boolean" }
//         },
//         "required": ["myNumber", "myString"],
//         "addtionalProperties": false
//     }
// }

var dbSerarchResultSchema = {
  type: 'array',
  items: {
    type: 'object',
    required: ['title', 'isbn', 'publication_year'],
    properties: {
      title: { type: 'string' },
      isbn: { type: 'string' },
      publication_year: { type: 'integer' },
    },
  },
};

// dbClientにはデータベース接続が含まれている
var dbClientにはデータベース接続が含まれている;

//すべてのデータ検証エラーを補足するために
// Ajv(JSONスキーマ検証ライブラリ)をallErrors: trueで初期化
var ajv = new Ajv({ allErrors: true });

var title = "habit"
var matchingBooksQuery = `
                            SELECT title, isbn, publication_year
                            FROM books
                            WHERE title LIKE '%$1%''
`
// パラメータを値のリスト（この場合は、値が一つだけ含まれたリスト）としてSQLクエリを渡す
var books = dbClient.query(matchingBooksQuery, [title])
if(!ajv.validate(dbSearchResultSchema, books)){
    var errors = ajv.errorsText(ajv.errors)
    throw "Internet error: Unexpected result from the database: " + errors
}

JSON.stringify(books)
