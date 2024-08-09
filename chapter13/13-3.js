import Ajv from 'ajv/dist/2020.js';
import { multi, method } from '@arrows/multimethod';

var ajv = new Ajv();

function dev() {
  return true;
}

// 言語マップのスキーマ
var languageSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    type: { type: 'string' },
  },
  required: ['type', 'name'],
};

// 動物のスキーマ
var animalSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    type: { type: 'string' },
  },
  required: ['type', 'name'],
};

// ディスパッチ関数でマルチメソッドを初期化
var greetLangArgsSchema = {
  type: 'array',
  prefixItems: [animalSchema, languageSchema],
};

function greetDispatch(animal, language) {
  if (dev()) {
    if (!ajv.validate(greetLangArgsSchema, [animal, language])) {
      var errors = ajv.errorsText(ajv.errors);
      throw 'greetLang called with invalid arguments: ' + errors;
    }
  }

  // ディスパッチ値を配列で２要素指定する
  return [animal.type, language.type];
}

var greetLang = multi(greetDispatch);

// greetLangメソッドの実装
function greetLangDogEn(animal, language) {
  console.log('Woof! My name is ' + animal.name + ' and I speak ' + language.name);
}
greetLang = method(['dog', 'en'], greetLangDogEn)(greetLang);

function greetLangDogFr(animal, language) {
  console.log("Ouaf! Je m'appelle " + animal.name + ' et je parle ' + language.name);
}
greetLang = method(['dog', 'fr'], greetLangDogFr)(greetLang);

function greetLangCatEn(animal, language) {
  console.log('Meow! My name is ' + animal.name + ' and I speak ' + language.name);
}
greetLang = method(['cat', 'en'], greetLangCatEn)(greetLang);

function greetLangCatFr(animal, language) {
  console.log("Miaou! Je m'appelle " + animal.name + ' et je parle ' + language.name);
}
greetLang = method(['cat', 'fr'], greetLangCatFr)(greetLang);

function greetLangCowEn(animal, language) {
  console.log('Moo! My name is ' + animal.name + ' and I speak ' + language.name);
}
greetLang = method(['cow', 'en'], greetLangCowEn)(greetLang);

function greetLangCowFr(animal, language) {
  console.log("Meuh! Je m'appelle " + animal.name + ' et je parle ' + language.name);
}
greetLang = method(['cow', 'fr'], greetLangCowFr)(greetLang);

// 二つの言語マップ
var french = {
  type: 'fr',
  name: 'French',
};

var english = {
  type: 'en',
  name: 'English',
};

// マップで動物を表す
var myDog = {
  type: 'dog',
  name: 'Fido',
};

var myCat = {
  type: 'cat',
  name: 'Milo',
};

var myCow = {
  type: 'cow',
  name: 'Clarabelle',
};

// 複数ディスパッチを持つマルチメソッドの呼び出し
greetLang(myDog, french)
// Ouaf! Je m'appelle Fido et je parle French

greetLang(myDog, english)
// Woof! My name is Fido and I speak English

greetLang(myCat, french)
// Miaou! Je m'appelle Milo et je parle French

greetLang(myCat, english)
// Meow! My name is Milo and I speak English

greetLang(myCow, french)
// Meuh! Je m'appelle Clarabelle et je parle French

greetLang(myCow, english)
// Moo! My name is Clarabelle and I speak English
