import Ajv from 'ajv';
import { multi, method } from '@arrows/multimethod';

var ajv = new Ajv();

function dev() {
  return true;
}

// マップで動物を表す
// var myDog = {
//   type: 'dog',
//   name: 'Fido',
// };

// var myCat = {
//   type: 'cat',
//   name: 'Milo',
// };

// var myCow = {
//   type: 'cow',
//   name: 'Clarabelle',
// };

// 関数毎に異なる実装
// function greetDog(animal) {
//   console.log('Woof woof! My name is ' + myDog.name);
// }

// function greetCat(animal) {
//   console.log('Meow! My name is ' + myCat.name);
// }

// function greetCow(animal) {
//   console.log('Moo! My name is ' + myCow.name);
// }

// データの検証
// var animalSchema = {
//   type: 'object',
//   properties: {
//     name: { type: 'string' },
//     type: { type: 'string' },
//   },
//   required: ['type', 'name'],
// };

// greetマルチメソッドのディスパッチ関数
// function greetDispatch(animal) {
//   if (dev()) {
//     if (!ajv.validate(animalSchema, animal)) {
//       var errors = ajv.errorsText(ajv.errors);
//       throw 'greet called with invalid arguments: ' + errors;
//     }
//   }

//   return animal.type; // ディスパッチ値
// }

// var greet = multi(greetDispatch); // マルチメソッドの初期化

// 犬のgreetメソッドの実装
// function greetDog(animal) {
//   console.log('Woof woof! My name is ' + animal.name);
// }

// greet = method('dog', greetDog)(greet); // メソッドの追加

// // 猫のgreetメソッドの実装
// function greetCat(animal) {
//   console.log('Meow! My name is ' + animal.name);
// }

// greet = method('cat', greetCat)(greet); // メソッドの追加

// // 牛のgreetメソッドの実装
// function greetCow(animal) {
//   console.log('Moo! My name is ' + animal.name + "|" + animal.type);
// }

// greet = method('cow', greetCow)(greet); // メソッドの追加

// // 通常の関数と同じ様にマルチメソッドを呼び出す
// // greet(myDog); // Woof woof! My name is Fido

// // greet(myCat); // Meow! My name is Milo

// greet(myCow); // Moo! My name is Clarabelle

// greet({ type: 'elephant', name: 'Dumbo' }); // エラー

// デフォルト実装を定義
// function greetDefault(animal) {
//   console.log('Hello! My name is ' + animal.name);
// }

// greet = method(greetDefault)(greet); // デフォルト実装を追加

// // ディスパッチ値と一致するメソッドがない場合のマルチメソッドの呼び出し
// var myHouse = {
//   type: 'house',
//   name: 'Horace',
// }

// greet(myHouse); // Hello! My name is Horace
import Ajv from 'ajv';
import { multi, method } from '@arrows/multimethod';

var ajv = new Ajv();

function dev() {
  return true;
}


// データの検証
var animalSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    type: { type: 'string' },
  },
  required: ['type', 'name'],
};

// greetマルチメソッドのディスパッチ関数
function greetDispatch(animal) {
  if (dev()) {
    // 引数のデータ検証
    if (!ajv.validate(animalSchema, animal)) {
      var errors = ajv.errorsText(ajv.errors);
      throw 'greet called with invalid arguments: ' + errors;
    }
  }


  // animal.typeをディスパッチ値として使用
  return animal.type;
}

// マルチメソッドの初期化
var greet = multi(greetDispatch); 

// 追加のメソッドを定義。animalはanimalSchemaに準拠している
function greetCow(animal) {
  console.log('Moo! My name is ' + myCow.name);
}

// メソッドの追加
// greetDispatchの戻り値でanimal.typeを返しているため、ここではcowに対してgreetCow関数を追加している
greet = method('cow', greetCow)(greet);

greet({
  type: 'cow',
  name: 'Clarabelle',
});
