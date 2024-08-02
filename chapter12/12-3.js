// データ検証を行わない書籍検索の実装
import _ from 'lodash';
import Ajv from 'ajv';

var ajv = new Ajv();

export class Catalog {
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

  /** 関数の引数の検証を追加した書籍検索の実装 */
  static searchBooksByTitle(catalogData, query) {
    // dev()の実装は実行環境に依存する
    // コードを開発環境で実行しているときはtrue、本番完了で実行しているときはfalseを返す
    if (dev()) {
      var args = [catalogData, query];
      if (!ajv.validate(searchBooksArgsSchema, args)) {
        var errors = ajv.errorsText(ajv.errors);
        throw 'searchBooksByTitle called with invalid arguments: ' + errors;
      }
    }

    var allBooks = _.get(catalogData, 'booksByIsbn');
    var matchingBooks = _.filter(allBooks, function (book) {
      return _.get(book, 'title').includes(query);
    });

    var bookInfos = _.map(matchingBooks, function (book) {
      return Catalog.bookInfo(catalogData, book);
    });

    if (dev()) {
      if (!ajv.validate(searchBooksResponseScheme, bookInfos)) {
        var errors = ajv.errorsText(ajv.errors);
        throw 'searchBooksByTitle returned an invalid value: ' + errors;
      }
    }

    return bookInfos;
  }
}

/** 1900から2021までの整数のスキーマ */
var publicationYearSchema = {
  type: 'integer',
  minimum: 1900,
  maximum: 2021,
};

/** UUIDのスキーマ */
var uuidSchema = {
  type: 'string',
  pattern: '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}' + '-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}',
};

/** 日付のスキーマ */
var dateSchema = {
  type: 'string',
  format: 'date',
};

/** 改良された目録データのスキーマ(その1) */
var isbnSchema = {
  type: 'string',
  pattern: '-[0-9-]{10,20}',
};

var libIdSchema = {
  type: 'string',
  pattern: '^[a-z0-9-]{3,20}$',
};

var authorIdsSchema = {
  type: 'string',
  pattern: '[a-z-]{2,50}',
};

var bookItemSchema = {
  type: 'object',
  properties: {
    id: uuidSchema,
    libId: libIdSchema,
    purchaseDate: { type: 'string', format: 'date' },
    isLent: { type: 'boolean' },
  },
  required: ['id', 'libId', 'purchaseDate', 'isLent'],
};

/** 改良された目録データのスキーマ(その2) */
var bookSchema = {
  type: 'object',
  required: ['isbn', 'title', 'authorIds', 'bookItems'],
  properties: {
    title: { type: 'string' },
    publicationYear: publicationYearSchema,
    isbn: isbnSchema,
    authorIds: {
      type: 'array',
      items: authorIdsSchema,
    },
    bookItems: {
      type: 'array',
      items: bookItemSchema,
    },
  },
};

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

/** 目録データのスキーマ */
export var catalogSchema = {
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
  items: [catalogSchema, { type: 'string' }],
  minItems: 2,
  maxItems: 2,
};

/** Catalog.searchBooksByTitleの戻り値のスキーマ */
var searchBooksResponseScheme = {
  type: 'array',
  items: {
    type: 'object',
    required: ['title', 'isbn', 'authorNames'],
    properties: {
      title: { type: 'string' },
      isbn: { type: 'string' },
      authorNames: {
        type: 'array',
        items: { type: 'string' },
      },
    },
  },
};

function dev() {
  return true;
}
