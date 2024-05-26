import type { Knex } from "knex"

export const up = async (knex: Knex): Promise<void> => {
  return knex.schema.createTable(
    "publication_likes",
    (table: Knex.TableBuilder) => {
      table.integer("userId").references("id").inTable("users").notNullable()
      table
        .integer("publicationId")
        .references("id")
        .inTable("publications")
        .notNullable()
    }
  )
}

export const down = async (knex: Knex): Promise<void> => {
  return knex.schema.dropTable("publication_likes")
}
