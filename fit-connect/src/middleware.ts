import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from './app/utils/supabase/middleware';

export async function middleware(request: NextRequest) {
  // 1) Call the updateSession function to handle Supabase auth checks
  let supabaseResponse = await updateSession(request);

  // 2) Extract the role from cookies
  console.log('Cookies:', request.cookies.getAll());
  const role = request.cookies.get('role')?.value || 'user';

  console.log('Role:', role);

  // 3) Check if user is visiting an admin page
  if (request.nextUrl.pathname.startsWith('/home/admin') && role !== 'admin') {
    // 4) Redirect them to /error
    const url = request.nextUrl.clone();
    url.pathname = '/error';
    const redirectResponse = NextResponse.redirect(url);

    // Now it's necessary to copy the cookies from supabaseResponse to ensure we don't lose session data
    const originalCookies = supabaseResponse.cookies.getAll();
    for (const cookie of originalCookies) redirectResponse.cookies.set(cookie.name, cookie.value);

    return redirectResponse;
  }

  // 5) Otherwise, allow the user to continue
  return supabaseResponse;
  // return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
