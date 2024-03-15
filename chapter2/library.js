class Library {
    static getBookLendings(libraryData, userId, memberId) {
        if(UserManagement.isLibrarian(libraryData.userManagement, userId) || UserManagement.isSuperMember(libraryData.userManagement, userId)) {
            return Catalog.getBookLendings(libraryData.catalog, memberId)
        } else {
            throw new Error("You are not authorized to perform this operation")
        }
    }

    static addBookItem(libraryData, userId, bookItem) {
        if(UserManagement.isLibrarian(libraryData.userManagement, userId) || UserManagement.isVipMember(libraryData.userManagement, userId)) {
            Catalog.addBookItem(libraryData.catalog, bookItem)
        } else {
            throw new Error("You are not authorized to perform this operation")
        }
    }
}

class UserManagement {
    static isLibrarian(userManagementData, userId) {
        //...
    
    }

    static isSuperMember(userManagementData, userId) {
        //...
    }

    static isVipMember(userManagementData, userId) {
        //...
    }
}

class Catalog {
    static getBookLendings(catalogData, memberId) {
        //...
    }

    static addBookItem(catalogData, bookItem) {
        //...
    }
}