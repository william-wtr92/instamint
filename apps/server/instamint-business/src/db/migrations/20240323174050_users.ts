import type { Knex } from "knex"

export const up = async (knex: Knex): Promise<void> => {
  await knex.schema
    .createTable("roles", (table: Knex.TableBuilder) => {
      table.increments("id")
      table.text("right").notNullable()
    })
    .then(function () {
      return knex("roles").insert([{ right: "admin" }, { right: "minter" }])
    })

  await knex.schema.createTable("users", (table: Knex.TableBuilder) => {
    table.increments("id").primary()
    table.string("username").unique().notNullable()
    table.string("email").unique().notNullable()
    table.text("passwordHash").notNullable()
    table.text("passwordSalt").notNullable()
    table.timestamps(true, true, true)
    table.boolean("emailValidation").notNullable().defaultTo(false)
    table.boolean("gdprValidation").notNullable().defaultTo(false)
    table.integer("roleId").references("id").inTable("roles").defaultTo(1)
  })
}

export const down = async (knex: Knex): Promise<void> => {
  await knex.schema.dropTable("users")
  await knex.schema.dropTable("roles")
}