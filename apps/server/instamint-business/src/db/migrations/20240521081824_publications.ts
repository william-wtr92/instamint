import type { Knex } from "knex"

export const up = async (knex: Knex): Promise<void> => {
  return knex.schema.createTable("publications", (table: Knex.TableBuilder) => {
    table.increments("id").primary()
    table.string("author").notNullable()
    table.string("description").notNullable()
    table.string("image").notNullable()
    table.string("location").nullable()
    table.json("hashtags").notNullable()
    table.timestamps(true, true, true)
    table.integer("userId").references("id").inTable("users").notNullable()
  })
}

export const down = async (knex: Knex): Promise<void> => {
  return knex.schema.dropTable("publications")
}
