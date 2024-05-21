import type { Knex } from "knex"

export const up = async (knex: Knex): Promise<void> => {
  return knex.schema.createTable("followers", (table: Knex.TableBuilder) => {
    table.integer("followedId").references("id").inTable("users").notNullable()
    table.integer("followerId").references("id").inTable("users").notNullable()
  })
}

export const down = async (knex: Knex): Promise<void> => {
  return knex.schema.dropTable("followers")
}
