// データ検証を行わない書籍検索の実装
import _, { property } from 'lodash';

class Catalog {
  static authorNames(catalogData, book) {
    var authorIds = _.get(book, 'authorIds');
    var names = _.map(authorIds, function (authorId) {
      return _.get(catalogData, ['authorsById', authorId, 'name']);
    });

    return names;
  }

  static bookInfo(catalogData, book) {
    var bookInfo = {
      title: _.get(book, 'title'),
      isbn: _.get(book, 'isbn'),
      authorNames: Catalog.authorNames(catalogData, book),
    };

    return bookInfo;
  }

  static searchBooksByTitle(catalogData, query) {
    var allBooks = _.get(catalogData, 'booksByIsbn');
    var matchingBooks = _.filter(allBooks, function (book) {
      return _.includes(_.get(book, 'title').includes(query));
    });
    var bookInfos = _.map(matchingBooks, function (book) {
      return Catalog.bookInfo(catalogData, book);
    });

    return matchingBooks;
  }
}

/** 著者のスキーマ */
var authorSchema = {
  type: 'object',
  required: ['id', 'name', 'bookIsbns'],
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    bookIsbns: {
      type: 'array',
      items: { type: 'string' },
    },
  },
};

/** BookItemのスキーマ */
var bookItemSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    libId: { type: 'string' },
    purchaseDate: { type: 'string' },
    isLent: { type: 'boolean' },
  },
  required: ['id', 'libId', 'purchaseDate', 'isLent'],
};

var bookSchema = {
  type: 'object',
  required: ['isbn', 'title', 'authorIds', 'bookItems'],
  properties: {
    title: { type: 'string' },
    publicationYear: { type: 'integer' },
    isbn: { type: 'string' },
    authorIds: {
      type: 'array',
      items: { type: 'string' },
    },
    bookItems: {
      type: 'array',
      items: bookItemSchema,
    },
  },
};

/** 目録データのスキーマ */
var catalogSchema = {
  type: 'object',
  properties: {
    booksByIsbn: {
      type: 'object',
      additionalProperties: bookSchema,
    },
    authorsById: {
      type: 'object',
      additionalProperties: authorSchema,
    },
  },
  required: ['booksByIsbn', 'authorsById'],
};

/** Catalog.searchBooksByTitleの引数のスキーマ */
var searchBooksArgsSchema = {
  type: 'array',
  prefixItems: [catalogSchema, { type: 'string' }],
};

/** 関数の引数の検証を追加した書籍検索の実装 */
Catalog.searchBooksByTitle = function(catalogData, query) {
  // dev()の実装は実行環境に依存する
  // コードを開発環境で実行しているときはtrue、本番完了で実行しているときはfalseを返す
  if(dev()) {
    var args = [catalogData, query];
    if(!ajv.validate(searchBooksArgsSchema, args)) {
      var errors = ajv.errorsText(ajv.errors);
      throw('searchBooksByTitle called with invalid arguments: ' + errors)
    }
  }

  var allBooks = _.get(catalogData, 'booksByIsbn');
  var matchingBooks = _.filter(allBooks, function(book) {
    return _.get(book, 'title').includes(query);
  });

  var bookInfos = _.map(matchingBooks, function(book) {
    return Catalog.bookInfo(catalogData, book);
  });
}