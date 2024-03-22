import _ from 'lodash'

// 会員を追加するミューテーションのコード

UserManagement.addMember = function(userManagement, member) {
    var email = _.get(member, "email")
    var infopath = ["membersByEmail", email]

    // 同一の電子メールアドレスを持つ会員が存在するかどうかの確認
    if(_.has(userManagement, infopath)) {
        throw "Member already exists"
    }

    var nextUserManagement = _.set(
        // その会員が追加された新しいバージョンのuserManagementを作成
        userManagement,
        infopath,
        member
    )

    return nextUserManagement
}

Library.addMember = function(library, member) {
    var currentUserManagement = _.get(library, "userManagement")
    var nextUserManagement = UserManagement.addMember(
        currentUserManagement,
        member
    )
    var nextLibrary = _.set(library,
        "userManagement",
        // 新しいuserManagementが追加されたバージョンのLibraryを新規作成
        nextUserManagement
    )

    return nextLibrary
}