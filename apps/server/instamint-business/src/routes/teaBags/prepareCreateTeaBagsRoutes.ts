import { zValidator } from "@hono/zod-validator"
import { type ApiRoutes, SC } from "@instamint/server-types"
import {
  createTeaBagsSchema,
  type CreateTeaBags,
} from "@instamint/shared-types"
import { type Context, Hono } from "hono"

import MembersModel from "@/db/models/MembersModel"
import MembersRolesModel from "@/db/models/MembersRoleModel"
import TeaBagsModel from "@/db/models/TeaBagsModel"
import UserModel from "@/db/models/UserModel"
import { globalsMessages, contextsKeys, teabagsMessages } from "@/def"
import { auth } from "@/middlewares/auth"
import { handleError } from "@/middlewares/handleError"
import type { InsertedMembers } from "@/types/teaBags.type"
import { throwInternalError } from "@/utils/errors/throwInternalError"

const prepareCreateTeaBagsRoutes: ApiRoutes = ({ app, db, redis }) => {
  const createTeabags = new Hono()

  if (!db) {
    throw throwInternalError(
      globalsMessages.databaseNotAvailable,
      SC.serverErrors.INTERNAL_SERVER_ERROR
    )
  }

  if (!redis) {
    throw throwInternalError(
      globalsMessages.redisNotAvailable,
      SC.serverErrors.INTERNAL_SERVER_ERROR
    )
  }

  createTeabags.post(
    "/create",
    auth,
    zValidator("json", createTeaBagsSchema),
    async (c: Context): Promise<Response> => {
      const requestBody: CreateTeaBags = await c.req.json()
      const { name, bio, link }: CreateTeaBags = requestBody

      const contextUser: UserModel = c.get(contextsKeys.user)

      const user = await UserModel.query().findOne({
        email: contextUser.email,
      })

      if (!user) {
        return c.json(teabagsMessages.userNotFound, SC.errors.NOT_FOUND)
      }

      const teaBagsExistByName = await TeaBagsModel.query().findOne({
        name: name,
      })

      if (teaBagsExistByName) {
        return c.json(teabagsMessages.nameAlreadyExist, SC.errors.BAD_REQUEST)
      }

      const teaBagsExistByLink = await TeaBagsModel.query().findOne({
        link: link,
      })

      if (teaBagsExistByLink) {
        return c.json(teabagsMessages.linkAlreadyExist, SC.errors.BAD_REQUEST)
      }

      const newTeabags: Pick<TeaBagsModel, "name" | "bio" | "link" | "owner"> =
        {
          name,
          bio,
          link,
          owner: user.id,
        }

      try {
        await TeaBagsModel.query().insert(newTeabags)

        const teaBagsData = await TeaBagsModel.query().findOne({ name })

        if (!teaBagsData) {
          return c.json(teabagsMessages.teaBagsNotExist, SC.errors.NOT_FOUND)
        }

        const roleId = await MembersRolesModel.query().findOne({
          right: "owner",
        })

        if (!roleId) {
          return c.json(
            teabagsMessages.errorDuringTeabagsCreation,
            SC.errors.NOT_FOUND
          )
        }

        const newTeabagsMembers: InsertedMembers = {
          teaBagsId: teaBagsData.id,
          userId: user.id,
          membersRolesId: roleId.id,
        }

        await MembersModel.query().insert(newTeabagsMembers)

        return c.json(
          {
            message: teabagsMessages.teaBagsCreated.message,
          },
          SC.success.CREATED
        )
      } catch (error) {
        throw throwInternalError(
          teabagsMessages.errorDuringTeabagsCreation,
          SC.serverErrors.SERVICE_UNAVAILABLE
        )
      }
    }
  )

  createTeabags.onError((e: Error, c: Context) => handleError(e, c))

  app.route("/teabags", createTeabags)
}

export default prepareCreateTeaBagsRoutes
