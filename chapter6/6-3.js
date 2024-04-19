import _ from 'lodash';

class Catalog {
    static authorNames(catalogData, authorIds) {
        return _.map(authorIds, function(authorId) {
            return _.get(catalogData, ["authorsById", authorId, "name"]);
        });
    }

    static bookInfo(catalogData, book) {
        var bookInfo =  {
            "title": _.get(book, "title"),
            "isbn": _.get(book, "isbn"),
            "authorNames": Catalog.authorNames(catalogData, _.get(book, "authorIds"))
        };
        return bookInfo;
    }

    static searchBooksByTitle(catalogData, query) {
        var allBooks = _.get(catalogData, "booksByIsbn");
        var matchingBooks = _.filter(allBooks, function(book) {
            return _.get(book, "title").includes(query);
        });
        var bookInfos = _.map(matchingBooks, function(book) {
            return Catalog.bookInfo(catalogData, book);
        });
        return bookInfos;
    }
}

class Library {
    static searchBooksByTitleJSON(libraryData, query) {
        var catalogData = _.get(libraryData, "catalog");
        var results = Catalog.searchBooksByTitle(catalogData, query);
        var resultsJSON = JSON.stringify(results);
        return resultsJSON;
    }
}


var libraryData = {
    "catalog": {
        "booksByIsbn": {
            "978-1779501127": {
                "isbn": "978-1779501127",
                "title": "Watchmen",
                "publicationYear": 1987,
                "authorIds": ["alan-moore",
                    "dave-gibbons"]
            }
        },
        "authorsById": {
            "alan-moore": {
                "name": "Alan Moore",
                "bookIsbns": ["978-1779501127"]
            },
            "dave-gibbons": {
                "name": "Dave Gibbons",
                "bookIsbns": ["978-1779501127"]
            }
        }
    }
};


var bookInfo = {
    "isbn": "978-1779501127",
    "title": "Watchmen",
    "authorNames": ["Alan Moore",
        "Dave Gibbons"]
};


console.log(
    _.isEqual(
        JSON.parse(Library.searchBooksByTitleJSON(libraryData, "Watchmen")),
        [bookInfo]
    )
)

console.log(
    _.isEqual(
        JSON.parse(Library.searchBooksByTitleJSON(libraryData, "Batman")),
    [])
)