import type { Knex } from "knex"

export const up = async (knex: Knex): Promise<void> => {
  return knex.schema.createTable("comments", (table: Knex.TableBuilder) => {
    table.increments("id").primary()
    table.string("content").notNullable()
    table.integer("userId").references("id").inTable("users").notNullable()
    table.timestamps(true, true, true)
  })
}

export const down = async (knex: Knex): Promise<void> => {
  return knex.schema.dropTable("comments")
}
