import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('songs', (table) => {
        table.uuid('id').defaultTo(knex.raw("gen_random_uuid()")).primary();
        table.string('key');
        table.string('name');
        table.string('sub_name');
        table.string('cover');
        table.string('hash');
        table.string('song_author_name');
        table.string('level_author_name');
        table.json('difficulties');
        table.timestamps(false, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('songs');
}