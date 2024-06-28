import Immutable from 'immutable';
import _ from 'lodash';

Immutable.reduce = function(coll, reducer, initialReduction) {
  return coll.reduce(reducer, initialReduction);
};

Immutable.isEmpty = function(coll) {
  return coll.isEmpty();
};

Immutable.keys = function(coll) {
  return coll.keySeq();
};

Immutable.isObject = function(coll) {
  return Immutable.Map.isMap(coll);
};

Immutable.isArray = Immutable.isIndexed;

Immutable.union = function() {
  return Immutable.Set.union(arguments);
};


Immutable.map = function(coll, f) {
  return coll.map(f);
};

Immutable.filter = function(coll, f) {
  if(Immutable.isMap(coll)) {
    return coll.valueSeq().filter(f);
  }
  return coll.filter(f);
};


Immutable.isEqual = Immutable.is;

class Catalog {
  static authorNames(catalogData, authorIds) {
    return Immutable.map(authorIds, function(authorId) {
      return Immutable.getIn(catalogData, ["authorsById", authorId, "name"]);
    });
  }

  static bookInfo(catalogData, book) {
    var bookInfo =  Immutable.Map({
      "title": Immutable.get(book, "title"),
      "isbn": Immutable.get(book, "isbn"),
      "authorNames": Catalog.authorNames(catalogData, Immutable.get(book, "authorIds"))
    });
    return bookInfo;
  }

  static searchBooksByTitle(catalogData, query) {
    var allBooks = Immutable.get(catalogData, "booksByIsbn");
    var queryLowerCased = query.toLowerCase();
    var matchingBooks = Immutable.filter(allBooks, function(book) {
      return Immutable.get(book, "title").toLowerCase().includes(queryLowerCased);
    });
    var bookInfos = Immutable.map(matchingBooks, function(book) {
      return Catalog.bookInfo(catalogData, book);
    });
    return bookInfos;
  }
}
var catalogData = Immutable.fromJS({
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
});

var bookInfo = Immutable.fromJS({
  "isbn": "978-1779501127",
  "title": "Watchmen",
  "authorNames": ["Alan Moore", "Dave Gibbons"]
});


Immutable.isEqual(
  Catalog.searchBooksByTitle(catalogData, "Watchmen"),
  Immutable.fromJS([bookInfo])
)


let UserManagement = {};
UserManagement.addMember = function (userManagement, member) {
  var email = Immutable.get(member, 'email');
  var infoPath = ["membersByEmail", email]
  if(Immutable.has(userManagement, infoPath)) {
    throw 'Member already exists.';
  }

  var nextUserManagement = Immutable.setIn(userManagement, infoPath, member)
  return nextUserManagement;
};

var jessie = Immutable.fromJS({
  "email": "jessie@gmail.com",
  "password": "my-secret"
})

var franck = Immutable.fromJS({
  "email": "frank@gmail.com",
  "password": "my-top-secret"
})

var userManagementStateBefore = Immutable.fromJS({
  "membersByEmail": {
    "frank@gmail.com": {
      "email": "frank@gmail.com",
      "password": "my-top-secret"
    }
  }
})

var expectedUserManagementStateAfter = Immutable.fromJS({
  "membersByEmail": {
    "jessie@gmail.com": {
      "email": "jessie@gmail.com",
      "password": "my-secret"
    },
    "frank@gmail.com": {
      "email": "frank@gmail.com",
      "password": "my-top-secret"
    }
  }
})

var result = UserManagement.addMember(userManagementStateBefore, jessie)
Immutable.isEqual(result, expectedUserManagementStateAfter)


var bookInfo = Immutable.fromJS({
  'isbn': "978-1779501127",
  "title": "Watchmen",
  "authorNames": ["Alan Moore", "Dave Gibbons"]
})

JSON.stringify(bookInfo)

Immutable.parsonJSON = function(jsonString) {
  return Immutable.fromJS(JSON.parse(jsonString))
}

function diffObjects(data1, data2) {
  var emptyObject = Immutable.isArray(data1) ? Immutable.fromJS([]) : Immutable.fromJS({});

  if(data1 == data2) {
    return emptyObject;
  }

  var keys = Immutable.union(Immutable.keys(data1), Immutable.keys(data2))
  return Immutable.reduce(keys, function (acc, k){
    var res = diff(Immutable.get(data1, k), Immutable.get(data2, k))
    if((Immutable.isObject(res) && Immutable.isEmpty(res)) || (res == "data-diff:no-diff")) {
      return acc;
    }
    return Immutable.set(acc, k, res)
  }, emptyObject)
}
function diff(data1, data2) {
  if(Immutable.isObject(data1) && Immutable.isObject(data2)) {
    return diffObjects(data1, data2)
  }

  if(data1 !== data2) {
    return data2
  }

  return "data-diff:no-diff"
}

var data1 = Immutable.fromJS({
  g: {
    c: 3
  },
  x: 2,
  y: {
    z: 1
  },
  w: [5]
})

var data2 = Immutable.fromJS({
  g: {
    c: 3
  },
  x: 2,
  y: {
    z: 2
  },
  w: [4]
})

console.log(
  Immutable.isEqual(diff(data1, data2), Immutable.fromJS({
    w: [
      4
    ],
    y: {
      z: 2
    }
  }))
);
