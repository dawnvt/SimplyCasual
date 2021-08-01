import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('scores', (table) => {
        table.uuid('id').defaultTo(knex.raw("gen_random_uuid()")).primary();
        table.string('difficulty');
        table.float('percent');
        table.integer('score');
        table.integer('modifiers');
        table.integer('misses');
        table.integer('bad_cuts');
        table.string('hmd');
        table.bigInteger('user_id').unsigned();
        table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
        table.uuid('song_id');
        table.foreign('song_id').references('id').inTable('songs').onDelete('CASCADE');
        table.timestamps(false, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('scores');
}