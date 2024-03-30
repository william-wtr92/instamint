# 🛡️ Middlewares

> Middlewares are functions that have access to the request object (req), the response object (res), and the next
> middleware function in the application’s request-response cycle.

## 📚 Resources

- [📖 Middleware for Pages Router](https://nextjs.org/docs/pages/building-your-application/routing/middleware)
- [📖 Redirecting](https://nextjs.org/docs/pages/building-your-application/routing/redirecting)
- [📖 Upgrade Guide](https://nextjs.org/docs/messages/middleware-upgrade-guide)

## 🔨 Usage in Next.js

> On Instamint we use middlewares to handle authentication, authorization, and other tasks that need to be performed

### 💡 Creating a Middleware

- Create a new file named `middleware.ts` in your `src` folder of your project. ⚠️ **Pages Router**
- And you can create a middleware function like this to check if the user is authenticated or not:

```ts
export const middleware = (request: NextRequest) => {
  const authToken = request.cookies.get("token-name") // Replace with your token name

  if (!authToken) {
    return NextResponse.redirect(new URL("/path-to-sign-in", request.nextUrl)) // Redirect to sign-in page if a valid cookie is not found
  }

  return NextResponse.next() // Continue to the next middleware
}

export const config = {
  matcher: ["/"], // Path to apply the middleware
}
```

- All middleware code will be run on the server side and will not be included in the client-side bundle.

### 🧩 Methods of NextResponse

- `NextResponse.redirect`: To redirect to another page.
- `NextResponse.next`: To continue to the next middleware.
- `NextResponse.json`: To return a JSON response.
- `NextResponse.send`: To return a response with custom headers.
- `NextResponse.cookie`: To set a cookie in the response.

### 🧩 Methods of NextRequest

- `request.cookies.(get|set)`: To get or set a cookie from the request.
- `request.headers.(get|set)`: To get or set a header from the request.
- `request.query`: To get the query parameters from the request.
- `request.body`: To get the body of the request.
- `request.url`: To get the URL of the request.
- `request.method`: To get the method of the request.
- `request.nextUrl`: To get the next URL of the request.
- `request.geo`: To get the geolocation of the request.
- `request.ip`: To get the IP address of the request.
- `request.userAgent`: To get the user agent of the request.

and more go to
the [Next.js Middleware Documentation](https://nextjs.org/docs/pages/building-your-application/routing/middleware)

### 🚀 Dynamic Path Matching

> You can use dynamic path matching in the `matcher` array to apply the middleware to multiple paths.

- You can also use dynamic path matching in the `matcher` array like this:

```ts
export const config = {
  matcher: ["/users/[id]"], // Path to apply the middleware
}
```

Or you can use multiple paths like this:

```ts
export const config = {
  matcher: ["/users/[id]", "/users/[id]/edit"], // Path to apply the middleware
}
```

- You can use a wildcard like this:

```ts
export const config = {
  matcher: ["/users/*"], // Path to apply the middleware at all paths starting with /users/ but not /users
  // matcher: ["/users/:path*"]   // Path to apply the middleware at all paths starting with /users/ including /users
}
```

And you can use a regular expression like this:

```ts
export const config = {
  matcher: ["/users/\\d+"], // Path to apply the middleware at all paths starting with /users/ followed by a number
}
```
