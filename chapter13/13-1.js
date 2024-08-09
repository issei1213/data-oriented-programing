import Ajv from 'ajv';

var ajv = new Ajv();

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

// 関数毎に異なる実装
function greetDog(animal) {
  console.log('Woof woof! My name is ' + myDog.name);
}

function greetCat(animal) {
  console.log('Meow! My name is ' + myCat.name);
}

function greetCow(animal) {
  console.log('Moo! My name is ' + myCow.name);
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

function dev() {
  return true;
}

// 型に応じて振る舞いが異なるswitchケース
function greet(animal) {
  if (dev()) {
    if (!ajv.validate(animalSchema, animal)) {
      var errors = ajv.errorsText(ajv.errors);
      throw 'greet called with invalid arguments: ' + errors;
    }
  }

  switch (animal.type) {
    case 'dog':
      greetDog(animal);
      break;
    case 'cat':
      greetCat(animal);
      break;
    case 'cow':
      greetCow(animal);
      break;
  }
}
