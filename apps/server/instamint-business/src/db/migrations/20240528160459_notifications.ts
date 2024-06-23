import type { Knex } from "knex"

export const up = async (knex: Knex): Promise<void> => {
  return knex.schema.createTable(
    "notifications",
    (table: Knex.TableBuilder) => {
      table.increments("id").primary()
      table.string("type").notNullable()
      table.boolean("read").defaultTo(false)
      table.timestamps(true, true, true)
      table
        .integer("notifiedUserId")
        .references("id")
        .inTable("users")
        .notNullable()
      table
        .integer("notifierUserId")
        .references("id")
        .inTable("users")
        .notNullable()
    }
  )
}

export const down = async (knex: Knex): Promise<void> => {
  return knex.schema.dropTable("notifications")
}
