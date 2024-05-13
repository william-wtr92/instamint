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
    table.string("bio").nullable()
    table.string("link").unique().nullable()
    table.string("location").nullable()
    table.text("passwordHash").notNullable()
    table.text("passwordSalt").notNullable()
    table.timestamps(true, true, true)
    table.boolean("emailValidation").notNullable().defaultTo(false)
    table.boolean("gdprValidation").notNullable().defaultTo(false)
    table.boolean("active").notNullable().defaultTo(true)
    table.timestamp("deactivationDate").defaultTo(null)
    table.timestamp("deletionDate").defaultTo(null)
    table.boolean("twoFactorAuthentication").notNullable().defaultTo(false)
    table.text("secret").nullable().defaultTo(null)
    table.text("twoFactorBackupCodes").nullable().defaultTo(null)
    table.integer("roleId").references("id").inTable("roles").defaultTo(2)
  })
}

export const down = async (knex: Knex): Promise<void> => {
  await knex.schema.dropTable("users")
  await knex.schema.dropTable("roles")
}
