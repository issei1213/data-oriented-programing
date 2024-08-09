import Ajv from 'ajv/dist/2020.js';
import { multi, method } from '@arrows/multimethod';

var ajv = new Ajv();

function dev() {
  return true;
}
// 動物のスキーマ
var animalSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    type: { type: 'string' },
  },
  required: ['type', 'name'],
};

// 動的ディスパッチに基づくディスパッチ関数を使うマルチメソッド
function dysGreetDispatch(animal) {
  if (dev()) {
    if (!ajv.validate(animalSchema, animal)) {
      var errors = ajv.errorsText(ajv.errors);
      throw 'dysGreet called with invalid arguments: ' + errors;
    }
  }

  var hasLongName = animal.name.length > 5;

  return [animal.type, hasLongName];
}

var dysGreet = multi(dysGreetDispatch);

// dysGreetメソッドの実装
function dysGreetDogLong(animal) {
  console.log('Woof woof! My name is ' + animal.name);
}
dysGreet = method(['dog', true], dysGreetDogLong)(dysGreet);

function dysGreetDogShort(animal) {
  console.log('Woof woof!');
}
dysGreet = method(['dog', false], dysGreetDogShort)(dysGreet);

function dysGreetCatLong(animal) {
  console.log('Meow! I am ' + animal.name);
}
dysGreet = method(['cat', true], dysGreetCatLong)(dysGreet);

function dysGreetCatShort(animal) {
  console.log('Meow!');
}
dysGreet = method(['cat', false], dysGreetCatShort)(dysGreet);

function dysGreetCowLong(animal) {
  console.log('Moo! My name is ' + animal.name);
}
dysGreet = method(['cow', true], dysGreetCowLong)(dysGreet);

function dysGreetCowShort(animal) {
  console.log('Moo!');
}
dysGreet = method(['cow', false], dysGreetCowShort)(dysGreet);

// メソッドのテスト
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

dysGreet(myDog);
dysGreet(myCat);
dysGreet(myCow);
// Woof woof! My name is Fido
// Meow! I am Milo
// Moo! My name is Clarabelle
