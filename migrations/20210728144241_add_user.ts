import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('users', (table) => {
        table.bigInteger('id').unsigned().primary();
        table.string('name');
        table.text('img');
        table.timestamps(false, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('users');
}