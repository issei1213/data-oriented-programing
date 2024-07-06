import _ from 'lodash'

class CatalogDB {
    static addMember(member) {
        var addMemberQuery = `
            INSERT 
            INTO members (name, encrypted_password)
            VALUES ($1, $2)
        `

        dbClient.query(addMemberQuery, _at(member, ['name', 'encrypted_password']))
    }
}