// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// You can add any paths that should be accessible without authentication
const publicPaths = ['/api/auth/signin', '/api/auth/signout', '/api/auth/session', '/api/auth/providers']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the pathname is in the public paths , if yes then move onn.
  if (publicPaths.includes(pathname)) {
    return NextResponse.next()
  }

  // Fetches the token out from the request URL
  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET })

  // This checks if the token is not valid or if the path is not in the publicPaths thing , then it will send you to signin page automatically
  if (!token && pathname !== '/api/auth/signin') {
    const signInUrl = new URL('/api/auth/signin', request.url)
    signInUrl.searchParams.set('callbackUrl', encodeURI(request.url))
    return NextResponse.redirect(signInUrl)
  }

  // Better life update - if the users session if valid : aka token is proved - then the user just gets re-directed to the dashboards page (for now back to the main page cause there is no other page available ).
  if (token && pathname === '/api/auth/signin') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

// Configure on which routes to run the middleware - matches and checks and pushes Auth on those - basically everything except the ones excluded above
export const config = {
  // You can exclude api routes if you don't want to run middleware on them
  /**
   * Paths included API
   * _next
   * _static
   * _vercel
   * and rest i dont understand myself
   */
  matcher: ['/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)'],
}