
exports.up = function(knex) {
    return knex.schema.createTable('employee', (table) => {
        table.increments('id');
        table.string('emailId', 32).notNullable().unique();
        table.string('passw', 32).notNullable();
  })
};

exports.down = function(knex) {
    return knex.schema.dropTable('employee');
};
