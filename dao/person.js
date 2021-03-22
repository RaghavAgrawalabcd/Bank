const db = require('../db/db')

class PersonDOA{
    async createPerson(Id, name, Email, password) {
        const [id] = await db('employee').insert({
            id: Id,
            ename:name,
            emailId: Email,
            pasw: password
        })
        return id;
    }
}

module.exports=new PersonDOA()