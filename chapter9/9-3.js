import Immutable from 'immutable';

var libraryData = Immutable.fromJS({
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
});

// console.log(Immutable.get(libraryData, 'catalog'))
//Map {
//   size: 2,
//   _root: ArrayMapNode { ownerID: OwnerID {}, entries: [ [Array], [Array] ] },
//   __ownerID: undefined,
//   __hash: undefined,
//   __altered: false
// }

// console.log(Immutable.getIn(libraryData, ['catalog', 'booksByIsbn', '978-1779501127', 'title']))
// Watchmen

const after = Immutable.setIn(libraryData, ['catalog', 'booksByIsbn', '978-1779501127', 'publicationYear'], 1988)

console.log(libraryData['catalog'])
// 1988

