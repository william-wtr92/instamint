import type { Knex } from "knex"

export const up = async (knex: Knex): Promise<void> => {
  await knex.schema.createTable("rooms", (table: Knex.TableBuilder) => {
    table.increments("id").primary()
    table.string("name").notNullable().unique()
    table.timestamps(true, true, true)
  })

  await knex.schema.createTable("room_users", (table: Knex.TableBuilder) => {
    table.increments("id").primary()
    table.integer("roomId").references("id").inTable("rooms").notNullable()
    table.integer("userId").references("id").inTable("users").notNullable()
    table.timestamps(true, true, true)
  })

  await knex.schema.createTable("messages", (table: Knex.TableBuilder) => {
    table.increments("id").primary()
    table.integer("roomId").references("id").inTable("rooms").notNullable()
    table.integer("userId").references("id").inTable("users").notNullable()
    table.text("content").notNullable()
    table.timestamps(true, true, true)
  })
}

export const down = async (knex: Knex): Promise<void> => {
  await knex.schema.dropTable("messages")
  await knex.schema.dropTable("room_users")
  await knex.schema.dropTable("rooms")
}
