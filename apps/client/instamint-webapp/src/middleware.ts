import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export const middleware = (request: NextRequest) => {
  const authToken = request.cookies.get("auth-token")

  if (!authToken) {
    return NextResponse.redirect(new URL(request.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/profile/:path*"],
}
