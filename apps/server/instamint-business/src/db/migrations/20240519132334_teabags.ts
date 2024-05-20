import type { Knex } from "knex"

export const up = async (knex: Knex): Promise<void> => {
  await knex.schema.createTable("teaBags", (table: Knex.TableBuilder) => {
    table.increments("id").primary()
    table.string("name").notNullable().unique()
    table.string("bio").nullable()
    table.string("link").unique().nullable()
    table.integer("cookNumber").notNullable().defaultTo(1)
    table.integer("owner").references("id").inTable("users").notNullable()
    table.boolean("delete").notNullable().defaultTo(false)
    table.timestamps(true, true, true)
  })

  await knex.schema
    .createTable("membersRoles", (table: Knex.TableBuilder) => {
      table.increments("id")
      table.text("right").notNullable()
    })
    .then(() => {
      return knex("membersRoles").insert([
        { right: "owner" },
        { right: "cook" },
        { right: "members" },
        { right: "pending" },
      ])
    })

  await knex.schema.createTable("members", (table: Knex.TableBuilder) => {
    table.increments("id").primary()
    table.integer("teaBagsId").references("id").inTable("teaBags").notNullable()
    table.integer("userId").references("id").inTable("users").notNullable()
    table
      .integer("membersRolesId")
      .references("id")
      .inTable("membersRoles")
      .notNullable()
    table.timestamps(true, true, true)
  })
}

export const down = async (knex: Knex): Promise<void> => {
  await knex.schema.dropTable("members")
  await knex.schema.dropTable("membersRoles")
  await knex.schema.dropTable("teaBags")
}
