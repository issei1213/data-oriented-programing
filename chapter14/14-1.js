import _ from 'lodash';

// 重複をとりのぞく（単純だが面倒な方法）
// function removeAuthorDuplicates(book) {
//   var authors = _.get(book, 'authors');
//   var uniqueAuthors = _.uniq(authors);

//   return _.set(book, 'authors', uniqueAuthors);
// }

// 重複を手際よく取り除くコード

// function removeAuthorDuplicates(book) {
//   return update(book, 'authors', _.uniq);
// }

// updateジェネリック関数
function update(map, path, fun) {
    var currentValue = _.get(map, path);
    var nextValue = fun(currentValue);
    return _.set(map, path, nextValue);
}

 // マップ内の値に2をかける
 var m = {
    position: "manager",
    income: 10000

 }

 console.log(update(m, "income", function(x) {
    return x * 2
 }))
