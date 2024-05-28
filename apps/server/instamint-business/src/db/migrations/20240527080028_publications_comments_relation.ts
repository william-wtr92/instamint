import type { Knex } from "knex"

export const up = async (knex: Knex): Promise<void> => {
  return knex.schema.createTable(
    "publications_comments_relation",
    (table: Knex.TableBuilder) => {
      table.increments("id")
      table.integer("userId").references("id").inTable("users").notNullable()
      table
        .integer("publicationId")
        .references("id")
        .inTable("publications")
        .notNullable()
      table
        .integer("commentId")
        .references("id")
        .inTable("comments")
        .notNullable()
      table.integer("parentId").nullable()
      table.primary(["id", "userId", "publicationId", "commentId"])
    }
  )
}

export const down = async (knex: Knex): Promise<void> => {
  return knex.schema.dropTable("publications_comments_relation")
}
