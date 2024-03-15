import _ from "lodash";

var userManagementData = {
    "librariansByEmail": {
        "franck@gmail.com" : {
            "email": "franck@gmail.com",
            "encryptedPassword": "bXlwYXNzd29yZA==" //<1>
        }
    },
    "membersByEmail": {
        "samantha@gmail.com": {
            "email": "samantha@gmail.com",
            "encryptedPassword": "c2VjcmV0", //<2>
            "isBlocked": false,
            "bookLendings": [
                {
                    "bookItemId": "book-item-1",
                    "bookIsbn": "978-1779501127",
                    "lendingDate": "2020-04-23"
                }
            ]
        }
    }
}

// ユーザーが司書かどうかを確認
function isLibrarian(userManagementData, email) {
    return _.has(_.get(userManagementData, "librariansByEmail"), email)
}

// console.log(isLibrarian(userManagementData, "franck@gmail.com"))
// => true


// 会員がVIP会員かどうかを確認
function isVipMember(userManagementData, email) {
    return _.get(userManagementData, ["membersByEmail", email, "isVip"]) === true
}

console.log(isVipMember(userManagementData, "franck@gmail.com"))
// => false

class UserManagement {
    isLibrarian(userManagementData, email) {
        return _.has(_.get(userManagementData, "librariansByEmail"), email)
    }

    isVipMember(userManagementData, email) {
        return _.get(userManagementData, ["membersByEmail", email, "isVip"]) === true
    }

    isSuperMember(userManagementData, email) {
        return _.get(userManagementData, ["membersByEmail", email, "isSuper"]) === true
    }
}
