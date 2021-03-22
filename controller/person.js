const personService = require('../service/person')

class PersonController {
    async createPerson(user) {
        try {
            const id = await personService.createPerson(user)

        } catch (err) {
            console.error(err)
        }
    }
}

module.exports = new PersonController();