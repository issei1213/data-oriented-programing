import _ from 'lodash';
import ajv from 'ajv';

// タイトルがクエリとマッチする本を取得
var dbSearchResultSchema = {
  type: 'array',
  items: {
    type: 'object',
    required: ['isbn', 'available'],
    properties: {
      title: { type: 'string' },
      available: { type: 'boolean' },
    },
  },
};

class CatalogDB {
  static matchingBooks(title) {
    var matchingBooksQuery = `
            SELECT isbn, available
            FROM books 
            WHERE title = '%$1%''
        `;
    var books = dbClient.query(catalogDB, matchingBooksQuery, [title]);
    if (!ajv.validate(dbSearchResultSchema, books)) {
      var errors = ajv.errorsText(ajv.errors);
      throw 'Internal error: Unexpected result from the database: ' + errors;
    }

    return books;
  }
}

// OpenLibraryから複数の本の書籍情報を取得
class OpenLibraryDataSource {
  static rawBookInfo(isbn) {
    var url = `https://openlibrary.org/isbn/${isbn}.json`;
    // レスポンスのボディでJSONを取得
    var jsonString = fetchResponseBody(url);
    return JSON.parse(jsonString);
  }

  static bookInfo(isbn, requestedFields) {
    var relevantFields = ['title', 'full_title', 'subtitle', 'publisher', 'publidate_date', 'weight', 'physical_dimensions'];
    var rowInfo = rowBookInfo(isbn);
    if (!ajv.validate(dbSearchResultSchema, rowInfo)) {
      var errors = ajv.errorsText(ajv, errors);
      throw 'Internet error: Unexpected result from Open Books API: ' + errors;
    }

    var relevantInfo = _.pick(_.pick(rowInfo, relevantFields), requestedFields);
    return _.set(relevantInfo, 'isbn', isbn);
  }

  static multipleBookInfo(isbns, fields) {
    return _.map(function (isbn) {
      return bookInfo(isbn, fields);
    }, isbns);
  }
}

// _keyBy()を使って配列をマップに変換
// var books = [
//     {
//         title: "7 Habits of Highly Effective People",
//         isbn: "978-1982137274",
//         available: true
//     },
//     {
//         title: "The Pragmatic Programmer",
//         isbn: "978-0201616224",
//         available: true
//     }
// ]

// console.log(_.keyBy(books, 'isbn'))

// 配列を結合するためのジェネリック関数
function joinArrays(a, b, keyA, keyB) {
  var mapA = _.keyBy(a, keyA);
  var mapB = _.keyBy(b, keyB);
  var mapsMerged = _.merge(mapA, mapB);
  return _.values(mapsMerged);
}

// joinArrays()の単体テスト
var dbBookInfos = [
  {
    isbn: '978-1982137274',
    title: '7 Habits of Highly Effective People',
    available: true,
  },
  {
    isbn: '978-0812981605',
    title: 'The Power of Habit',
    available: false,
  },
];

var openLibBookInfos = [
  {
    isbn: '978-0812981605',
    title: '7 Habits of Highly Effective People',
    subtitle: 'Powerful Lessons in Personal Change',
    number_of_pages: 432,
  },
  {
    isbn: '978-1982137274',
    title: 'The Power of Habit',
    subtitle: 'Why We Do What We Do in Life and Business',
    subjects: ['Social Psychology', 'Habits', 'Change (Psychology)'],
  },
];

var joinedArrays = [
  {
    available: true,
    isbn: '978-1982137274',
    subjects: ['Social Psychology', 'Habits', 'Change (Psychology)'],
    subtitle: 'Why We Do What We Do in Life and Business',
    title: 'The Power of Habit',
  },
  {
    available: false,
    isbn: '978-0812981605',
    number_of_pages: 432,
    subtitle: 'Powerful Lessons in Personal Change',
    title: '7 Habits of Highly Effective People',
  },
];

_.isEqual(joinedArrays, joinArrays(dbBookInfos, openLibBookInfos, 'isbn', 'isbn'));
// true

// 本の検索と本の詳細情報
class Catalog {
  static enrichedSearchBooksByTitle(searchPayload) {
    if (!ajv.validate(searchBooksRequestSchema, searchPayload)) {
      var errors = ajv.errorsText(ajv.errors);
      throw 'Invalid request: ' + errors;
    }

    var title = _.get(searchPayload, 'title');
    var requestedFields = _.get(searchPayload, 'fields');

    var dbBookInfos = CatalogDataSource.matchingBooks(title);
    var isbns = _.map(dbBookInfos, 'isbn');

    var openLibBookInfos = OpenLibraryDataSource.multipleBookInfo(isbns, requestedFields);

    var res = joinArrays(dbBookInfos, openLibBookInfos);
    if (!ajv.validate(searchBooksResponseSchema, res)) {
      var errors = ajv.errorsText(ajv.errors);
      throw 'Invalid response: ' + errors;
    }

    return res;
  }
}
