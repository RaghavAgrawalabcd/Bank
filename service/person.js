const personDOA = require('../dao/person')

class PersonService{
    createPerson(personDto) {
        const {id,name, email, password} = personDto
        return personDOA.createPerson(id,name,email,password)
    }
}
module.exports = new PersonService();