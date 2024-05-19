import { type NextRequest, NextResponse } from "next/server"

import { routes } from "@/web/routes"

export const middleware = async (request: NextRequest) => {
  const authToken = request.cookies.get("auth-token")?.value

  if (!authToken) {
    return NextResponse.redirect(new URL(routes.client.signIn, request.nextUrl))
  }

  try {
    const response = await fetch(
      `${request.nextUrl.origin}${routes.api.auth.internal.authenticate}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: `auth-token=${authToken}`,
        },
        credentials: "include",
      }
    )

    if (!response.ok) {
      return NextResponse.redirect(
        new URL(routes.client.signIn, request.nextUrl)
      )
    }

    const userData = await response.json()
    const userRole = userData.result?.roleData

    if (request.nextUrl.pathname.startsWith("/admin") && userRole !== "admin") {
      return NextResponse.redirect(new URL(routes.client.home, request.nextUrl))
    }

    return NextResponse.next()
  } catch (err) {
    return NextResponse.redirect(new URL(routes.client.signIn, request.nextUrl))
  }
}

export const config = {
  matcher: ["/", "/profile/:path*", "/messages/:path*", "/admin/:path*"],
}
