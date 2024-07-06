import _ from "lodash";

// ISBNに基づいて行をグループ化
var sqlRows = [
    {
        title: "7 Habits of Highly Effective People",
        isbn: "978-1982137274",
        author_name: "Sean Covey"
    },
    {
        title: "7 Habits of Highly Effective People",
        isbn: "978-1982137274",
        author_name: "Stephen Covey"
    },
    {
        title: "The Power of Habit",
        isbn: "978-0812981605",
        author_name: "Charles Duhigg"
    }
]

// {
//     '978-1982137274': [
//       {
//         title: '7 Habits of Highly Effective People',
//         isbn: '978-1982137274',
//         author_name: 'Sean Covey'
//       },
//       {
//         title: '7 Habits of Highly Effective People',
//         isbn: '978-1982137274',
//         author_name: 'Stephen Covey'
//       }
//     ],
//     '978-0812981605': [
//       {
//         title: 'The Power of Habit',
//         isbn: '978-0812981605',
//         author_name: 'Charles Duhigg'
//       }
//     ]
//   }


// 著者の名前をまとめる
var rows7Habits = [
    {
        title: "7 Habits of Highly Effective People",
        isbn: "978-1982137274",
        author_name: "Sean Covey"
    },
    {
        title: "7 Habits of Highly Effective People",
        isbn: "978-1982137274",
        author_name: "Stephen Covey"
    }
]

// 任意のフィールドを集約
function agreegateField(rows, fieldName, agreegateFieldName) {
    var aggreegatedValues = _.map(rows, fieldName)
    var firstRow = _.nth(rows, 0)
    var firstRowWithAgreegatedValues = _.set(firstRow, agreegateFieldName, aggreegatedValues)

    return _.omit(firstRowWithAgreegatedValues, fieldName)
}

// agreegateFieldにテストケース
var expectedResults = {
    title: "7 Habits of Highly Effective People",
    isbn: "978-1982137274",
    authorNames: ["Sean Covey", "Stephen Covey"]
}

_.isEqual(agreegateField(rows7Habits, 'author_name', 'authorNames'), expectedResults);
// true

// rowsByIsbnで著者の名前を集約
var rowsByISBN = _.groupBy(sqlRows, 'isbn')
// {
//     '978-1982137274': [
//       {
//         title: '7 Habits of Highly Effective People',
//         isbn: '978-1982137274',
//         author_name: 'Sean Covey'
//       },
//       {
//         title: '7 Habits of Highly Effective People',
//         isbn: '978-1982137274',
//         author_name: 'Stephen Covey'
//       }
//     ],
//     '978-0812981605': [
//       {
//         title: 'The Power of Habit',
//         isbn: '978-0812981605',
//         author_name: 'Charles Duhigg'
//       }
//     ]
//   }

var grouptedRows = _.values(rowsByISBN)
// [
//     [
//       {
//         title: '7 Habits of Highly Effective People',
//         isbn: '978-1982137274',
//         author_name: 'Sean Covey'
//       },
//       {
//         title: '7 Habits of Highly Effective People',
//         isbn: '978-1982137274',
//         author_name: 'Stephen Covey'
//       }
//     ],
//     [
//       {
//         title: 'The Power of Habit',
//         isbn: '978-0812981605',
//         author_name: 'Charles Duhigg'
//       }
//     ]
//   ]

_.map(rowsByISBN, function(grouptedRows) {
    return agreegateField(grouptedRows, 'author_name', 'authorNames')
})
// [
//     {
//       title: '7 Habits of Highly Effective People',
//       isbn: '978-1982137274',
//       authorNames: [ 'Sean Covey', 'Stephen Covey' ]
//     },
//     {
//       title: 'The Power of Habit',
//       isbn: '978-0812981605',
//       authorNames: [ 'Charles Duhigg' ]
//     }
//   ]


// 任意のフィールドを集約
function agreegateField(rows, fieldName, agreegateFieldName) {
    var aggreegatedValues = _.map(rows, fieldName)
    var firstRow = _.nth(rows, 0)
    var firstRowWithAgreegatedValues = _.set(firstRow, agreegateFieldName, aggreegatedValues)

    return _.omit(firstRowWithAgreegatedValues, fieldName)
}


// 引数に集約したいフィールド名を追加
function agreegateFields(rows, idFidledName, fieldName, agreegateFieldName) {
    var grouptedRows = _.values(_.groupBy(rows, idFidledName))

    return _.map(grouptedRows, function (grouptedRows) {
        return agreegateField(grouptedRows, fieldName, agreegateFieldName)
    })
}


var expectedResults = [
    {
        title: '7 Habits of Highly Effective People',
        isbn: '978-1982137274',
        authorNames: ['Sean Covey', 'Stephen Covey']
    },
    {
        title: 'The Power of Habit',
        isbn: '978-0812981605',
        authorNames: ['Charles Duhigg']
    }
]

_.isEqual(agreegateFields(sqlRows, "isbn", "author_name", "authorNames"), expectedResults)
