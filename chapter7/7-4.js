import Ajv from 'ajv';

// 外部APIレスポンスのスキーマ
var basicBookInfoSchema = {
  type: 'object',
  required: ['title'],
  properties: {
    title: { type: 'string' },
    publishers: { type: 'array', items: { type: 'string' } },
    number_of_pages: { type: 'integer' },
    weight: { type: 'string' },
    physical_format: { type: 'string' },
    subjects: {
      type: 'array',
      items: { type: 'string' },
    },
    isbn_13: { type: 'array', items: { type: 'string' } },
    isbn_10: { type: 'array', items: { type: 'string' } },
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
  allOf: [basicBookInfoSchema, { anyOf: [mandatoryIsbn13, mandatoryIsbn10] }],
};

// 外部APIレスポンスの検証
var bookInfo = {
  title: 'Watchmen',
  publishers: ['DC Comics'],
  number_of_pages: 334,
  weight: '1.4 pounds',
  physical_format: 'Paperback',
  subjects: ['Graphic Novels', 'Comics & Graphic Novels', 'Fiction', 'Fantastic fiction'],
  isbn_13: ['9780930289232'],
  isbn_10: ['0930289234'],
  publish_date: 'April 1, 1995',
  physical_dimensions: '10.1 x 6.6 x 0.8 inches',
};

var ajv = new Ajv();
console.log(ajv.validate(bookInfoSchema, bookInfo)); 
// true
