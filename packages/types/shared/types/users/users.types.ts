import {
  Publication,
  publicationSchema,
} from "types/publications/publications.types"
import { Role, RoleSchema } from "./roles.types"
import { z } from "zod"

export const InsertedUserSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  passwordHash: z.string(),
  passwordSalt: z.string(),
  gdprValidation: z.boolean(),
})

export type User = {
  id: number
  username: string
  email: string
  bio: string
  link: string
  location: string
  avatar: string
  passwordHash: string
  passwordSalt: string
  createdAt: Date
  updatedAt: Date
  emailValidation: boolean
  gdprValidation: boolean
  active: boolean
  deactivationDate: Date | null
  deletionDate: Date | null
  roleId: number
  roleData: Role
  twoFactorAuthentication: boolean
  secret: string | null
  twoFactorBackupCodes: string | null
  publicationData: Publication[]
  count: string
}

export type InsertedUser = z.infer<typeof InsertedUserSchema>

export type AdditionalUserFields = Omit<User, "username" | "email">
export type CommentUser = Pick<User, "id" | "avatar" | "username">
