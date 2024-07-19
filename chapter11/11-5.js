import _, { property } from 'lodash';

// データベースから取得した書籍情報が含まれているマップ
var dataFromDb = {
  available: true,
  isbn: '978-1982137274',
};

// OpenLibraryDataBooksAPIから取得した書籍情報が含まれているマップ
var dataFromOpenLib = {
  title: '7 Habits of Highly Effective People : Revised and Updated',
  subtitle: 'Powerful Lessons in Personal Change',
  number_of_pages: 432,
  full_title: 'The 7 Habits of Highly Effective People: Powerful Lessons in Personal Change',
  publish_date: '2020',
  publishers: ['Simon & Schuster, Incorporated'],
};

// 二つのマップをマージ
_.merge(dataFromDb, dataFromOpenLib);

// 本の検索レスポンスのJSONスキーマ
var searchBooksResponseSchema = {
  type: 'object',
  required: ['title', 'isbn', 'available'],
  property: {
    title: { type: 'string' },
    available: { type: 'boolean' },
    publishers: {
      type: 'array',
      items: { type: 'string' },
    },
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
