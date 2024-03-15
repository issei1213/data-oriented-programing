import _ from "lodash";

// カタログデータ
var catalogData = {
    booksByIsbn: {
        "978-1779501127": {
            isbn: "978-1779501127",
            title: "Watchmen",
            publicationYear: 1987,
            authorIds: ["alan-moore", "dave-gibbons"],
            bookItems: [
                {
                    id: "book-item-1",
                    libId: 'nyc-central-lib',
                    isLent: false
                },
                {
                    id: "book-item-2",
                    libId: 'nyc-central-lib',
                    isLent: true
                }
            ]
        }
    },
    authorsById: {
        "alan-moore": {
            name: "Alan Moore",
            bookIsbns: ["978-1779501127"]
        },
        'dave-gibbons': {
            name: "Dave Gibbons",
            bookIsbns: ["978-1779501127"]
        }
    }
}

// 本のタイトルを取得するコード
// ["booksByIsbn", "978-1779501127", "title"]の箇所が情報パスになる。
console.log(_.get(catalogData, ["booksByIsbn", "978-1779501127", "title"]))

const title = _get(catalogData, ["booksByIsbn", "978-1779501127", "title"])
console.log(title)
console.log(_.get(catalogData, ["booksByIsbn", "978-1779501127", "title"]))

// get関数のカスタム実装
function get(m, path) {
    var res = m

    for (var i = 0; i < path.length; i++) {
        var key = path[i]
        res = res[key]
    }

    return res
}

console.log(get(catalogData, ["booksByIsbn", "978-1779501127", "title"]))