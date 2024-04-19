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


Catalog.authorNames = function (catalogData, authorIds) {
    return _.map(authorIds, function (authorId) {
        return _.get(catalogData, ["authorsById", authorId, "name"]);
    });
}
var catalogData = {
    "authorsById": {
        "alan-moore": {
            "name": "Alan Moore"
        },
        "dave-gibbons": {
            "name": "Dave Gibbons"
        }
    }
};

// console.log(_.isEqual(Catalog.authorNames(catalogData, []), []))
// console.log(_.isEqual(Catalog.authorNames(catalogData, ["alan-moore",]), ["Alan Moore"]))
// console.log(_.isEqual(Catalog.authorNames(catalogData, ["alan-moore", "dave-gibbons"]), ["Alan Moore", "Dave Gibbons"]))
// console.log(_.isEqual(Catalog.authorNames({}, []), []))
// console.log(_.isEqual(Catalog.authorNames({}, ["alan-moore"]), [undefined]))
// console.log(_.isEqual(Catalog.authorNames(catalogData, ["alan-moore", "albert-einstein"]), ["Alan Moore", undefined]))
// console.log(_.isEqual(Catalog.authorNames(catalogData, []), []))
// console.log(_.isEqual(Catalog.authorNames(catalogData, ["albert-einstein"]), [undefined]))

// 6.2.3
var catalogData = {
    "authorsById": {
        "alan-moore": {
            "name": "Alan Moore"
        },
        "dave-gibbons": {
            "name": "Dave Gibbons"
        }
    }
};

var book = {
    "isbn": "978-1779501127",
    "title": "Watchmen",
    "publicationYear": 1987,
    "authorIds": ["alan-moore", "dave-gibbons"]
};

var expectedResult = {
    "authorNames": ["Alan Moore", "Dave Gibbons"],
    "isbn": "978-1779501127",
    "title": "Watchmen",
};

var result = Catalog.bookInfo(catalogData, book);

console.log(_.isEqual(result, expectedResult))