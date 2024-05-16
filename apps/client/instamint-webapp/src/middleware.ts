import { type NextRequest, NextResponse } from "next/server"

import { routes } from "@/web/routes"

export const middleware = (request: NextRequest) => {
  const authToken = request.cookies.get("auth-token")

  if (!authToken) {
    return NextResponse.redirect(new URL(routes.client.signIn, request.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/profile/:path*", "/messages/:path*"],
}
