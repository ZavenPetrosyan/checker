exports.up = function(knex, Promise) {
    return knex.schema.createTable('domain', function (t) {
        t.increments('id').primary();
        t.string('name').notNullable().unique();
        t.integer('expiry').nullable();
        t.string('last_detected').nullable();
        t.boolean('possybly_available').defaultTo(false);
        t.specificType('addresses', 'varchar(255)[]');
        t.string('nsname').nullable();
        t.integer('serial').nullable();
        t.integer('refresh').nullable();
        t.integer('retry').nullable();
        t.integer('min_ttl').nullable();
        t.string('host_master').nullable();
    }).catch(err => { console.log(err) });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('domain').catch(err => console.log(err));
};