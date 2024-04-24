import knex from "knex"

import { hashPassword } from "../../utils/helpers/hashPassword"
import appConfig from "../config/config"
import type UserModel from "../models/UserModel"

const seed = async () => {
  const db = knex(appConfig.db)

  await db("users").del()

  const [predefinedPasswordHash, predefinedPasswordSalt]: string[] =
    await hashPassword("Password1234!")

  const users: Pick<
    UserModel,
    | "username"
    | "email"
    | "passwordHash"
    | "passwordSalt"
    | "gdprValidation"
    | "roleId"
    | "emailValidation"
  >[] = [
    {
      username: "user",
      email: "user@gmail.com",
      passwordHash: predefinedPasswordHash,
      passwordSalt: predefinedPasswordSalt,
      emailValidation: true,
      gdprValidation: true,
      roleId: 2,
    },
    {
      username: "admin",
      email: "admin@gmail.com",
      passwordHash: predefinedPasswordHash,
      passwordSalt: predefinedPasswordSalt,
      emailValidation: true,
      gdprValidation: true,
      roleId: 1,
    },
  ]

  await db("users").insert(users)
}

module.exports = { seed }
