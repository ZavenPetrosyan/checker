// Update with your config settings.

module.exports = {
    development: {
    client: 'postgresql',
    connection: {
        port: Number(process.env.POSTGRES_PORT) || 5432,
        host: process.env.DATABASE_URL || '127.0.0.1',
        database: process.env.POSTGRES_DB || 'domain',
        user: process.env.POSTGRES_USER || 'postgres',
        password:  process.env.POSTGRES_PASSWORD  || 'qweasd123',
    }
  },
  staging: {
    client: 'postgresql',
    connection: {
        port: Number(process.env.POSTGRES_PORT) || 5432,
        host: process.env.DATABASE_URL || '127.0.0.1',
        database: process.env.POSTGRES_DB || 'domain',
        user: process.env.POSTGRES_USER || 'postgres',
        password:  process.env.POSTGRES_PASSWORD  || 'qweasd123',
    },
    pool: {
        min: 2,
        max: 10
    },
    migrations: {
        tableName: 'knex_migrations'
    }
  }};