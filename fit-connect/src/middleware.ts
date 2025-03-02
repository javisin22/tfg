import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from './app/utils/supabase/middleware';
import { createClient } from '@/utils/supabase/server';

export async function middleware(request: NextRequest) {
  // 1) Update the Supabase session
  const supabaseResponse = await updateSession(request);

  // 2) If accessing admin routes, verify admin permission server-side
  if (request.nextUrl.pathname.startsWith('/home/admin')) {
    try {
      const supabase = createClient();

      // getUser() verifies with the Supabase Auth server
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      // No authenticated user = no access
      if (userError || !user) {
        return NextResponse.redirect(new URL('/login', request.url));
      }

      // Check role from database using the verified user email
      const { data: userData, error } = await supabase.from('users').select('role').eq('email', user.email).single();

      // If not admin, redirect to error page
      if (error || userData?.role !== 'admin') {
        return NextResponse.redirect(new URL('/error', request.url));
      }
    } catch (error) {
      console.error('Error verifying admin access:', error);
      return NextResponse.redirect(new URL('/error', request.url));
    }
  }

  return supabaseResponse;
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
