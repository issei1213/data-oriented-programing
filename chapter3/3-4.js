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

// 複数の本の著者の名前を計算
function authorNames(catalogData, book) {
    var authorIds = _.get(book,"authorIds")

    var names = _.map(authorIds, function(authorId) {
        return _.get(catalogData, ["authorsById", authorId, "name"])
    })

    return names
}

// BookレコードをBookInfoレコードに変換
function bookInfo(catalogData, book) {
    var bookInfo = {
        title: _.get(book, "title"),
        isbn: _.get(book, "isbn"),
        authorNames: authorNames(catalogData, book)
    }

    // bookInfoのためのクラスを作成する必要はない
    return bookInfo
}


// クエリとマッチする本を検索
function searchBooksByTitle(catalogData, query){
    // カタログデータから全ての本を取得
    var allBooks = _.values(_.get(catalogData, "booksByIsbn"))

    // クエリとマッチする本を検索
    var matchingBooks = _.filter(allBooks, function(book) {
        return _.get(book, 'title').includes(query)
    })

    // マッチした本をBookInfoレコードに変換
    var bookInfos = _.map(matchingBooks, function(book) {
        return bookInfo(catalogData, book)
    })

    return bookInfos

}


var libraryData = {
    catalog: {
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
}

// 図書館の本の検索結果をJSONで返す
function searchBookByTitleJSON(libraryData, query) {
    var results = searchBooksByTitle(_.get(libraryData, 'catalog'), query)
    var resultsJSON = JSON.stringify(results)

    return resultsJSON
}


class Catalog {
    static authorNames(catalogData, book) {
        var authorIds = _.get(book,"authorIds")

        var names = _.map(authorIds, function(authorId) {
            return _.get(catalogData, ["authorsById", authorId, "name"])
        })

        return names
    }

    static bookInfo(catalogData, book) {
        var bookInfo = {
            title: _.get(book, "title"),
            isbn: _.get(book, "isbn"),
            authorNames: Catalog.authorNames(catalogData, book)
        }

        // bookInfoのためのクラスを作成する必要はない
        return bookInfo
    }

    static searchBooksByTitle(catalogData, query){
        // カタログデータから全ての本を取得
        var allBooks = _.values(_.get(catalogData, "booksByIsbn"))

        // クエリとマッチする本を検索
        var matchingBooks = _.filter(allBooks, function(book) {
            return _.get(book, 'title').includes(query)
        })

        // マッチした本をBookInfoレコードに変換
        var bookInfos = _.map(matchingBooks, function(book) {
            return Catalog.bookInfo(catalogData, book)
        })

        return bookInfos
    }
}

class Library {
    static searchBookByTitleJSON(libraryData, query) {
        var results = Catalog.searchBooksByTitle(_.get(libraryData, 'catalog'), query)
        var resultsJSON = JSON.stringify(results)

        return resultsJSON
    }
}

console.log(Library.searchBookByTitleJSON(libraryData, "Watchmen"))