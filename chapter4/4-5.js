import _ from "lodash";

// 会員を追加するミューテーションのコード
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

class System {
    addMember(member) {
        var previous = SystemState.get()
        var next = Library.addMember(previous, member)

        SystemState.commit(previous, next)
    }
}

class SystemState {
    systemData
    get() {
        return this.systemData
    }

    commit(previous, next) {
        this.systemData = next
    }
}