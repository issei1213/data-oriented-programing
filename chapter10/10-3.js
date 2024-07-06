import _ from "lodash"

// SQLの結果に含まれているキーの名前を変更
function renameKyes(map, keyMap){
    return _.reduce(keyMap, function(res, newKey, oldKey) {
        var value = _.get(map, oldKey)
        var resWithNewKey = _.set(res, newKey, value)
        var resWithoutOldKey = _.omit(resWithNewKey, oldKey)
        return resWithoutOldKey
    },
    map)
}

function renameResultKeys(result, keyMap){
    return _.map(result, function(map) {
        return renameKyes(map, keyMap)
    })
}

// renamakeResultKeys()の単体テスト
var listOfMaps = [
    {
        "title": "7 Habit of Highly Effetctive People",
        "isbn": "978-1982137274",
        "publication_year": 1989
    },
    {
        "title": "The Power of Habit",
        "isbn": "978-0812981605",
        "publication_year": 2012
    }
]

var expectedResults = [
    {
        "bookTitle": "7 Habit of Highly Effetctive People",
        "bookISBN": "978-1982137274",
        "bookPublicationYear": 1989
    },
    {
        "bookTitle": "The Power of Habit",
        "bookISBN": "978-0812981605",
        "bookPublicationYear": 2012
    }
]


var results = renameResultKeys(listOfMaps, {
    "title": "bookTitle",
    "isbn": "bookISBN",
    "publication_year": "bookPublicationYear"
})

console.log(_.isEqual(results, expectedResults)) // true;
