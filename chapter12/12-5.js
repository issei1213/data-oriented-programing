import { JSONSchemaFaker } from 'json-schema-faker';
import { catalogSchema } from './12-3.js';
import { Catalog } from './12-2.js';
import _ from 'lodash';

// // UUIDスキーマに準拠するランダムデータを生成
// var uuidSchema = {
//   type: 'string',
//   pattern: '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}' + '-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}',
// };

// JSONSchemaFaker.generate(uuidSchema);

// // 目録のスキーマに準拠するランダムなデータを生成
// JSON.stringify(JSONSchemaFaker.generate(catalogSchema));

// 書籍検索のデータスキーマに基づく単体テストの完成版
(function searchBooksTest() {
  var catalogRandom = JSONSchemaFaker.generate(catalogSchema);
  var queryRandom = JSONSchemaFaker.generate({ type: 'string' });

  console.log("%o", catalogRandom);
//   console.log(JSON.stringify(JSONSchemaFaker.generate(catalogSchema)));

  try {
    var firstBook = _.values(_.get(catalogRandom, 'booksByIsbn'))[0];
    var query = _.get(firstBook, 'title').substring(0, 3);
    Catalog.searchBooksByTitle(catalogRandom, query);

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}());