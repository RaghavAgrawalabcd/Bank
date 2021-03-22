// Update with your config settings.

module.exports = {
  development: {
    client: 'mysql',
    connection: {
      host:'localhost',
      user:     'root',
      password: '.gp.gp.ad',
      database: 'bank'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
};
