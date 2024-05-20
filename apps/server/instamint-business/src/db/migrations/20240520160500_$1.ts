import type { Knex } from "knex"

export const up = async (knex: Knex): Promise<void> => {
  return knex.schema.createTable("publications", (table: Knex.TableBuilder) => {
    table.increments("id").primary()
    table.string("description").nullable()
    table.integer("userId").references("id").inTable("users").notNullable()
    table.string("image").notNullable()
    table.timestamps(true, true, true)
  })
}

export const down = async (knex: Knex): Promise<void> => {
  return knex.schema.dropTable("publications")
}
