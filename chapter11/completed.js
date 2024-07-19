import Ajv from 'ajv';

// 詳細検索のエンドポイントのスキーマ(Open Library Books API部分)
var basicBookInfoSchema = {
  type: 'object',
  required: ['title'],
  properties: {
    title: { type: 'string' },
    publishers: {
      type: 'array',
      items: { type: 'string' },
    },
    number_of_pages: { type: 'integer' },
    weight: { type: 'string' },
    physical_format: { type: 'string' },
    subjects: {
      type: 'array',
      items: { type: 'string' },
    },
    isbn_13: {
      type: 'array',
      items: { type: 'string' },
    },
    isbn_10: {
      type: 'array',
      items: { type: 'string' },
    },
    publish_date: { type: 'string' },
    physical_dimensions: { type: 'string' },
  },
};

var mandatoryIsbn13 = {
  type: 'object',
  required: ['isbn_13'],
};

var mandatoryIsbn10 = {
  type: 'object',
  required: ['isbn_10'],
};

var bookInfoSchema = {
  allof: [
    basicBookInfoSchema,
    {
      anyof: [mandatoryIsbn10, mandatoryIsbn13],
    },
  ],
};

// 詳細検索のエンドポイント(Open Library Books API部分)
var ajv = new Ajv({ allErrors: true });

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
    if (!ajv.validate(basicBookInfoSchema, rowInfo)) {
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

// 詳細検索のエンドポイント（データベース部分）
var dbClient;
var dbSearchResultScheme = {
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
    if (!ajv.validate(dbSearchResultScheme, books)) {
      var errors = ajv.errorsText(ajv.errors);
      throw 'Internal error: Unexpected result from the database: ' + errors;
    }

    return books;
  }
}

// 詳細検索のエンドポイントの実装のスキーマ
var searchBooksRequestSchema = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    fields: {
      type: 'array',
      items: {
        type: [
          'title',
          'full_title',
          'subtitle',
          'publisher',
          'publish_date',
          'weight',
          'physical_dimensions',
          'number_of_pages',
          'subjects',
          'publishers',
          'genre',
        ],
      },
    },
  },
  required: ['title', 'fields'],
};

var searchBooksResponseSchema = {
  type: 'object',
  required: ['title', 'isbn', 'available'],
  properties: {
    title: { type: 'string' },
    available: { type: 'boolean' },
    publishers: {
      type: 'array',
      items: { type: 'string' },
    },
    number_of_pages: { type: 'integer' },
    weight: { type: 'string' },
    physical_format: { type: 'string' },
    subjects: {
      type: 'array',
      items: { type: 'string' },
    },
    isbn: { type: 'string' },
    publish_date: { type: 'string' },
    physical_dimensions: { type: 'string' },
  },
};

// 詳細検索のエンドポイントのスキーマ（結合）
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

class Library {
  static searchBooksByTitle(payloadBody) {
    var payloadData = JSON.parse(payloadBody);
    var results = Catalog.enrichedSearchBooksByTitle(payloadData);
    return JSON.stringify(results);
  }
}
