import _ from 'lodash';
class SystemState {
  systemState;

  get() {
    return this.systemState;
  }

  commit(previous, next) {
    this.systemState = next;
  }
}

let System = {};
System.addMember = function (systemState, member) {
  var previous = systemState.get();
  var next = Library.addMember(previous, member);
  systemState.commit(previous, next);
};

let Library = {};
Library.addMember = function (library, member) {
  var currentUserManagement = _.get(library, 'userManagement');
  var nextUserManagement = UserManagement.addMember(currentUserManagement, member);
  var nextLibrary = _.set(library, 'userManagement', nextUserManagement);
  return nextLibrary;
};

let UserManagement = {};
UserManagement.addMember = function (userManagement, member) {
  var email = _.get(member, 'email');
  var infoPath = ['membersByEmail', email];
  if (_.has(userManagement, infoPath)) {
    throw 'Member already exists.';
  }
  var nextUserManagement = _.set(userManagement, infoPath, member);
  return nextUserManagement;
};

// 会員がいない状態でのUserManagement.addMemberのテストケース
// var member = {
//     email: 'jessi@gmail.com',
//     password: 'my-secret'
// }
//
// var userManagementStateBefore = {}
//
// var expectedUserManagementStateAfter = {
//     membersByEmail: {
//         "jessi@gmail.com": {
//             email: 'jessi@gmail.com',
//             password: 'my-secret'
//         }
//     }
// }
//
//
// var result = UserManagement.addMember(userManagementStateBefore, member);
//
// console.log(_.isEqual(result, expectedUserManagementStateAfter)); // true

// 会員がいる状態でのUserManagement.addMemberのテストケース
// var jessie = {
//     email: 'jessie@gmail.com',
//     password: 'my-secret'
// }
//
// var franck = {
//     email: 'franck@gmail.com',
//     password: 'my-top-secret'
// }
//
// var userManagementStateBefore = {
//     membersByEmail: {
//         "franck@gmail.com": {
//             email: 'franck@gmail.com',
//             password: 'my-top-secret'
//         }
//     }
// }
//
// var expectedUserManagementStateAfter = {
//     membersByEmail: {
//         "jessie@gmail.com": {
//             email: 'jessie@gmail.com',
//             password: 'my-secret'
//         },
//         "franck@gmail.com": {
//             email: 'franck@gmail.com',
//             password: 'my-top-secret'
//         }
//     }
// }
//
// var result = UserManagement.addMember(userManagementStateBefore, jessie);
// console.log(result)
//
// console.log(_.isEqual(result, expectedUserManagementStateAfter)); // true

// 失敗が期待される場合のUserManagement.addMember関数のテストケース
// var jessie = {
//   email: 'jessie@gmail.com',
//   password: 'my-secret',
// };

// var libraruyStateBefore = {
//   userManagement: {
//     membersByEmail: {
//       'jessie@gmail.com': {
//         email: 'jessie@gmail.com',
//         password: 'my-secret',
//       },
//     },
//   },
// };

// var expectedExcepton = 'Member already exists.';
// var exceptionInMutaion

// try {
//     UserManagement.addMember(libraruyStateBefore.userManagement, jessie);
// } catch (e) {
//     exceptionInMutaion = e;
// }

// console.log(_.isEqual(exceptionInMutaion, expectedExcepton)) // true;

// Library.addMember関数の単体テスト

// var jessie = {
//   email: 'jessie@gmail.com',
//   password: 'my-secret',
// };
//
// var franck = {
//   email: 'franck@gmail.com',
//   password: 'my-top-secret',
// };
//
// var libraryStateBefore = {
//   userManagement: {
//     membersByEmail: {
//       'franck@gmail.com': {
//         email: 'franck@gmail.com',
//         password: 'my-top-secret',
//       },
//     },
//   },
// };
//
// var expectedUserManagementStateAfter = {
//   membersByEmail: {
//     'jessie@gmail.com': {
//       email: 'jessie@gmail.com',
//       password: 'my-secret',
//     },
//     'franck@gmail.com': {
//       email: 'franck@gmail.com',
//       password: 'my-top-secret',
//     },
//   },
// };
//
// var result = Library.addMember(libraryStateBefore, jessie);
// console.log('%cHello world!', 'color: red; font-weight: bold;');

// console.log(result)
// console.log(_.isEqual(result, expectedUserManagementStateAfter)); // true


// System.addMember関数の単体テスト
var jessie = {
  email: 'jessie@gmail.com',
  password: 'my-secret',
};

var franck = {
  email: 'franck@gmail.com',
  password: 'my-top-secret',
};

var libraryStateBefore = {
  userManagement: {
    membersByEmail: {
      "franck@gmail.com" : {
        email: 'franck@gmail.com',
        password: 'my-top-secret',
      }
    }
  }
}

var expectedLibraryStateBefore = {
  userManagement: {
    membersByEmail: {
      "franck@gmail.com" : {
        email: 'franck@gmail.com',
        password: 'my-top-secret',
      },
      'jessie@gmail.com': {
        email: 'jessie@gmail.com',
        password: 'my-secret',
      },
    }
  }
}

// 空のSystemStateオブジェクトを作成
var systemState= new SystemState();
systemState.commit(null, libraryStateBefore);

// systemStateオブジェクトでミューテーションを実行
System.addMember(systemState, jessie);

// ミューテーションの実行後にシステム状態の検証
console.log(_.isEqual(systemState.get(), expectedLibraryStateBefore)); // true
