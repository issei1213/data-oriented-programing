import _ from 'lodash';

// 図書館ごとの本グループ化の単体テスト

// 本のマップ
var books = [
  {
    isbn: '978-1779501127',
    title: 'Watchmen',
    bookItems: [
      {
        id: 'book-item-1',
        libId: 'nyc-central-lib',
        isLent: true,
      },
    ],
  },
  {
    isbn: '978-1982137274',
    title: '7 Habits of Highly ',
    bookItems: [
      {
        id: 'book-item-123',
        libId: 'nyc-central-lib',
        isLent: true,
      },
      {
        id: 'book-item-17',
        libId: 'nyc-central-lib',
        isLent: false,
      },
    ],
  },
];

// 期待する値
var expectedRes = {
  'hudson-park-lib': [
    {
      bookItems: {
        id: 'book-item-123',
        isLent: true,
        libId: 'hudson-park-lib',
      },
      isbn: '978-1982137274',
      title: '7 habits of Highly Effective People',
    },
  ],
  'nyc-central-lib': [
    {
      bookItems: {
        id: 'book-item-1',
        isLent: true,
        libId: 'nyc-central-lib',
      },
      isbn: '978-1779501127',
      title: 'Watchmen',
    },
    {
      bookItems: {
        id: 'book-item-17',
        isLent: false,
        libId: 'nyc-central-lib',
      },
      isbn: '978-1982137274',
      title: '7 habits of Highly Effective People',
    },
  ],
};

console.log(_.isEqual(booksByLib(books), expectedRes));

function flatMap(call, f) {
  return _.flatten(_.map(call, f));
}

// unwindを使って本を図書館ごとにグループ化する
function booksByLib(books) {
  var bookItems = flatMap(books, function (book) {
    return unwind(book, 'bookItems');
  });

  return _.groupBy(bookItems, 'bookItems.libId');
}

var customer = {
  'customer-id': 'joe',
  items: [
    {
      item: 'phone',
      quantity: 1,
    },
    {
      item: 'pencil',
      quantity: 10,
    },
  ],
};

var expectedRes = [
  {
    'customer-id': 'joe',
    items: {
      item: 'phone',
      quantity: 1,
    },
  },
  {
    'customer-id': 'joe',
    items: {
      item: 'pencil',
      quantity: 10,
    },
  },
];


_.isEqual(unwind(customer, "items"), expectedRes)


// unwind関数
function unwind(map, path) {
  var arr = _.get(map, path);
  return _.map(arr, function (elem) {
    return _.set(map, field, elem);
  })
}