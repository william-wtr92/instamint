import { type Context } from "hono"
import { deleteCookie, setSignedCookie, getSignedCookie } from "hono/cookie"

import appConfig from "@/db/config/config"

export const getCookie = async (c: Context, key: string) => {
  return await getSignedCookie(c, appConfig.security.cookie.secret, key)
}

export const setCookie = async (
  c: Context,
  key: string,
  value: string,
  maxAge?: number
) => {
  await setSignedCookie(c, key, value, appConfig.security.cookie.secret, {
    maxAge: maxAge ? maxAge : appConfig.security.cookie.maxAge,
    sameSite: "Strict",
    path: "/",
    httpOnly: true,
  })
}

export const delCookie = async (c: Context, key: string) => {
  await deleteCookie(c, key, {
    maxAge: 0,
  })
}
